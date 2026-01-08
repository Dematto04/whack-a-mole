# Specification: Educational Modals

## Overview
Defines the start and end modal screens that provide educational context for the game.

## ADDED Requirements

### Requirement: Start Modal Display
A modal MUST appear when the page loads to introduce the educational context.

#### Scenario: Initial Modal State
- **Given** the game page loads
- **Then** the start modal must be visible
- **And** the game board must be visible but not interactive

#### Scenario: Start Modal Content
- **Given** the start modal is displayed
- **Then** it must show the headline "Nhiệm vụ: Xây dựng Chủ nghĩa Xã hội"
- **And** it must explain the transition period struggle concept
- **And** it must list the enemy types (Tham ô, Lãng phí, Quan liêu)
- **And** it must list the ally types (Đoàn kết, Dân chủ, Khoa học)
- **And** it must have a button labeled "Bắt đầu thi hành nhiệm vụ"

#### Scenario: Start Modal Dismissal
- **Given** the start modal is displayed
- **When** the user clicks the start button
- **Then** the modal must be hidden
- **And** the game must start immediately

### Requirement: End Modal Display
A modal MUST appear when the game timer reaches zero.

#### Scenario: End Modal Trigger
- **Given** the game is in progress
- **When** the timer reaches 0
- **Then** the game must stop
- **And** the end modal must appear

#### Scenario: End Modal Score Display
- **Given** the end modal is displayed
- **Then** it must show the label "Chỉ số Liêm chính đạt được"
- **And** it must display the final numeric score prominently

### Requirement: Dynamic End Feedback
The end modal message MUST vary based on performance.

#### Scenario: Excellent Performance
- **Given** the final score is greater than 100
- **When** the end modal displays
- **Then** the title must be "Xuất sắc!"
- **And** the message must read: "Bạn đã thấm nhuần tư tưởng 'Cần, Kiệm, Liêm, Chính'. Xã hội đang phát triển vững mạnh."
- **And** a positive icon (star) must be displayed

#### Scenario: Needs Improvement
- **Given** the final score is 100 or less
- **When** the end modal displays
- **Then** the title must be "Cần cố gắng hơn!"
- **And** the message must read: "Các trở lực vẫn còn nhiều. Bác Hồ dặn: 'Phải quét sạch chủ nghĩa cá nhân'."
- **And** an encouraging icon must be displayed

### Requirement: Restart Functionality
The player MUST be able to restart from the end modal.

#### Scenario: Restart Button
- **Given** the end modal is displayed
- **Then** a button labeled "Làm lại từ đầu" must be visible

#### Scenario: Restart Action
- **Given** the user clicks the restart button
- **Then** the end modal must be hidden
- **And** the score must reset to 0
- **And** the timer must reset to the initial value
- **And** the game must start immediately

### Requirement: Modal Accessibility
Modals MUST be accessible.

#### Scenario: Focus Management
- **Given** a modal is displayed
- **Then** focus must move to the modal
- **And** the primary action button must be focusable

#### Scenario: Modal Overlay
- **Given** a modal is displayed
- **Then** a semi-transparent backdrop must cover the game
- **And** clicking the backdrop must NOT dismiss the modal (intentional for educational flow)
