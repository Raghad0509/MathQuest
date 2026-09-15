from django.db import models


class Achievement(models.Model):
    title = models.CharField(max_length=120, unique=True)
    description = models.CharField(max_length=255)
    badge_icon = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.title


class UserAchievement(models.Model):
    user = models.ForeignKey("users.UserProfile", related_name="user_achievements", on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, related_name="user_achievements", on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-earned_at"]
        unique_together = ("user", "achievement")

    def __str__(self) -> str:
        return f"{self.user.name} - {self.achievement.title}"
