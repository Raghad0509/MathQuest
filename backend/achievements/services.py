from __future__ import annotations

from achievements.models import Achievement, UserAchievement
from game.models import GameSession
from stats.services import ensure_statistics


def _award_if_needed(*, session: GameSession, title: str, condition: bool, earned: list[Achievement]):
    if not condition:
        return

    achievement = Achievement.objects.filter(title=title).first()
    if not achievement:
        return

    created = UserAchievement.objects.get_or_create(user=session.user, achievement=achievement)[1]
    if created:
        earned.append(achievement)


def award_achievements_for_session(session: GameSession) -> list[Achievement]:
    stats = ensure_statistics(session.user)
    earned: list[Achievement] = []

    _award_if_needed(
        session=session,
        title="First Treasure",
        condition=session.completed and stats.completed_levels >= 1,
        earned=earned,
    )
    _award_if_needed(
        session=session,
        title="Puzzle Master",
        condition=session.correct_answers >= 6,
        earned=earned,
    )
    _award_if_needed(
        session=session,
        title="Fast Solver",
        condition=session.total_questions > 0 and (session.correct_answers / session.total_questions) >= 0.9,
        earned=earned,
    )
    _award_if_needed(
        session=session,
        title="Explorer Champion",
        condition=stats.completed_levels >= 5,
        earned=earned,
    )
    _award_if_needed(
        session=session,
        title="Score Hunter",
        condition=session.score >= 120,
        earned=earned,
    )

    return earned
