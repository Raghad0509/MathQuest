from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from game.models import GameSession, Level, Obstacle, Question
from game.serializers import (
    CompleteGameSerializer,
    GameSessionSerializer,
    HintRequestSerializer,
    LevelSerializer,
    ObstacleSerializer,
    QuestionSerializer,
    StartGameSerializer,
    SubmitAnswerSerializer,
)
from game.services import complete_session, get_hint_for_question, get_next_obstacle, get_question_for_obstacle, start_game_session, submit_answer


class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.filter(is_active=True).order_by("unlock_order")
    serializer_class = LevelSerializer


@api_view(["POST"])
def start_game(request):
    serializer = StartGameSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    session = start_game_session(
        user_id=serializer.validated_data["user_id"],
        level_id=serializer.validated_data["level_id"],
    )
    return Response(GameSessionSerializer(session).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def next_obstacle(request, session_id: int):
    session = get_object_or_404(GameSession, id=session_id)
    obstacle = get_next_obstacle(session)

    if obstacle is None:
        return Response({"level_completed": True, "next_obstacle": None})

    solved_questions = session.session_questions.filter(obstacle=obstacle, is_correct=True).count()
    remaining = max(obstacle.required_questions - solved_questions, 0)

    return Response(
        {
            "level_completed": False,
            "next_obstacle": ObstacleSerializer(obstacle).data,
            "remaining_questions": remaining,
        }
    )


@api_view(["GET"])
def obstacle_question(request, session_id: int, obstacle_id: int):
    session = get_object_or_404(GameSession, id=session_id)
    obstacle = get_object_or_404(Obstacle, id=obstacle_id, level=session.level)

    question = get_question_for_obstacle(session=session, obstacle=obstacle)
    return Response(
        {
            "obstacle": ObstacleSerializer(obstacle).data,
            "question": QuestionSerializer(question).data,
        }
    )


@api_view(["POST"])
def answer_question(request):
    serializer = SubmitAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    session = get_object_or_404(GameSession, id=serializer.validated_data["session_id"])
    obstacle = get_object_or_404(Obstacle, id=serializer.validated_data["obstacle_id"], level=session.level)
    question = get_object_or_404(Question, id=serializer.validated_data["question_id"])

    result = submit_answer(
        session=session,
        obstacle=obstacle,
        question=question,
        selected_answer=serializer.validated_data["selected_answer"],
    )

    feedback = "Great job!" if result["is_correct"] else "Almost! Try again."

    return Response(
        {
            "is_correct": result["is_correct"],
            "correct_answer": result["correct_answer"],
            "obstacle_solved": result["obstacle_solved"],
            "level_completed": result["level_completed"],
            "feedback": feedback,
            "session": GameSessionSerializer(result["session"]).data,
        }
    )


@api_view(["POST"])
def get_hint(request):
    serializer = HintRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    session = get_object_or_404(GameSession, id=serializer.validated_data["session_id"])
    obstacle = get_object_or_404(Obstacle, id=serializer.validated_data["obstacle_id"], level=session.level)
    question = get_object_or_404(Question, id=serializer.validated_data["question_id"])

    # Hint can only be requested for the currently active obstacle.
    if get_next_obstacle(session) != obstacle:
        raise ValidationError("Hints are only available for the current obstacle.")

    try:
        hint = get_hint_for_question(session=session, question=question)
    except ValueError as exc:
        raise ValidationError(str(exc))

    return Response(
        {
            "hint_cost": hint["hint_cost"],
            "eliminated_option": hint["eliminated_option"],
            "hint_message": hint["hint_message"],
            "session": GameSessionSerializer(hint["session"]).data,
        }
    )


@api_view(["POST"])
def complete_game(request):
    serializer = CompleteGameSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    session = get_object_or_404(GameSession, id=serializer.validated_data["session_id"])
    result = complete_session(session=session)

    earned = [
        {
            "id": achievement.id,
            "title": achievement.title,
            "description": achievement.description,
            "badge_icon": achievement.badge_icon,
        }
        for achievement in result["earned_achievements"]
    ]

    return Response(
        {
            "completed": result["completed"],
            "session": GameSessionSerializer(result["session"]).data,
            "statistics": {
                "total_games": result["statistics"].total_games,
                "total_score": result["statistics"].total_score,
                "accuracy_rate": result["statistics"].accuracy_rate,
                "best_score": result["statistics"].best_score,
                "completed_levels": result["statistics"].completed_levels,
                "current_streak": result["statistics"].current_streak,
                "longest_streak": result["statistics"].longest_streak,
            },
            "daily_streak": result["daily_streak"],
            "earned_achievements": earned,
        }
    )
