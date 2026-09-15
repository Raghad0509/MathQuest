from django.urls import path

from stats.views import user_statistics

urlpatterns = [
    path("statistics/<int:user_id>/", user_statistics, name="user-statistics"),
]
