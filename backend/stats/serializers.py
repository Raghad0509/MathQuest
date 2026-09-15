from rest_framework import serializers

from stats.models import Statistics


class StatisticsSerializer(serializers.ModelSerializer):
    total_treasures_opened = serializers.SerializerMethodField()

    class Meta:
        model = Statistics
        fields = [
            "id",
            "user",
            "total_games",
            "total_score",
            "accuracy_rate",
            "best_score",
            "completed_levels",
            "current_streak",
            "longest_streak",
            "last_played_date",
            "total_treasures_opened",
            "updated_at",
        ]

    def get_total_treasures_opened(self, obj):
        return obj.completed_levels
