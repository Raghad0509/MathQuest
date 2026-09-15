from django.contrib import admin

from stats.models import Statistics


@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    list_display = (
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
        "updated_at",
    )
