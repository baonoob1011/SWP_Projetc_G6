package swp.project.adn_backend.dto.InfoDTO;

public class StaffBasicInfo {
    private Long staffId;
    private String fullName;
    private String phone;
    private String email;

    // Constructor dùng trong JPQL new ...
    public StaffBasicInfo(Long staffId, String fullName, String phone, String email) {
        this.staffId = staffId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
    }

    // Getters
    public Long getStaffId() {
        return staffId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    // Optional: toString(), equals(), hashCode() nếu cần
}
