from __future__ import annotations

import random

from django.db import transaction
from django.db.models import Q

from achievements.services import award_achievements_for_session
from game.models import GameSession, Obstacle, Question, SessionQuestion
from stats.services import apply_daily_streak_bonus, ensure_statistics, update_statistics_from_session

HINT_COST_POINTS = 5


def start_game_session(*, user_id: int, level_id: int) -> GameSession:
    session = GameSession.objects.create(user_id=user_id, level_id=level_id)
    ensure_statistics(session.user)
    return session


def get_next_obstacle(session: GameSession) -> Obstacle | None:
    obstacles = session.level.obstacles.all().order_by("sequence_order")
    for obstacle in obstacles:
        correct_count = session.session_questions.filter(obstacle=obstacle, is_correct=True).count()
        if correct_count < obstacle.required_questions:
            return obstacle
    return None


def _pick_operation_for_obstacle(obstacle: Obstacle) -> str:
    mapping = {
        "bridge": "addition",
        "gate": "subtraction",
        "rock": "multiplication",
        "magical_door": "division",
        "mini_boss": random.choice(["addition", "subtraction", "multiplication", "division"]),
        "treasure_chest": random.choice(["addition", "subtraction", "multiplication", "division"]),
    }
    return mapping.get(obstacle.obstacle_type, "addition")


def get_question_for_obstacle(*, session: GameSession, obstacle: Obstacle) -> Question:
    asked_ids = list(
        SessionQuestion.objects.filter(session=session, obstacle=obstacle).values_list("question_id", flat=True)
    )
    operation = _pick_operation_for_obstacle(obstacle)

    base_query = Question.objects.filter(difficulty=session.level.difficulty).exclude(id__in=asked_ids)
    candidate = base_query.filter(operation=operation).order_by("?").first()
    if candidate:
        return candidate

    candidate = base_query.order_by("?").first()
    if candidate:
        return candidate

    # Fallback for very short question banks.
    fallback = Question.objects.filter(
        Q(difficulty=session.level.difficulty) | Q(operation=operation)
    ).order_by("?").first()
    if fallback:
        return fallback

    raise Question.DoesNotExist("No questions available for this session.")


def score_for_answer(*, is_correct: bool, obstacle: Obstacle) -> int:
    if not is_correct:
        return 0
    return obstacle.reward_points


def get_hint_for_question(*, session: GameSession, question: Question) -> dict:
    if session.completed:
        raise ValueError("Session already completed.")
    if session.score < HINT_COST_POINTS:
        raise ValueError(f"Not enough points for a hint. Need at least {HINT_COST_POINTS} points.")

    options = ["A", "B", "C", "D"]
    wrong_options = [option for option in options if option != question.correct_answer.upper()]
    eliminated_option = random.choice(wrong_options)

    session.score -= HINT_COST_POINTS
    session.save(update_fields=["score"])

    return {
        "hint_cost": HINT_COST_POINTS,
        "eliminated_option": eliminated_option,
        "hint_message": f"Try removing option {eliminated_option}.",
        "session": session,
    }


@transaction.atomic
def submit_answer(*, session: GameSession, obstacle: Obstacle, question: Question, selected_answer: str) -> dict:
    selected = selected_answer.upper()
    is_correct = selected == question.correct_answer.upper()

    SessionQuestion.objects.create(
        session=session,
        question=question,
        obstacle=obstacle,
        selected_answer=selected,
        is_correct=is_correct,
    )

    session.total_questions += 1
    if is_correct:
        session.correct_answers += 1
        session.score += score_for_answer(is_correct=True, obstacle=obstacle)
    else:
        session.wrong_answers += 1
    session.save(update_fields=["total_questions", "correct_answers", "wrong_answers", "score"])

    obstacle_correct = session.session_questions.filter(obstacle=obstacle, is_correct=True).count()
    obstacle_solved = obstacle_correct >= obstacle.required_questions
    level_completed = get_next_obstacle(session) is None

    if level_completed and not session.completed:
        session.completed = True
        session.save(update_fields=["completed"])

    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "obstacle_solved": obstacle_solved,
        "level_completed": level_completed,
        "session": session,
    }


@transaction.atomic
def complete_session(*, session: GameSession) -> dict:
    if not session.completed:
        # Allow explicit complete endpoint to finalize once all obstacles are cleared.
        session.completed = get_next_obstacle(session) is None
        session.save(update_fields=["completed"])

    daily_streak = {"bonus_points": 0, "current_streak": 0, "longest_streak": 0}
    if session.completed:
        daily_streak = apply_daily_streak_bonus(session)

    stats = update_statistics_from_session(session)
    earned = award_achievements_for_session(session)

    return {
        "completed": session.completed,
        "session": session,
        "statistics": stats,
        "earned_achievements": earned,
        "daily_streak": daily_streak,
    }
