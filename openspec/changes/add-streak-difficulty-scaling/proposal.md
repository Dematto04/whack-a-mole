# Change: Streak-Based Difficulty Scaling

## Why

Hiện tại độ khó game tăng dựa trên tổng số giặc bị diệt (mỗi 5 lần). Điều này không khuyến khích người chơi giữ streak cao. Thay đổi này sẽ làm cho streak có ý nghĩa hơn: streak càng cao thì entity xuất hiện và biến mất càng nhanh, tạo thêm thử thách và phần thưởng tâm lý cho việc duy trì chuỗi đúng.

## What Changes

- Entity `upTime` (thời gian hiển thị) giảm dựa trên `streak` hiện tại thay vì `enemiesHit`
- Mỗi streak +1 giảm ~50ms thời gian hiển thị (có giới hạn tối thiểu)
- Khi streak reset về 0, `upTime` trở về mức ban đầu (cho cơ hội phục hồi)
- Cập nhật config với các thông số điều chỉnh độ khó mới

## Impact

- Affected specs: `scoring-system` (streak behavior modification)
- Affected code: `app.js` (handleWhack, spawnEntity logic)
- No data.js or index.html changes needed
