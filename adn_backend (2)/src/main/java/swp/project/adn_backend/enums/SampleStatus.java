package swp.project.adn_backend.enums;

public enum SampleStatus {
    COLLECTED,       // Đã thu thập mẫu
    IN_TRANSIT,      // Đang vận chuyển đến phòng xét nghiệm
    RECEIVED,        // Phòng xét nghiệm đã nhận
    TESTING,         // Đang xét nghiệm
    COMPLETED,       // Đã xét nghiệm xong
    DAMAGED,         // Mẫu bị hỏng
    REJECTED         // Bị từ chối do lỗi hoặc không hợp lệ
}
