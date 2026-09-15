from django.urls import path
from rest_framework.routers import DefaultRouter

from game.views import LevelViewSet, answer_question, complete_game, get_hint, next_obstacle, obstacle_question, start_game

router = DefaultRouter()
router.register(r"levels", LevelViewSet, basename="levels")

urlpatterns = [
    path("game/start/", start_game, name="start-game"),
    path("game/next-obstacle/<int:session_id>/", next_obstacle, name="next-obstacle"),
    path("game/question/<int:session_id>/<int:obstacle_id>/", obstacle_question, name="obstacle-question"),
    path("game/hint/", get_hint, name="game-hint"),
    path("game/answer/", answer_question, name="answer-question"),
    path("game/complete/", complete_game, name="complete-game"),
] + router.urls
