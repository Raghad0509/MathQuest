from __future__ import annotations

from datetime import timedelta

from django.db.models import Max, Sum
from django.utils import timezone

from stats.models import Statistics


def ensure_statistics(user):
    stats, _ = Statistics.objects.get_or_create(user=user)
    return stats


def update_statistics_from_session(session):
    from game.models import GameSession

    stats = ensure_statistics(session.user)

    sessions = GameSession.objects.filter(user=session.user)
    totals = sessions.aggregate(
        total_score=Sum("score"),
        total_correct=Sum("correct_answers"),
        total_questions=Sum("total_questions"),
        best_score=Max("score"),
    )

    total_games = sessions.count()
    total_score = totals["total_score"] or 0
    total_correct = totals["total_correct"] or 0
    total_questions = totals["total_questions"] or 0
    best_score = totals["best_score"] or 0
    completed_levels = sessions.filter(completed=True).count()

    accuracy = round((total_correct / total_questions) * 100, 2) if total_questions else 0.0

    stats.total_games = total_games
    stats.total_score = total_score
    stats.accuracy_rate = accuracy
    stats.best_score = best_score
    stats.completed_levels = completed_levels
    stats.save()

    return stats


def apply_daily_streak_bonus(session, *, base_bonus_points: int = 10, streak_step_bonus: int = 5):
    stats = ensure_statistics(session.user)
    today = timezone.localdate()
    last_played = stats.last_played_date

    if last_played == today:
        return {
            "bonus_points": 0,
            "current_streak": stats.current_streak,
            "longest_streak": stats.longest_streak,
        }

    if last_played == today - timedelta(days=1):
        stats.current_streak += 1
    else:
        stats.current_streak = 1

    stats.longest_streak = max(stats.longest_streak, stats.current_streak)
    stats.last_played_date = today
    stats.save(update_fields=["current_streak", "longest_streak", "last_played_date", "updated_at"])

    bonus_points = base_bonus_points + ((stats.current_streak - 1) * streak_step_bonus)
    session.score += bonus_points
    session.save(update_fields=["score"])

    return {
        "bonus_points": bonus_points,
        "current_streak": stats.current_streak,
        "longest_streak": stats.longest_streak,
    }
