# Backend Codebase Explained (Django + DRF)
Arabic version: [../ar/backend-codebase-explained.md](../ar/backend-codebase-explained.md)

This guide explains backend code in simple language so students can present it confidently.

## 1) Backend Responsibility

Backend does 4 main things:
- Stores data (profiles, levels, questions, sessions, stats, achievements)
- Applies game rules (progression, score, hint cost, streak bonus)
- Exposes REST APIs for mobile app
- Seeds demo data for quick testing

## 2) Backend Folder Structure

`backend/` contains:
- `manage.py`: Django command entry point
- `mathquest/`: project config (settings, urls)
- `users/`: profile management
- `game/`: core gameplay models and APIs
- `achievements/`: badge system
- `stats/`: performance and streak tracking

## 3) Project-Level Files

## `backend/mathquest/settings.py`
- Registers installed apps
- Configures middleware and database
- Uses SQLite by default
- Has optional PostgreSQL-ready env config

## `backend/mathquest/urls.py`
- Combines routes from all apps under `/api/`

## 4) App-by-App Explanation

## A) `users` app

Key files:
- `users/models.py`: `UserProfile`
- `users/serializers.py`: profile serializer
- `users/views.py`: list/create/retrieve APIs
- `users/urls.py`: routes for `/api/profiles/`

Purpose:
- Player profile selection/creation without complex login

## B) `game` app

This is the most important app.

### Models (`game/models.py`)
- `Level`: world and difficulty settings
- `Obstacle`: objects to unlock (bridge, gate, mini_boss, etc.)
- `Question`: MCQ math questions
- `GameSession`: one play attempt for one user and one level
- `SessionQuestion`: each answered question inside a session

### Services (`game/services.py`)
Services keep business logic out of views.

Important functions:
- `start_game_session(...)`: starts session
- `get_next_obstacle(...)`: finds current unsolved obstacle
- `get_question_for_obstacle(...)`: picks a question by difficulty/type
- `submit_answer(...)`: validates correct/wrong and updates score/session stats
- `get_hint_for_question(...)`: deducts 5 points, removes one wrong option
- `complete_session(...)`: completes level, applies streak, updates stats and achievements

### Views (`game/views.py`)
API handlers for gameplay:
- start game
- next obstacle
- fetch puzzle question
- get hint
- submit answer
- complete level

### URLs (`game/urls.py`)
Defines gameplay endpoints:
- `/api/game/start/`
- `/api/game/next-obstacle/{session_id}/`
- `/api/game/question/{session_id}/{obstacle_id}/`
- `/api/game/hint/`
- `/api/game/answer/`
- `/api/game/complete/`

### Seed command (`game/management/commands/seed_data.py`)
- Creates sample profiles
- Creates 5 levels and obstacles
- Adds mini-boss as final obstacle in each level
- Creates question bank and achievements

## C) `achievements` app

Key files:
- `achievements/models.py`: `Achievement`, `UserAchievement`
- `achievements/services.py`: checks and awards badges
- `achievements/views.py`: returns user achievements

Purpose:
- Reward milestones such as first completion, high score, etc.

## D) `stats` app

Key files:
- `stats/models.py`: totals + streak fields
- `stats/services.py`: recompute totals, apply daily streak logic
- `stats/views.py`: user statistics API

Important streak fields:
- `current_streak`
- `longest_streak`
- `last_played_date`

## 5) Backend API Flow (Simple)

1. User selects profile (`/api/profiles/`)
2. Mobile fetches levels (`/api/levels/`)
3. Start session (`/api/game/start/`)
4. Get active obstacle (`/api/game/next-obstacle/{id}/`)
5. Get question (`/api/game/question/{session}/{obstacle}/`)
6. Optional hint (`/api/game/hint/`)
7. Submit answer (`/api/game/answer/`)
8. Complete level (`/api/game/complete/`)
9. View stats/achievements

## 6) Why This Design Is Good for Students

- Clear app separation (`users`, `game`, `stats`, `achievements`)
- Service layer makes logic readable and testable
- APIs are small and focused
- Easy to extend (new levels, obstacles, achievements)

## 7) Common Teacher Questions (Backend)

Q: Why put logic in services, not views?  
A: To keep views clean and reusable business logic centralized.

Q: How is daily streak handled?  
A: `stats/services.py` compares last played date with today/yesterday and updates streak fields.

Q: How does hint cost work?  
A: `game/services.py` checks score >= 5, deducts points, and returns one wrong option to eliminate.
