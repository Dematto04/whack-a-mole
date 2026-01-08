# Specification: Game Theme

## Overview
Defines the visual theme, branding, and localization for the educational game.

## ADDED Requirements

### Requirement: Vietnamese Educational Branding
The game MUST present itself as an educational tool for Ho Chi Minh Thought on Socialism.

#### Scenario: Page Title
- **Given** the game page loads
- **Then** the browser tab title must be "Đấu tranh chống Giặc nội xâm"

#### Scenario: Game Header
- **Given** the game is displayed
- **Then** a badge showing "Tư tưởng Hồ Chí Minh" must appear above the title
- **And** the main title must read "ĐẤU TRANH CHỐNG 'GIẶC NỘI XÂM'"

#### Scenario: Score Label
- **Given** the score is displayed
- **Then** the label must read "Chỉ số Liêm chính" (Integrity Score)

### Requirement: Construction Site Theme
The visual theme MUST represent "building the country" metaphor.

#### Scenario: Background Style
- **Given** the game page loads
- **Then** the background must be a warm orange/amber gradient
- **And** a scaffold pattern overlay must be visible on desktop

#### Scenario: Decorative Elements
- **Given** the game is viewed on desktop (lg breakpoint+)
- **Then** crane silhouettes must appear as decorative elements
- **And** opacity must be low (15-20%) to not distract from gameplay

#### Scenario: Game Board Style
- **Given** the game board is rendered
- **Then** it must have amber/brown construction pit styling
- **And** holes must appear as excavation pits rather than grass holes

### Requirement: Custom Cursor
The cursor MUST represent the tool of justice/law.

#### Scenario: Gavel Cursor
- **Given** the user hovers over the game area
- **Then** the cursor must display as a gavel icon
- **And** the hotspot must be at the gavel head position

### Requirement: Vietnamese Typography
All text MUST render correctly in Vietnamese.

#### Scenario: Font Loading
- **Given** the page loads
- **Then** fonts supporting Vietnamese diacritics must be loaded
- **And** heading font must be Montserrat
- **And** body font must be Be Vietnam Pro
