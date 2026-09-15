from django.db import models


class Statistics(models.Model):
    user = models.OneToOneField("users.UserProfile", related_name="statistics", on_delete=models.CASCADE)
    total_games = models.PositiveIntegerField(default=0)
    total_score = models.PositiveIntegerField(default=0)
    accuracy_rate = models.FloatField(default=0.0)
    best_score = models.PositiveIntegerField(default=0)
    completed_levels = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_played_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Stats - {self.user.name}"
