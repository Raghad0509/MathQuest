from django.urls import path

from achievements.views import user_achievements

urlpatterns = [
    path("achievements/<int:user_id>/", user_achievements, name="user-achievements"),
]
