package swp.project.adn_backend.enums;

public enum HardCopyDeliveryStatus {
    PENDING,           // Đã nhận yêu cầu, chưa xử lý
    PRINTED,           // Đã in xong bản cứng
    SHIPPED,           // Đã gửi qua đơn vị vận chuyển
    DELIVERED,         // Người dùng đã nhận
    CANCELLED,         // Hủy yêu cầu gửi
    RETURNED           // Gửi thất bại, trả lại cơ sở
}
