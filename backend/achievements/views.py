from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from achievements.models import Achievement, UserAchievement
from achievements.serializers import AchievementSerializer
from users.models import UserProfile


@api_view(["GET"])
def user_achievements(request, user_id: int):
    user = get_object_or_404(UserProfile, id=user_id)
    earned_entries = UserAchievement.objects.filter(user=user).select_related("achievement")
    earned_map = {entry.achievement_id: entry for entry in earned_entries}

    achievements = Achievement.objects.all().order_by("id")
    serializer = AchievementSerializer(achievements, many=True, context={"earned_map": earned_map})
    return Response(serializer.data)
