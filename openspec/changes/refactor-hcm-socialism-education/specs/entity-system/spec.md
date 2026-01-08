# Specification: Entity System

## Overview
Defines the two categories of entities (enemies and allies) that spawn during gameplay.

## ADDED Requirements

### Requirement: Enemy Entity Types
The game MUST have three types of "Internal Invaders" (Giặc nội xâm) that players must eliminate.

#### Scenario: Corruption Enemy
- **Given** an entity of type "enemy_corruption" spawns
- **Then** it must display with red color (#e74c3c)
- **And** it must show the label "Tham ô"
- **And** it must have an angry face expression (frown, angled eyes)

#### Scenario: Waste Enemy
- **Given** an entity of type "enemy_waste" spawns
- **Then** it must display with dark red/orange color (#c0392b)
- **And** it must show the label "Lãng phí"
- **And** it must have an angry face expression

#### Scenario: Bureaucracy Enemy
- **Given** an entity of type "enemy_bureaucracy" spawns
- **Then** it must display with grey color (#7f8c8d)
- **And** it must show the label "Quan liêu"
- **And** it must have an angry face expression

### Requirement: Ally Entity Types
The game MUST have three types of "Revolutionary Motivations" (Động lực cách mạng) that players must protect.

#### Scenario: Unity Ally
- **Given** an entity of type "ally_unity" spawns
- **Then** it must display with green color (#2ecc71)
- **And** it must show the label "Đoàn kết"
- **And** it must have a happy face expression (smile, round eyes)

#### Scenario: Democracy Ally
- **Given** an entity of type "ally_democracy" spawns
- **Then** it must display with blue color (#3498db)
- **And** it must show the label "Dân chủ"
- **And** it must have a happy face expression

#### Scenario: Science Ally
- **Given** an entity of type "ally_science" spawns
- **Then** it must display with purple color (#9b59b6)
- **And** it must show the label "Khoa học"
- **And** it must have a happy face expression

### Requirement: Entity Spawn Distribution
Entities MUST spawn with a weighted probability favoring enemies.

#### Scenario: Spawn Probability
- **Given** an entity is about to spawn
- **Then** there must be a 70% chance it is an enemy type
- **And** there must be a 30% chance it is an ally type

#### Scenario: Random Selection Within Type
- **Given** an enemy type is selected to spawn
- **Then** it must be randomly chosen from corruption, waste, or bureaucracy
- **And** each enemy type must have equal probability (33.3%)

#### Scenario: Random Selection Within Allies
- **Given** an ally type is selected to spawn
- **Then** it must be randomly chosen from unity, democracy, or science
- **And** each ally type must have equal probability (33.3%)

### Requirement: Visual Distinction
Enemies and allies MUST be visually distinguishable beyond just color.

#### Scenario: Color Temperature
- **Given** entities are displayed
- **Then** enemies must use warm/dark colors (red, orange, grey spectrum)
- **And** allies must use cool/bright colors (green, blue, purple spectrum)

#### Scenario: Facial Expression
- **Given** an enemy entity is displayed
- **Then** it must have a frown (mouth curves up)
- **And** eyes must be angled to appear angry

- **Given** an ally entity is displayed
- **Then** it must have a smile (mouth curves down)
- **And** eyes must be round to appear friendly

#### Scenario: Entity Labels
- **Given** any entity is displayed
- **Then** its Vietnamese name must be visible at the bottom of the entity
- **And** the label must have sufficient contrast against the entity body
