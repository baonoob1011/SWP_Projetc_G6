package swp.project.adn_backend.enums;

public enum RoomStatus {
    AVAILABLE,     // Phòng đang trống và có thể sử dụng
    ACTIVE,     // Phòng đang trống và có thể sử dụng
    BOOKED,      // Phòng đang có người sử dụng
    MAINTENANCE,   // Phòng đang bảo trì
    DISABLED       // Phòng không được sử dụng (tạm thời hoặc vĩnh viễn)
}
