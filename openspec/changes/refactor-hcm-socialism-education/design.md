# Design: Interactive Learning Lab - "Xây dựng CNXH" (Edutainment Refactor)

## Overview
Transform the mechanical Whack-a-Mole game into a "Learning by Doing" experience. The design focuses on reinforcing political theory concepts (Ho Chi Minh Thought) through interactive metaphors, feedback loops, and visual storytelling.

## Conceptual Architecture

### 1. The Core Educational Loop (3 Steps)
1.  **Identify (Nhận thức):** Player sees an entity → Must instantly classify it as "Obstacle" (Trở lực) or "Motivation" (Động lực).
2.  **Act (Hành động):** Player uses the "Gavel of Law/Discipline" to intervene (click/tap) or restrain (do nothing).
3.  **Reflect (Thấm nhuần):** Immediate feedback (quotes/toasts) connects the action to specific teachings of Uncle Ho.

### 2. Entity System (The Syllabus)

#### "Internal Invaders" (Giặc nội xâm) - Targets
*Spawn Rate: Variable (starts slow, increases intensity to mimic complex struggle)*
*   **Corruption (Tham ô):** Icon of stolen money bags/greedy hands.
*   **Waste (Lãng phí):** Icon of leaking pipes/burning resources.
*   **Bureaucracy (Quan liêu):** Icon of red tape/stacks of paper.
*   **Laziness (Lười biếng):** Icon of sleeping/inactivity.
*   **Division (Chia rẽ):** Icon of broken chain.

#### "Revolutionary Motivations" (Động lực) - Protect
*   **Unity (Đoàn kết):** Icon of holding hands/solidarity.
*   **Democracy (Dân chủ):** Icon of voting ballot/people speaking.
*   **Science (Khoa học):** Icon of atom/book/gear.
*   **Ethics (Đạo đức):** Icon of heart/lotus flower.

### 3. Gameplay Mechanics & Metaphors

#### Health System = "Public Trust" (Lòng dân)
Instead of a simple life counter, we use a "Lòng dân" (Public Trust) bar.
*   **Mistake (Hit Ally):** "Lòng dân" drops significantly ("Hurting the revolution alienates the people").
*   **Negligence (Miss Enemy):** "Lòng dân" decays slowly ("Allowing corruption to persist erodes trust over time").
*   **Success (Hit Enemy):** "Lòng dân" restores slightly ("Cleaning up corruption restores faith").

#### Cursor = "Tool of Justice"
*   Visual: A Gavel (symbol of Law) or a Shield (symbol of Protection - context-dependent).
*   Interaction: Satisfying "thud" or "stamp" animation when hitting enemies.

#### Feedback System = "Theoretical Context"
*   **Hit Enemy:** Toast popup: "Diệt giặc nội xâm!" (Eliminating internal invaders!).
*   **Hit Ally:** Screen shake/Red overlay + Quote: "Sai lầm! Bác dạy: Đoàn kết là sức mạnh."
*   **Win/Loss:** Detailed quote card explaining *why* the result matters for Socialism.

## UI/UX Design

### Theme: "Vietnam Construction Blueprint"
*   **Background:** Stylized construction site or blueprint, representing "Xây dựng đất nước" (Nation Building).
*   **Typography:** Bold, uppercase, sans-serif fonts reminiscent of propaganda posters (Must support Vietnamese).
*   **Palette:**
    *   **Primary:** Revolution Red (#D71920)
    *   **Accent:** Gold Star Yellow (#FFFF00)
    *   **Secondary:** Worker Blue (#0055A4)
    *   **Neutral:** Concrete Grey (#959595)

### Layout
*   **Main Arena:** The construction site where entities pop up.
*   **Knowledge Sidebar (Desktop) / Info Modal (Mobile):**
    *   Definitions of current appearing entities.
    *   Brief theory snippets ("CNXH là gì?").
*   **HUD:**
    *   **Top:** "Chỉ số Liêm chính" (Score) & "Lòng dân" (Health Bar).
    *   **Bottom:** Phase/Time indicator.

## Scoring Logic
*   **Score Name:** "Chỉ số Liêm chính" (Integrity Index).
*   **Hit Enemy:** +10 points.
*   **Hit Ally:** -20 points (High penalty to emphasize "Protection" over "Destruction").
*   **Combo:** "Giác ngộ cao" (High Enlightenment) streak multiplier.

## Data Structure (Content Repository)

```json
{
  "quotes": [
    {
      "id": "q_corruption",
      "text": "Tham ô, lãng phí và bệnh quan liêu là kẻ thù của nhân dân, của bộ đội và của Chính phủ.",
      "trigger": "hit_enemy_corruption"
    },
    {
      "id": "q_unity",
      "text": "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.",
      "trigger": "hit_ally_unity_fail"
    }
  ]
}
```

## Technical Feasibility
*   **Engine:** Existing Vanilla JS / HTML / CSS stack.
*   **Assets:** Use SVG icons for entities to ensure clarity and scalability.
*   **Localization:** Google Fonts (Be Vietnam Pro / Montserrat).
*   **Performance:** Lightweight animations to run smoothly on student devices (mobile/laptop).
