# Specification: Scoring System

## Overview
Defines the point-based scoring system that rewards correct actions and penalizes mistakes.

## ADDED Requirements

### Requirement: Hit Enemy Scoring
Hitting an enemy MUST reward the player with points.

#### Scenario: Successful Enemy Hit
- **Given** the player taps an enemy entity
- **When** the tap registers as a hit
- **Then** the score must increase by 10 points
- **And** a green popup showing "+10" must appear
- **And** the entity must play the "hit squish" animation

#### Scenario: Hit Feedback Message
- **Given** the player successfully hits an enemy
- **Then** the status message may show "Diệt giặc nội xâm!"

### Requirement: Hit Ally Penalty
Hitting an ally MUST penalize the player significantly.

#### Scenario: Mistaken Ally Hit
- **Given** the player taps an ally entity
- **When** the tap registers as a hit
- **Then** the score must decrease by 20 points
- **And** a red popup showing "-20" must appear
- **And** the game container must flash with a warning effect
- **And** the entity must play the "hit ally shake" animation

#### Scenario: Ally Hit Feedback
- **Given** the player mistakenly hits an ally
- **Then** the status message may show "Sai lầm! Phải bảo vệ động lực!"

### Requirement: Miss Enemy Penalty
Allowing an enemy to escape MUST incur a small penalty.

#### Scenario: Enemy Escapes
- **Given** an enemy entity is active
- **When** the entity's display timer expires without being hit
- **Then** the score must decrease by 5 points
- **And** a grey popup showing "-5" may appear
- **And** the status message may show "Để lọt tội phạm!"

### Requirement: Miss Ally No Penalty
Allowing an ally to leave unharmed MUST NOT incur penalty.

#### Scenario: Ally Leaves Safely
- **Given** an ally entity is active
- **When** the entity's display timer expires without being hit
- **Then** the score must NOT change
- **And** no penalty message must appear
- **And** the streak may continue

### Requirement: Streak Tracking
Consecutive correct actions MUST be tracked.

#### Scenario: Streak Increments
- **Given** the player hits an enemy
- **When** it is a correct action
- **Then** the streak counter must increment by 1

#### Scenario: Streak Resets on Mistake
- **Given** the player hits an ally OR misses an enemy
- **When** it is an incorrect action
- **Then** the streak counter must reset to 0

### Requirement: Negative Score Allowed
The score MUST be allowed to go negative if the player makes many mistakes.

#### Scenario: Score Below Zero
- **Given** the current score is 5
- **When** the player hits an ally (-20)
- **Then** the score must become -15
- **And** the game must continue normally
