# Project Proposal: Interactive Learning Lab - "Xây dựng CNXH theo Tư tưởng Hồ Chí Minh"

## Change ID
`feature-hcm-socialism-edutainment-platform`

## Executive Summary
Chuyển đổi source code game Whack-a-Mole hiện có thành một nền tảng Học tập tương tác (Interactive Learning). Dự án kết hợp giữa việc cung cấp kiến thức lý luận (Chương III: Tư tưởng Hồ Chí Minh về CNXH) và cơ chế Gamification để giúp người học ghi nhớ sâu sắc các khái niệm trừu tượng như "Động lực phát triển" và "Trở lực kìm hãm".

## Motivation
Việc học lý luận chính trị qua slide thường khô khan và khó nhớ. Sinh viên thường nhầm lẫn giữa các khái niệm "Đặc trưng", "Động lực" và "Trở lực".

Dự án này giải quyết vấn đề bằng cách cụ thể hóa lý thuyết thành hành động:
- **Lý thuyết:** "CNXH cần loại bỏ tham ô, lãng phí".
- **Hành động:** Người chơi phải phản xạ nhanh để tiêu diệt "Tham ô".
- **Kết quả:** Khắc sâu kiến thức: Tham ô là kẻ thù, không phải là bạn.

## Core Conceptual Framework (Khung Tư duy)
Dự án sẽ hoạt động dựa trên mô hình "3 Bước Nhận Thức":
1. **Nhận diện (Identify):** Phân biệt đâu là nhân tố tích cực (Động lực) và tiêu cực (Trở lực) trong tư tưởng Bác.
2. **Đấu tranh (Action):** Dùng "Pháp luật" và "Đạo đức" để xử lý các vấn đề.
3. **Thấm nhuần (Reflection):** Đọc lại các trích dẫn của Bác sau mỗi màn chơi.

## Scope & Features

### 1. In-Game Learning Mechanics (Cơ chế vừa học vừa chơi)
- **Split-Entity System (Hệ thống phân loại thực thể):**
    - **Nhóm "Giặc nội xâm" (Cần tiêu diệt):** Tham ô, Lãng phí, Quan liêu, Chia rẽ, Lười biếng. (Mỗi loại có icon và nhãn riêng).
    - **Nhóm "Động lực" (Cần bảo vệ):** Đoàn kết, Dân chủ, Khoa học, Văn hóa, Đạo đức.
- **The "Hammer" Metaphor:** Con trỏ chuột không phải là cái búa gỗ, mà là biểu tượng của "Pháp chế XHCN" hoặc "Kỷ luật Đảng".
- **Health Bar as "Public Trust" (Thanh máu = Lòng dân):**
    - Đánh nhầm vào "Động lực" -> Mất niềm tin (Máu giảm mạnh).
    - Để "Tham ô" tồn tại quá lâu -> Mất niềm tin (Máu giảm từ từ).

### 2. The "Knowledge Sidebar" (Thư viện Lý luận)
- Tích hợp một Panel bên cạnh (hoặc Modal trước khi chơi) tóm tắt ngắn gọn:
    - CNXH là gì? (Mục tiêu: Dân giàu, nước mạnh...).
    - Tại sao phải chống tham ô? (Trích dẫn: "Tham ô, lãng phí và bệnh quan liêu là kẻ thù của nhân dân, của bộ đội và của Chính phủ").

### 3. "Quote of the Moment" (Trích dẫn ngữ cảnh)
- Khi đánh trúng "Tham ô": Hiện popup nhỏ/toast text: "Diệt giặc nội xâm!".
- Khi đánh nhầm "Đoàn kết": Hiện cảnh báo đỏ: "Sai lầm! Bác dạy: Đoàn kết là sức mạnh."
- Màn hình chiến thắng: Hiển thị trọn vẹn một lời dạy của Bác về sự thành công của công cuộc xây dựng CNXH.

## Implementation Details UI/UX Concept
- **Theme:** "Công trường xây dựng Đất nước" (Construction/Blueprint style).
- **Color Palette:** Đỏ cờ (Revolution Red), Vàng sao (Gold), và Xanh công nhân (Blue collar).
- **Typography:** Font chữ chân phương, mạnh mẽ (như các khẩu hiệu tuyên truyền cổ động).

## Logic Flow Modification
- **Phase 1: Briefing (Học):** Người dùng đọc nhanh 3 quy tắc cốt lõi (Ai là bạn, ai là thù).
- **Phase 2: Gameplay (Thi):** Game diễn ra trong 60s (tượng trưng cho giai đoạn quá độ).
- **Phase 3: Debrief (Tổng kết):** Dựa trên điểm số, hệ thống đánh giá mức độ "giác ngộ" tư tưởng.

## Impact Analysis (Files Affected)

| Component | Change Description | Content Alignment |
|-----------|--------------------|-------------------|
| **Data.js** | Tạo Database các câu nói của Bác | Nội dung cốt lõi |
| **GameEngine.js** | Logic phân loại Friend/Foe | Phản ánh tính biện chứng |
| **UI.js** | Thêm hiển thị trích dẫn (Quotes) | Giáo dục trực quan |
| **Assets** | Icons cho từng khái niệm cụ thể | Trực quan hóa khái niệm |

## Success Criteria (Tiêu chí thành công về mặt giáo dục)
1. Người chơi phân biệt được ít nhất 3 loại "Trở lực" và 3 loại "Động lực" sau khi chơi.
2. Trò chơi hiển thị chính xác các trích dẫn của Hồ Chí Minh phù hợp với hành động của người chơi (Context-aware quotes).
3. Giao diện thể hiện được tính nghiêm túc nhưng vẫn hấp dẫn của một đề tài chính trị.
4. Điểm số cuối cùng được gọi tên là "Chỉ số Liêm chính" hoặc "Chỉ số Xây dựng Đảng".

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| **Game quá khó khiến người chơi không đọc được text.** | Làm chậm tốc độ game (slow-paced), ưu tiên thời gian hiển thị text khi đánh trúng. |
| **Nội dung hiển thị sai lệch tư tưởng.** | Chỉ sử dụng nguyên văn các câu nói trong Giáo trình và Hồ Chí Minh Toàn tập. |

## Approval
- [ ] Content Verified (Kiểm tra tính chính xác của trích dẫn)
- [ ] Gameplay Balanced (Cân bằng giữa học và chơi)
