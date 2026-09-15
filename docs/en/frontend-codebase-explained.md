# Frontend Codebase Explained (React Native + Expo)
Arabic version: [../ar/frontend-codebase-explained.md](../ar/frontend-codebase-explained.md)

This guide explains the mobile app structure in simple terms.

## 1) Frontend Responsibility

Frontend does 4 main things:
- Shows game UI screens
- Navigates player through game flow
- Calls backend APIs
- Stores temporary game state during gameplay

## 2) Frontend Folder Structure

`mobile/` contains:
- `App.js`: app entry point
- `navigation/`: screen routing
- `screens/`: each app page
- `components/`: reusable UI blocks
- `services/`: API request helpers
- `constants/`: colors/icons/theme
- `context/`: shared state (`GameContext`)

## 3) Core App Entry

## `mobile/App.js`
- Wraps app with `GameProvider`
- Loads `NavigationContainer`
- Uses `AppNavigator` for all screens

## `mobile/navigation/AppNavigator.js`
- Defines stack routes
- Controls screen headers and transitions
- Adds navigation behavior between flow screens

## 4) Shared State (Context)

## `mobile/context/GameContext.js`
Stores:
- selected profile
- selected level
- current session
- latest result
- statistics snapshot

Why needed:
- Many screens need same data (for example level, puzzle, feedback)
- Avoids passing props through too many screens

## 5) API Layer

## `mobile/services/api.js`
- Creates axios instance
- Sets base URL
- Handles common API errors

## Feature service files
- `profileService.js`: profiles APIs
- `gameService.js`: gameplay APIs (`start`, `next obstacle`, `question`, `hint`, `answer`, `complete`)
- `achievementService.js`: achievements API
- `statisticsService.js`: stats API

## 6) Screen-by-Screen Explanation

## `SplashScreen`
- Initial intro/loading screen

## `ProfileSelectionScreen`
- Choose existing profile
- Create profile with name + gender

## `HomeScreen`
- Shows player summary
- Buttons to Map, Achievements, Statistics, Settings
- Includes switch-profile action

## `AdventureMapScreen`
- Map view with level nodes
- Locked/unlocked/completed status

## `LevelScreen`
- Shows active obstacle and level progress
- Detects mini boss and displays badge
- Entry point to puzzle screen

## `MathPuzzleScreen`
- Shows current math question with options
- Handles answer submit
- Handles hint usage:
  - hint costs 5 points
  - one wrong option removed

## `FeedbackScreen`
- Shows correct/wrong feedback
- Moves user to next step

## `LevelCompleteScreen`
- Shows score summary
- Shows daily streak bonus data

## `AchievementsScreen`
- Shows earned and locked badges

## `StatisticsScreen`
- Shows performance cards
- Includes streak fields and last played date

## `SettingsScreen`
- Sound/music toggles

## 7) Reusable Components

Examples:
- `PrimaryButton`: common button with animation
- `AvatarCard`: profile cards
- `LevelNode`: map level node UI
- `PuzzleCard`, `AnswerButton`: puzzle UI blocks
- `ProgressBar`: progress visuals
- `StatCard`, `AchievementBadge`, `RewardStars`

Why components:
- Reuse styles and behavior
- Keep screens smaller and easier to read

## 8) UI and Theme

Files:
- `constants/colors.js`
- `constants/theme.js`
- `constants/gameData.js`

Purpose:
- Keep color/icon values centralized
- Make styling consistent across screens

## 9) Frontend Gameplay Flow (Simple)

1. Profile selected
2. Open map
3. Enter level
4. Get obstacle info from backend
5. Open puzzle
6. Optional hint
7. Submit answer
8. Feedback
9. Level complete summary (with streak bonus)

## 10) Common Teacher Questions (Frontend)

Q: Why use context?  
A: Many screens share session/profile/state; context avoids deep prop passing.

Q: Why use service files for API calls?  
A: Keeps screens focused on UI logic, not HTTP details.

Q: How is hint reflected in UI?  
A: After hint API call, score updates and one wrong option is removed from visible options.
