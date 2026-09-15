from rest_framework import serializers

from game.models import GameSession, Level, Obstacle, Question, SessionQuestion


class ObstacleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Obstacle
        fields = [
            "id",
            "level",
            "obstacle_type",
            "obstacle_name",
            "sequence_order",
            "required_questions",
            "reward_points",
        ]


class LevelSerializer(serializers.ModelSerializer):
    obstacles = ObstacleSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["id", "name", "world", "difficulty", "unlock_order", "is_active", "obstacles"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "id",
            "operation",
            "difficulty",
            "question_text",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
        ]


class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = [
            "id",
            "user",
            "level",
            "score",
            "correct_answers",
            "wrong_answers",
            "total_questions",
            "completed",
            "played_at",
        ]


class SessionQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionQuestion
        fields = [
            "id",
            "session",
            "question",
            "obstacle",
            "selected_answer",
            "is_correct",
            "answered_at",
        ]


class StartGameSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(min_value=1)
    level_id = serializers.IntegerField(min_value=1)


class SubmitAnswerSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(min_value=1)
    obstacle_id = serializers.IntegerField(min_value=1)
    question_id = serializers.IntegerField(min_value=1)
    selected_answer = serializers.ChoiceField(choices=["A", "B", "C", "D", "a", "b", "c", "d"])


class CompleteGameSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(min_value=1)


class HintRequestSerializer(serializers.Serializer):
    session_id = serializers.IntegerField(min_value=1)
    obstacle_id = serializers.IntegerField(min_value=1)
    question_id = serializers.IntegerField(min_value=1)
