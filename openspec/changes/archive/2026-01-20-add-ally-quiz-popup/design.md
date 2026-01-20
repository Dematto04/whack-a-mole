# Design: Ally Quiz Popup

## Architecture

### Quiz Flow

```
Player hits Ally
       ↓
Game pauses (timers cleared)
       ↓
Quiz modal appears with random question
       ↓
Player selects answer
       ↓
    ┌──────────────┐
    │   Correct?   │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    ▼             ▼
  YES            NO
    │             │
+5 points    -20 points
Reset streak  -15% health
    │         Reset streak
    │             │
    └─────┬───────┘
          ▼
  Quiz modal closes
          ↓
  Game resumes spawning
```

### Data Structure

```javascript
// In data.js - new quizQuestions array
quizQuestions: [
  {
    id: "q1",
    question: "Theo Bác Hồ, 'Giặc nội xâm' gồm những tệ nạn nào?",
    options: [
      "Tham ô, lãng phí, quan liêu",
      "Đói nghèo, thất học, bệnh tật",
      "Chiến tranh, chia rẽ, xâm lược",
      "Lạm phát, thất nghiệp, tham nhũng",
    ],
    correctIndex: 0,
  },
  // ... 9 more questions
];
```

### UI Components

#### Quiz Modal

- Full-screen overlay (similar to existing modals)
- Question text at top
- 4 answer buttons (A, B, C, D styled)
- Timer countdown (optional, not in v1)
- Feedback message after answering

#### Visual Feedback

- Correct: Green flash, "+5" popup
- Incorrect: Red flash, "-20" popup, health bar reduction

### Technical Decisions

1. **Quiz state management**: Add `state.quizActive` flag to prevent entity spawning during quiz
2. **Question selection**: Simple random selection from pool without tracking (allows repeats)
3. **Modal implementation**: Reuse existing modal patterns from educational-modals
4. **Scoring integration**: Leverage existing `config.scoring` pattern with new `quizCorrect: 5` value

### Edge Cases

- Player closes browser during quiz → No special handling, game state lost
- Timer reaches 0 during quiz → Quiz takes priority, game ends after quiz answered
- Multiple rapid ally hits → Only one quiz at a time (blocked by quizActive flag)
