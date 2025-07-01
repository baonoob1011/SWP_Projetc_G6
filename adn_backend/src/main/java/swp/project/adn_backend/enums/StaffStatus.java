package swp.project.adn_backend.enums;

public enum StaffStatus {
    REGISTERED,        // Đã đăng ký lịch xét nghiệm
    SAMPLE_COLLECTED,  // Đã thu mẫu
    IN_ANALYSIS,       // Đang phân tích mẫu
    COMPLETED,         // Đã có kết quả
    CANCELLED,         // Đã hủy xét nghiệm
    NO_SHOW     ,// Vắng mặt khi đến lịch
    BOOKED,
    AVAILABLE
}
