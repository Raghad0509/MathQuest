from django.contrib import admin

from achievements.models import Achievement, UserAchievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "badge_icon")


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "achievement", "earned_at")
    list_filter = ("achievement",)
