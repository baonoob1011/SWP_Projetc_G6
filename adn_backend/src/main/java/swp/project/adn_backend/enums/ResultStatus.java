package swp.project.adn_backend.enums;

public enum ResultStatus {
    PENDING,         // Chưa có kết quả
    IN_PROGRESS,     // Đang xử lý
    COMPLETED,       // Đã có kết quả
    DELIVERED,       // Đã gửi kết quả cho khách hàng
    ERROR            // Có lỗi trong quá trình xét nghiệm
}
