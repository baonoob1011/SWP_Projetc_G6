package swp.project.adn_backend.dto.InfoDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public class StaffInfoDTO {

    private String fullName;
    private String phone;
    private String email;
    private boolean enabled;
    private LocalDate createAt;
    private String role;
    private String idCard;
    private String gender;
    private String address;
    private LocalDate dateOfBirth;
    public StaffInfoDTO(String fullName, String phone, String email,
                        boolean enabled, LocalDate createAt,
                        String idCard, String gender, String address,
                        LocalDate dateOfBirth) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.enabled = enabled;
        this.createAt = createAt;
        this.idCard = idCard;
        this.gender = gender;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
    }


    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }


    public LocalDate getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDate createAt) {
        this.createAt = createAt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
