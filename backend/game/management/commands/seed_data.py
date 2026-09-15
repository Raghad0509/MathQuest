from django.core.management.base import BaseCommand

from achievements.models import Achievement
from game.models import Level, Obstacle, Question
from stats.services import ensure_statistics
from users.models import UserProfile


class Command(BaseCommand):
    help = "Seed demo data for MathQuest"

    def handle(self, *args, **options):
        self.stdout.write("Seeding MathQuest demo data...")

        self._seed_profiles()
        self._seed_levels_and_obstacles()
        self._seed_questions()
        self._seed_achievements()

        self.stdout.write(self.style.SUCCESS("Seed data completed."))

    def _seed_profiles(self):
        profiles = [
            {"name": "Layla", "avatar": "explorer_girl", "language": "en"},
            {"name": "Omar", "avatar": "explorer_boy", "language": "en"},
            {"name": "Yasmin", "avatar": "pirate_kid", "language": "en"},
        ]

        for data in profiles:
            profile, _ = UserProfile.objects.get_or_create(name=data["name"], defaults=data)
            ensure_statistics(profile)

    def _seed_levels_and_obstacles(self):
        levels = [
            {"name": "Forest of Numbers", "world": "forest", "difficulty": "easy", "unlock_order": 1},
            {"name": "Bridge of Addition", "world": "bridge", "difficulty": "easy", "unlock_order": 2},
            {"name": "Cave of Multiplication", "world": "cave", "difficulty": "medium", "unlock_order": 3},
            {"name": "Castle of Equations", "world": "castle", "difficulty": "medium", "unlock_order": 4},
            {"name": "Treasure Island", "world": "island", "difficulty": "hard", "unlock_order": 5},
        ]

        obstacle_templates = {
            "forest": [
                ("rock", "Fallen Number Rock"),
                ("bridge", "Whispering Bridge"),
                ("treasure_chest", "Forest Treasure Chest"),
                ("mini_boss", "Forest Guardian Boss"),
            ],
            "bridge": [
                ("bridge", "Broken Plank Bridge"),
                ("gate", "River Gate"),
                ("treasure_chest", "Bridge Keeper Chest"),
                ("mini_boss", "Bridge Troll Boss"),
            ],
            "cave": [
                ("rock", "Crystal Boulder"),
                ("magical_door", "Rune Door"),
                ("treasure_chest", "Cave Jewel Chest"),
                ("mini_boss", "Cave Titan Boss"),
            ],
            "castle": [
                ("gate", "Royal Iron Gate"),
                ("magical_door", "Equation Portal"),
                ("treasure_chest", "Castle Vault"),
                ("mini_boss", "Castle Knight Boss"),
            ],
            "island": [
                ("bridge", "Pirate Rope Bridge"),
                ("rock", "Storm Rock Wall"),
                ("treasure_chest", "Legendary Treasure Chest"),
                ("mini_boss", "Island Kraken Boss"),
            ],
        }

        for level_data in levels:
            level, _ = Level.objects.get_or_create(unlock_order=level_data["unlock_order"], defaults=level_data)
            templates = obstacle_templates[level.world]
            for index, (obstacle_type, obstacle_name) in enumerate(templates, start=1):
                Obstacle.objects.get_or_create(
                    level=level,
                    sequence_order=index,
                    defaults={
                        "obstacle_type": obstacle_type,
                        "obstacle_name": obstacle_name,
                        "required_questions": self._questions_required(level.difficulty, obstacle_type),
                        "reward_points": self._reward_points(index, obstacle_type),
                    },
                )

    @staticmethod
    def _questions_required(difficulty: str, obstacle_type: str) -> int:
        if obstacle_type == "mini_boss":
            return {"easy": 2, "medium": 2, "hard": 3}[difficulty]
        return 1 if difficulty == "easy" else 2

    @staticmethod
    def _reward_points(sequence_order: int, obstacle_type: str) -> int:
        if obstacle_type == "mini_boss":
            return 40 + (sequence_order * 5)
        return 10 + (sequence_order * 5)

    def _seed_questions(self):
        question_bank = []

        question_bank.extend(
            [
                ("addition", "easy", "5 + 3 = ?", "8", "6", "9", "7", "A"),
                ("addition", "easy", "7 + 4 = ?", "10", "11", "12", "9", "B"),
                ("subtraction", "easy", "9 - 2 = ?", "7", "8", "6", "5", "A"),
                ("subtraction", "easy", "12 - 5 = ?", "8", "7", "6", "9", "B"),
                ("multiplication", "easy", "3 x 4 = ?", "12", "11", "10", "14", "A"),
                ("multiplication", "easy", "2 x 5 = ?", "8", "9", "10", "12", "C"),
                ("division", "easy", "12 / 3 = ?", "3", "5", "4", "6", "C"),
                ("division", "easy", "16 / 4 = ?", "4", "3", "5", "2", "A"),
            ]
        )

        question_bank.extend(
            [
                ("addition", "medium", "18 + 7 = ?", "25", "24", "26", "23", "A"),
                ("addition", "medium", "14 + 9 = ?", "21", "23", "24", "22", "B"),
                ("subtraction", "medium", "27 - 11 = ?", "16", "15", "18", "14", "A"),
                ("subtraction", "medium", "34 - 18 = ?", "14", "16", "17", "15", "B"),
                ("multiplication", "medium", "6 x 7 = ?", "40", "42", "36", "48", "B"),
                ("multiplication", "medium", "8 x 5 = ?", "35", "45", "40", "30", "C"),
                ("division", "medium", "45 / 9 = ?", "6", "4", "3", "5", "D"),
                ("division", "medium", "56 / 8 = ?", "7", "8", "6", "9", "A"),
            ]
        )

        question_bank.extend(
            [
                ("addition", "hard", "37 + 28 = ?", "63", "66", "65", "64", "C"),
                ("addition", "hard", "49 + 36 = ?", "85", "84", "83", "86", "A"),
                ("subtraction", "hard", "72 - 39 = ?", "34", "33", "31", "35", "B"),
                ("subtraction", "hard", "91 - 47 = ?", "45", "46", "44", "43", "C"),
                ("multiplication", "hard", "9 x 8 = ?", "72", "74", "70", "68", "A"),
                ("multiplication", "hard", "12 x 6 = ?", "66", "72", "76", "68", "B"),
                ("division", "hard", "84 / 7 = ?", "11", "13", "12", "14", "C"),
                ("division", "hard", "96 / 12 = ?", "7", "8", "9", "6", "B"),
            ]
        )

        for operation, difficulty, question_text, a, b, c, d, correct in question_bank:
            Question.objects.get_or_create(
                question_text=question_text,
                defaults={
                    "operation": operation,
                    "difficulty": difficulty,
                    "option_a": a,
                    "option_b": b,
                    "option_c": c,
                    "option_d": d,
                    "correct_answer": correct,
                },
            )

    def _seed_achievements(self):
        achievements = [
            {
                "title": "First Treasure",
                "description": "Complete your first level and unlock your first treasure chest.",
                "badge_icon": "first_treasure_badge",
            },
            {
                "title": "Puzzle Master",
                "description": "Answer many math puzzles correctly in one adventure.",
                "badge_icon": "puzzle_master_badge",
            },
            {
                "title": "Fast Solver",
                "description": "Finish a level with excellent accuracy.",
                "badge_icon": "fast_solver_badge",
            },
            {
                "title": "Explorer Champion",
                "description": "Complete all worlds and become a legendary explorer.",
                "badge_icon": "explorer_champion_badge",
            },
            {
                "title": "Score Hunter",
                "description": "Reach a high score in a single game session.",
                "badge_icon": "score_hunter_badge",
            },
        ]

        for achievement in achievements:
            Achievement.objects.get_or_create(title=achievement["title"], defaults=achievement)
