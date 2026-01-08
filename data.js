const GAME_DATA = {
    meta: {
        title: "ĐẤU TRANH CHỐNG 'GIẶC NỘI XÂM'",
        scoreLabel: "Chỉ số Liêm chính",
        healthLabel: "Lòng dân",
        currency: "Điểm",
    },
    entities: {
        // ENEMIES (Giặc nội xâm) - Targets
        enemies: [
            {
                id: "corruption",
                label: "Tham ô",
                description: "Lấy của công làm của tư",
                color: "#D32F2F", // Revolution Red
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 12h-2V7h2v7zm0 4h-2v-2h2v2z"/></svg>`, // Exclamation/Alert style for now, or Money bag
                weight: 1.2, // Spawn frequency multiplier
                quoteId: "q_corruption"
            },
            {
                id: "waste",
                label: "Lãng phí",
                description: "Tiêu dùng không hợp lý",
                color: "#E64A19", // Deep Orange
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`, // Alarm bell? Or burning
                weight: 1.0,
                quoteId: "q_waste"
            },
            {
                id: "bureaucracy",
                label: "Quan liêu",
                description: "Xa rời thực tế, xa rời quần chúng",
                color: "#455A64", // Blue Grey
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`, // Document
                weight: 1.0,
                quoteId: "q_bureaucracy"
            },
            {
                id: "laziness",
                label: "Lười biếng",
                description: "Không chịu tu dưỡng, rèn luyện",
                color: "#5D4037", // Brown
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>`, // Sleeping icon idea
                weight: 0.8,
                quoteId: "q_laziness"
            },
            {
                id: "division",
                label: "Chia rẽ",
                description: "Gây mất đoàn kết nội bộ",
                color: "#1A237E", // Dark Blue
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-5.19-1.41-1.41L8.59 13.59z M13.81 12.19L12.4 13.61 7.21 8.41l1.41-1.41z m5 -5L20.21 8.61 15.02 13.8 13.61 12.4z m-10 10l-1.41 1.41L2.19 13.41 3.61 12z"/></svg>`, // Broken something
                weight: 0.8,
                quoteId: "q_division"
            }
        ],
        // ALLIES (Động lực) - Protect
        allies: [
            {
                id: "unity",
                label: "Đoàn kết",
                description: "Sức mạnh vô địch của cách mạng",
                color: "#2E7D32", // Green
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`, // Group
                weight: 1.0,
                quoteId: "q_unity"
            },
            {
                id: "democracy",
                label: "Dân chủ",
                description: "Dân là chủ, dân làm chủ",
                color: "#0288D1", // Light Blue
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14l-5-5 1.41-1.41L13 14.17l4.59-4.59L19 11l-6 6z"/></svg>`, // Ballot check?
                weight: 1.0,
                quoteId: "q_democracy"
            },
            {
                id: "science",
                label: "Khoa học",
                description: "Then chốt của phát triển",
                color: "#7B1FA2", // Purple
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`, // Atom or something
                // Let's replace icon with a proper generic one for now
                weight: 0.8,
                quoteId: "q_science"
            },
            {
                id: "ethics",
                label: "Đạo đức",
                description: "Cần, Kiệm, Liêm, Chính",
                color: "#C2185B", // Pink
                icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`, // Heart
                weight: 0.8,
                quoteId: "q_ethics"
            }
        ]
    },
    quotes: {
        // Triggered by specific events
        q_corruption: "Tham ô là hành động xấu xa nhất của con người. (Hồ Chí Minh Toàn tập)",
        q_waste: "Lãng phí tuy không lấy của công bỏ túi riêng, nhưng kết quả tai hại có khi còn hơn tham ô.",
        q_bureaucracy: "Bệnh quan liêu là nguồn gốc sinh ra tham ô, lãng phí.",
        q_laziness: "Lười biếng là kẻ địch to của dân tộc.",
        q_division: "Chia rẽ là làm yếu mình, là giúp cho giặc.",
        q_unity: "Đoàn kết là sức mạnh vô địch.",
        q_democracy: "Nước ta là nước dân chủ. Bao nhiêu lợi ích đều vì dân. Bao nhiêu quyền hạn đều của dân.",
        q_science: "Khoa học phải từ sản xuất mà ra và phải trở lại phục vụ sản xuất.",
        q_ethics: "Người cách mạng phải có đạo đức cách mạng làm nền tảng.",
        
        // General feedback
        success: [
            "Diệt giặc nội xâm thành công!",
            "Giữ vững kỷ cương!",
            "Hành động cương quyết!",
            "Dân tin, Đảng mạnh!",
        ],
        failure_hit_ally: [
            "Sai lầm! Bác dạy: Đoàn kết là sức mạnh.",
            "Cẩn thận! Đừng làm tổn thương động lực cách mạng.",
            "Phải biết phân biệt bạn - thù!",
        ],
        warning_decay: [
            "Đừng để cái xấu tồn tại!",
            "Kiên quyết đấu tranh!",
        ],
        game_over_excellent: [
            "Xuất sắc! Bạn đã thấm nhuần tư tưởng 'Cần, Kiệm, Liêm, Chính'.",
            "Đạo đức cách mạng vững vàng!",
        ],
        game_over_good: [
            "Tốt! Hãy tiếp tục rèn luyện đạo đức cách mạng.",
        ],
        game_over_poor: [
            "Cần cố gắng hơn! Tự phê bình và phê bình là vũ khí sắc bén.",
        ]
    },
    definitions: {
        intro: "Thời kỳ quá độ là cuộc đấu tranh gay go giữa cái cũ và cái mới...",
        mission: "Nhiệm vụ: Kiên quyết loại bỏ 'Giặc nội xâm' và bảo vệ các nhân tố mới.",
        briefing: {
            title: "NHIỆM VỤ CỦA BẠN",
            subtitle: "Bảo vệ Thành quả Cách mạng",
            paragraphs: [
                "Chủ tịch Hồ Chí Minh dạy: <em>\"Tham ô, lãng phí và bệnh quan liêu là kẻ thù của nhân dân, của bộ đội và của Chính phủ.\"</em>",
                "Trong thời kỳ xây dựng Chủ nghĩa Xã hội, ba thứ 'Giặc nội xâm' này cùng với lười biếng và chia rẽ đang đe dọa nền tảng của chế độ.",
                "Bạn là chiến sĩ trên mặt trận tư tưởng. Hãy <strong>ĐÁNH</strong> vào những tệ nạn và <strong>BẢO VỆ</strong> các giá trị cách mạng!"
            ],
            enemies_title: "🎯 GIẶC NỘI XÂM (Đập!)",
            allies_title: "🛡️ ĐỘNG LỰC CÁCH MẠNG (Bảo vệ!)",
            rules: [
                "Đập trúng giặc: <span class='text-ally font-bold'>+10 điểm</span>",
                "Đập nhầm động lực: <span class='text-enemy font-bold'>-20 điểm</span> & mất lòng dân",
                "Bỏ lọt giặc: <span class='text-steel font-bold'>-5 điểm</span>",
                "Hết lòng dân = Thất bại!"
            ],
            start_button: "BẮT ĐẦU NHIỆM VỤ"
        },
        debrief: {
            excellent: {
                title: "XUẤT SẮC!",
                icon: "🏆",
                message: "Bạn là tấm gương sáng về đạo đức cách mạng!",
                quote: "Cần, Kiệm, Liêm, Chính là nền tảng của đời sống mới."
            },
            good: {
                title: "TỐT LẮM!",
                icon: "⭐",
                message: "Bạn đã hoàn thành nhiệm vụ. Hãy tiếp tục rèn luyện!",
                quote: "Một dân tộc, một đảng và mỗi con người, ngày hôm qua là vĩ đại, có sức hấp dẫn lớn, không nhất định hôm nay và ngày mai vẫn được mọi người yêu mến và ca ngợi."
            },
            poor: {
                title: "CẦN CỐ GẮNG",
                icon: "📚",
                message: "Đừng nản chí! Tự phê bình và phê bình là vũ khí sắc bén.",
                quote: "Thất bại là mẹ thành công."
            }
        }
    }
};
