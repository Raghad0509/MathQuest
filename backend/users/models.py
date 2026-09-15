from django.db import models


class UserProfile(models.Model):
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("es", "Spanish"),
        ("fr", "French"),
    ]

    name = models.CharField(max_length=80)
    avatar = models.CharField(max_length=255, blank=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default="en")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.name
