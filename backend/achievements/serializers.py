from rest_framework import serializers

from achievements.models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    earned = serializers.SerializerMethodField()
    earned_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ["id", "title", "description", "badge_icon", "earned", "earned_at"]

    def get_earned(self, obj):
        earned_map = self.context.get("earned_map", {})
        return obj.id in earned_map

    def get_earned_at(self, obj):
        earned_map = self.context.get("earned_map", {})
        entry = earned_map.get(obj.id)
        return entry.earned_at if entry else None


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ["id", "user", "achievement", "earned_at"]
