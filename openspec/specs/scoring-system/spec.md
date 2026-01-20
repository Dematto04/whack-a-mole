# scoring-system Specification

## Purpose
TBD - created by archiving change add-ally-quiz-popup. Update Purpose after archive.
## Requirements
### Requirement: Hit Ally Quiz Trigger

Hitting an ally MUST trigger quiz instead of immediate penalty.

#### Scenario: Mistaken Ally Hit

- **Given** the player taps an ally entity
- **When** the tap registers as a hit
- **Then** a quiz modal must appear
- **And** the penalty must be deferred until quiz is answered
- **And** the entity must play the "hit ally shake" animation

#### Scenario: Ally Hit - Quiz Correct

- **Given** the player hits an ally
- **And** the quiz modal appears
- **When** the player answers correctly
- **Then** the score must increase by 5 points
- **And** the streak must reset to 0
- **And** the health must NOT change

#### Scenario: Ally Hit - Quiz Incorrect

- **Given** the player hits an ally
- **And** the quiz modal appears
- **When** the player answers incorrectly
- **Then** the score must decrease by 20 points
- **And** a red popup showing "-20" must appear
- **And** the health must decrease by 15%
- **And** the streak must reset to 0

### Requirement: Quiz Correct Scoring

Correctly answering the ally-hit quiz MUST award bonus points.

#### Scenario: Quiz Bonus Points

- **Given** the player correctly answers a quiz
- **Then** the score must increase by exactly 5 points
- **And** a green popup showing "+5" must appear

### Requirement: Streak Reset on Quiz

Both quiz outcomes MUST reset the streak counter.

#### Scenario: Streak Reset - Correct Answer

- **Given** the player answers quiz correctly
- **Then** the streak must reset to 0

#### Scenario: Streak Reset - Incorrect Answer

- **Given** the player answers quiz incorrectly
- **Then** the streak must reset to 0

