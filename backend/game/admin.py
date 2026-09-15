from django.contrib import admin

from game.models import GameSession, Level, Obstacle, Question, SessionQuestion


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "world", "difficulty", "unlock_order", "is_active")
    list_filter = ("difficulty", "world", "is_active")


@admin.register(Obstacle)
class ObstacleAdmin(admin.ModelAdmin):
    list_display = ("id", "obstacle_name", "level", "obstacle_type", "sequence_order", "required_questions")
    list_filter = ("obstacle_type", "level")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "question_text", "operation", "difficulty", "correct_answer")
    list_filter = ("operation", "difficulty")


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "level",
        "score",
        "correct_answers",
        "wrong_answers",
        "completed",
        "played_at",
    )
    list_filter = ("completed", "level")


@admin.register(SessionQuestion)
class SessionQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "question", "obstacle", "selected_answer", "is_correct", "answered_at")
    list_filter = ("is_correct", "obstacle")
