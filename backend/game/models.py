from django.db import models


class Level(models.Model):
    WORLD_CHOICES = [
        ("forest", "Forest of Numbers"),
        ("bridge", "Bridge of Addition"),
        ("cave", "Cave of Multiplication"),
        ("castle", "Castle of Equations"),
        ("island", "Treasure Island"),
    ]

    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    name = models.CharField(max_length=120)
    world = models.CharField(max_length=30, choices=WORLD_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default="easy")
    unlock_order = models.PositiveIntegerField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["unlock_order"]

    def __str__(self) -> str:
        return self.name


class Obstacle(models.Model):
    OBSTACLE_CHOICES = [
        ("treasure_chest", "Treasure Chest"),
        ("bridge", "Bridge"),
        ("gate", "Gate"),
        ("rock", "Rock"),
        ("magical_door", "Magical Door"),
        ("mini_boss", "Mini Boss"),
    ]

    level = models.ForeignKey(Level, related_name="obstacles", on_delete=models.CASCADE)
    obstacle_type = models.CharField(max_length=30, choices=OBSTACLE_CHOICES)
    obstacle_name = models.CharField(max_length=120)
    sequence_order = models.PositiveIntegerField()
    required_questions = models.PositiveIntegerField(default=1)
    reward_points = models.PositiveIntegerField(default=10)

    class Meta:
        ordering = ["sequence_order"]
        unique_together = ("level", "sequence_order")

    def __str__(self) -> str:
        return f"{self.level.name} - {self.obstacle_name}"


class Question(models.Model):
    OPERATION_CHOICES = [
        ("addition", "Addition"),
        ("subtraction", "Subtraction"),
        ("multiplication", "Multiplication"),
        ("division", "Division"),
    ]

    DIFFICULTY_CHOICES = Level.DIFFICULTY_CHOICES

    operation = models.CharField(max_length=20, choices=OPERATION_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    question_text = models.CharField(max_length=255)
    option_a = models.CharField(max_length=50)
    option_b = models.CharField(max_length=50)
    option_c = models.CharField(max_length=50)
    option_d = models.CharField(max_length=50)
    correct_answer = models.CharField(max_length=1)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.question_text


class GameSession(models.Model):
    user = models.ForeignKey("users.UserProfile", related_name="game_sessions", on_delete=models.CASCADE)
    level = models.ForeignKey(Level, related_name="sessions", on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-played_at"]

    def __str__(self) -> str:
        return f"Session {self.id} - {self.user.name} - {self.level.name}"


class SessionQuestion(models.Model):
    session = models.ForeignKey(GameSession, related_name="session_questions", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name="session_questions", on_delete=models.CASCADE)
    obstacle = models.ForeignKey(Obstacle, related_name="session_questions", on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=1)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["answered_at"]

    def __str__(self) -> str:
        return f"Session {self.session_id} - Q{self.question_id}"
