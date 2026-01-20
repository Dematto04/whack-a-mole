# Tasks: Ally Quiz Popup

## 1. Data Setup

- [x] Add 10 quiz questions to `data.js` in `GAME_DATA.quizQuestions` array
- [x] Each question has: id, question text, 4 options array, correctIndex (0-3)
- [x] Questions relate to Hồ Chí Minh ideology and socialism education

## 2. Quiz Modal UI

- [x] Add quiz modal HTML structure to `index.html`
- [x] Style quiz modal with Tailwind (consistent with existing modals)
- [x] Include question display area, 4 answer buttons, feedback area
- [x] Add CSS animations for modal show/hide

## 3. Game State Integration

- [x] Add `quizActive` flag to game state in `app.js`
- [x] Add `quizCorrect` scoring value to config (value: 5)
- [x] Create `showQuizModal(question)` function
- [x] Create `hideQuizModal()` function
- [x] Create `handleQuizAnswer(selectedIndex)` function

## 4. Modify Ally Hit Logic

- [x] In `handleWhack()`, when hitting ally:
  - Clear entity timers
  - Set `state.quizActive = true`
  - Select random question from pool
  - Call `showQuizModal(question)`
- [x] Do NOT apply penalty immediately (defer to quiz result)

## 5. Quiz Answer Handling

- [x] On correct answer:
  - Add +5 points to score
  - Reset streak to 0
  - Show green success feedback
  - Close modal after 1s delay
- [x] On incorrect answer:
  - Apply full penalty (-20 points, -15% health)
  - Reset streak to 0
  - Show red failure feedback
  - Close modal after 1s delay
- [x] After modal closes:
  - Set `state.quizActive = false`
  - Resume entity spawning
  - Check health for game over

## 6. Timer Integration

- [x] Pause countdown timer when quiz active
- [x] Resume countdown timer when quiz closes
- [x] Handle edge case: timer at 0 when quiz showing

## 7. Testing & Validation

- [x] Test quiz appears on ally hit
- [x] Test correct answer gives +5 and resets streak
- [x] Test wrong answer applies full penalty
- [ ] Test game pauses during quiz
- [ ] Test game resumes properly after quiz
- [ ] Test health-based game over after failed quiz
