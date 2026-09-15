# Teacher Q&A Prep (Simple Answers)
Arabic version: [../ar/04-teacher-qa-prep.md](../ar/04-teacher-qa-prep.md)

Use these short answers during project presentation.

## Q1) Why Django + DRF for backend?
Because it gives fast API development, clean model relationships, and built-in admin for managing game data.

## Q2) Why React Native + Expo for mobile?
One codebase can run on Android and iOS. Expo setup is faster for student projects.

## Q3) Where is the main game logic?
In backend service files:
- `backend/game/services.py`
- `backend/stats/services.py`
- `backend/achievements/services.py`

## Q4) How is this different from a quiz app?
Player moves through a map and obstacles. Math is used as an unlock mechanic inside an adventure flow.

## Q5) How is data stored?
SQLite in development. Settings are PostgreSQL-ready for future migration.

## Q6) What happens when answer is correct?
- Session score increases
- Correct count increases
- Obstacle progress updates
- Level completion is checked

## Q7) What happens when answer is wrong?
- Wrong count increases
- Friendly retry feedback is shown
- Player can try next question for obstacle

## Q8) How does hint system work?
Hint API deducts 5 points and removes one wrong option.

## Q9) How does daily streak work?
When a level is completed on consecutive days, streak count increases and bonus points are added.

## Q10) How is mini-boss implemented?
Each level has a final obstacle with type `mini_boss`, usually requiring more questions/reward points.

## Q11) Why use reusable components on frontend?
To keep UI consistent and reduce repeated code (buttons, cards, badges, nodes).

## Q12) If teacher asks for future work, what to say?
- Better question generation
- Better art/animations
- Teacher dashboard
- Parent progress reports
- Stronger auth and cloud deployment

---

## 60-Second Project Explanation Script

"MathQuest is a mobile educational adventure game for children. The user selects a profile, opens a treasure map, enters levels, and faces obstacles. Each obstacle is unlocked by solving math questions. The mobile app is built with React Native and Expo, and the backend is built with Django REST Framework. Game logic such as scoring, obstacle progression, hints, streak rewards, and achievements is handled in backend service layers. Data is stored in SQLite for development and can be moved to PostgreSQL later. The architecture is modular so it is easy to maintain and explain." 
