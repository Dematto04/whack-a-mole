# Design: Streak-Based Difficulty Scaling

## Architecture

### Difficulty Formula

```
upTime = max(minimumUpTime, initialUpTime - (streak * streakSpeedBonus))
```

Where:

- `initialUpTime`: 1200ms (current default)
- `minimumUpTime`: 600ms (current minimum)
- `streakSpeedBonus`: 50ms per streak level

### Example Progression

| Streak | upTime (ms) | Effect                 |
| ------ | ----------- | ---------------------- |
| 0      | 1200        | Normal speed           |
| 5      | 950         | Noticeably faster      |
| 10     | 700         | Challenging            |
| 12+    | 600         | Maximum speed (capped) |

### Behavior on Streak Reset

When streak resets to 0 (hit ally, miss enemy, quiz):

- `upTime` immediately returns to `initialUpTime`
- Provides "breathing room" after mistakes
- Maintains tension: must rebuild momentum

### Config Changes

```javascript
config.difficulty = {
  initialUpTime: 1200,
  minimumUpTime: 600,
  streakSpeedBonus: 50, // ms reduction per streak
};
```

### Technical Notes

1. Calculate `upTime` dynamically in `spawnEntity()` based on current streak
2. Remove old "every 5 hits" speed-up logic from `handleWhack()`
3. No animation changes needed - entity CSS already handles variable timing
