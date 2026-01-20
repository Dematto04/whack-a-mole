# Tasks: Streak-Based Difficulty Scaling

## 1. Config Update

- [x] Add `streakSpeedBonus` to config (value: 50ms per streak)
- [x] Keep existing `initialUpTime` and `minimumUpTime` values

## 2. Modify spawnEntity Logic

- [x] Calculate `upTime` dynamically based on current streak
- [x] Use formula: `max(minimumUpTime, initialUpTime - (streak * streakSpeedBonus))`
- [x] Apply calculated `upTime` to entity display timer

## 3. Remove Old Speed-Up Logic

- [x] Remove "every 5 hits" speed increase from `handleWhack()`
- [x] Ensure `state.upTime` is no longer permanently modified

## 4. Reset Behavior

- [x] When streak resets to 0 (any reason), upTime automatically returns to normal
- [x] This happens naturally since upTime is calculated from current streak

## 5. Testing

- [x] Test streak 0: entities show for ~1200ms
- [x] Test streak 5: entities show for ~950ms
- [x] Test streak 12+: entities capped at 600ms minimum
- [x] Test streak reset: speed returns to normal after mistake
