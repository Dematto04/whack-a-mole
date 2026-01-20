# Specification: Difficulty System

## Overview

Defines the dynamic difficulty scaling based on player performance (streak).

## ADDED Requirements

### Requirement: Streak-Based Speed Scaling

Entity display time MUST decrease as streak increases.

#### Scenario: Normal Speed at Zero Streak

- **Given** the player's streak is 0
- **When** an entity spawns
- **Then** the entity display time must be approximately 1200ms

#### Scenario: Increased Speed at High Streak

- **Given** the player's streak is 5
- **When** an entity spawns
- **Then** the entity display time must be approximately 950ms (1200 - 5\*50)

#### Scenario: Maximum Speed Cap

- **Given** the player's streak is 12 or higher
- **When** an entity spawns
- **Then** the entity display time must be capped at minimum 600ms
- **And** the time must NOT go below 600ms regardless of streak

### Requirement: Speed Reset on Mistake

Entity display time MUST return to normal when streak resets.

#### Scenario: Speed Resets After Hit Ally

- **Given** the player's streak was 10
- **When** the player hits an ally (and streak resets to 0)
- **Then** the next entity display time must return to 1200ms

#### Scenario: Speed Resets After Miss Enemy

- **Given** the player's streak was 8
- **When** the player misses an enemy (and streak resets to 0)
- **Then** the next entity display time must return to 1200ms

### Requirement: Dynamic Calculation

Entity display time MUST be calculated fresh for each spawn.

#### Scenario: Real-time Difficulty Adjustment

- **Given** the game is in progress
- **When** an entity spawns
- **Then** the display time must be calculated based on current streak value
- **And** the formula must be: max(600, 1200 - streak \* 50)
