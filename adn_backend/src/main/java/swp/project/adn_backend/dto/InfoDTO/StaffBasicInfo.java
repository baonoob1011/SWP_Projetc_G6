package swp.project.adn_backend.dto.InfoDTO;

public class StaffBasicInfo {
    private Long staffId;
    private String fullName;
    private String phone;
    private String email;
    private String avatarUrl;

    // Constructor dùng trong JPQL new ...


    public StaffBasicInfo(Long staffId, String fullName, String phone, String email, String avatarUrl) {
        this.staffId = staffId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
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
