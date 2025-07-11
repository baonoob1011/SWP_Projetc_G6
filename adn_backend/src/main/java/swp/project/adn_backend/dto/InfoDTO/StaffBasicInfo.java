package swp.project.adn_backend.dto.InfoDTO;

import java.time.LocalDate;

public class StaffBasicInfo {
    private Long staffId;
    private String fullName;
    private String phone;
    private String email;
    private String avatarUrl;
    private String gender;
    private String idCard;
    private String address;
    private LocalDate dateOfBirth;

    // Constructor dùng trong JPQL new ...


    public StaffBasicInfo(Long staffId, String fullName, String phone, String email, String avatarUrl, String gender, String idCard, String address, LocalDate dateOfBirth) {
        this.staffId = staffId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.gender = gender;
        this.idCard = idCard;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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
