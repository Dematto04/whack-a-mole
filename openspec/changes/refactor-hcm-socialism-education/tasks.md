# Tasks: Edutainment Platform Implementation

## 1. Content & Data Foundation (Content Verification)

- [x] **1.1. Data Repository (`Data.js`):** Create structured data for all "Giặc nội xâm" (Ambition, Waste, etc.) and "Động lực" (Unity, Science, etc.) with associated colors, icons, and IDs.
- [x] **1.2. Quote Library:** Compile correct quotes from Ho Chi Minh Thought with triggers (when to show).
- [x] **1.3. Educational Texts:** Write Short Definitions (Sidebar/Modal) and Briefing content (Start Modal).

## 2. UI/UX "Construction Site" Theme Overhaul

- [x] **2.1. Assets:** Integrate localized fonts (Be Vietnam Pro / Montserrat).
- [x] **2.2. Global Theme:** Apply "Revolution Red" and "Worker Blue" palette to background and headers.
- [x] **2.3. Cursor:** Implement "Gavel" cursor (CSS/SVG).
- [x] **2.4. HUD Update:** Rename labels ("Chỉ số Liêm chính", "Lòng dân") and style scoreboards as blueprints/documents.
- [x] **2.5. Sidebar (Desktop):** Create "Thư viện lý luận" panel to display definitions.
- [x] **2.6. Responsive:** Ensure texts are readable on mobile (adjust font sizes/modal width).

## 3. Core Logic: The "Split-Entity" System

- [x] **3.1. Entity Class:** Refactor generic `mole` to support distinct types (`Friend` vs `Foe`) with unique properties.
- [x] **3.2. Spawn Logic:** Implement weighted random spawning (Variable rates to manage difficulty curve).
- [x] **3.3. Visual Rendering:** CSS classes for distinct icons/colors for all 5 Enemies and 4 Allies.
- [x] **3.4. Interaction Logic:**
  - [x] Handle Hit Enemy: Positive Score, Success Sound/Anim.
  - [x] Handle Hit Ally: Negative Score, Shake Screen, Flash Red, "Lòng dân" penalty.
  - [x] Handle Miss Enemy: "Lòng dân" decay over time logic.

## 4. Educational Feedback Mechanics

- [x] **4.1. Toast/Popup System:** Implement context-aware popups ("Diệt giặc!", "Sai lầm!") on click events.
- [x] **4.2. Health Bar ("Lòng dân"):** Implement visual decay and restoration logic linked to game events.
- [x] **4.3. Phase Management:** Implement 60s game loop (Transition Period).

## 5. Educational Wrappers (Modals)

- [x] **5.1. Start Screen (Briefing):** Implement learning phase (Rules + Friend/Foe Identification).
- [x] **5.2. End Screen (Debrief):** Implement scoring evaluation + Final Quote display based on "Integrity Index".

## 6. Testing & Polish

- [x] **6.1. Content Check:** Verify all Vietnamese text matches the source material exactly.
- [x] **6.2. Pacing:** Adjust spawn rates so players have time to _read_ and _identify_ (Learning focused, not reflex focused).
- [x] **6.3. Accessibility:** Ensure colorblind users can distinguish Friend/Foe via Icons (not just colors).
