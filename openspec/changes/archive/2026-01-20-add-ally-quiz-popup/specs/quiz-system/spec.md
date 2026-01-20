# Specification: Quiz System

## Overview

Defines the quiz popup system that appears when a player hits an Ally, providing an educational opportunity and chance to mitigate penalty.

## ADDED Requirements

### Requirement: Quiz Trigger on Ally Hit

When the player hits an Ally, a quiz popup MUST appear instead of immediate penalty.

#### Scenario: Ally Hit Triggers Quiz

- **Given** the player taps an ally entity
- **When** the tap registers as a hit
- **Then** the game must pause entity spawning
- **And** a quiz modal must appear with a random question
- **And** the hit animation must play on the ally

#### Scenario: Quiz Question Selection

- **Given** a quiz is triggered
- **Then** one question must be randomly selected from a pool of 10 questions
- **And** the question must display with 4 multiple choice options

### Requirement: Quiz Question Pool

The game MUST have a pool of 10 educational questions.

#### Scenario: Question Content

- **Given** the quiz question pool exists
- **Then** it must contain exactly 10 questions
- **And** each question must relate to Hồ Chí Minh ideology or socialism education
- **And** each question must have exactly 4 answer options
- **And** exactly one option must be marked as correct

### Requirement: Correct Answer Reward

Answering correctly MUST reward reduced penalty with streak reset.

#### Scenario: Correct Quiz Answer

- **Given** the quiz modal is displayed
- **When** the player selects the correct answer
- **Then** the score must increase by 5 points
- **And** the streak must reset to 0
- **And** the health must NOT decrease
- **And** a green success feedback must display
- **And** the modal must close after a short delay

### Requirement: Incorrect Answer Penalty

Answering incorrectly MUST apply the full ally-hit penalty.

#### Scenario: Incorrect Quiz Answer

- **Given** the quiz modal is displayed
- **When** the player selects an incorrect answer
- **Then** the score must decrease by 20 points
- **And** the health must decrease by 15%
- **And** the streak must reset to 0
- **And** a red failure feedback must display
- **And** the correct answer must be highlighted
- **And** the modal must close after a short delay

### Requirement: Game Pause During Quiz

The game MUST pause while the quiz is active.

#### Scenario: Timer Pause

- **Given** the quiz modal is displayed
- **Then** the countdown timer must pause
- **And** no new entities must spawn

#### Scenario: Game Resume After Quiz

- **Given** the player has answered the quiz
- **When** the modal closes
- **Then** the countdown timer must resume
- **And** entity spawning must resume
- **And** any pending game-over check must execute

### Requirement: Quiz Modal UI

The quiz modal MUST be visually consistent and accessible.

#### Scenario: Modal Display

- **Given** a quiz is triggered
- **Then** a full-screen overlay must appear
- **And** the question text must be prominently displayed
- **And** four answer buttons must be clearly labeled (A, B, C, D)
- **And** buttons must be touch-friendly sized

#### Scenario: Answer Selection Feedback

- **Given** the player taps an answer button
- **Then** the selected button must show visual feedback
- **And** all buttons must become disabled
- **And** the result feedback must appear within 500ms

### Requirement: Single Quiz Instance

Only one quiz MUST be active at a time.

#### Scenario: Quiz Already Active

- **Given** a quiz modal is currently displayed
- **When** any game input occurs
- **Then** no additional quiz must be triggered
- **And** the current quiz must remain active
