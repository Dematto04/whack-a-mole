# Change: Ally Quiz Popup

## Why

Khi người chơi đập nhầm Ally (động lực cách mạng), thay vì phạt trực tiếp, cần tạo cơ hội học tập thông qua câu hỏi quiz. Điều này tăng tính giáo dục và cho người chơi cơ hội "chuộc lỗi".

## What Changes

- Khi đập vào Ally, hiển thị popup quiz với 1 câu hỏi ngẫu nhiên (từ pool 10 câu)
- Nếu trả lời **đúng**: +5 điểm, nhưng **mất streak** (reset về 0)
- Nếu trả lời **sai**: phạt như bình thường (-20 điểm, -15% lòng dân, mất streak)
- Game tạm dừng spawn entity trong khi quiz đang hiển thị
- Quiz có 4 đáp án để chọn (multiple choice)

## Impact

- Affected specs: `scoring-system`, `educational-modals`
- Affected code: `app.js`, `data.js`, `index.html`
- New data: 10 câu hỏi quiz về tư tưởng Hồ Chí Minh và Chủ nghĩa Xã hội
