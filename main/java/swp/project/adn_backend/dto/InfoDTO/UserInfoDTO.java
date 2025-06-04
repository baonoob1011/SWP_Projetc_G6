package swp.project.adn_backend.dto.InfoDTO;

import java.time.LocalDate;

public class UserInfoDTO {
    private String fullName;
    private String phone;
    private String email;
    private boolean enabled;
    private LocalDate createAt;
    private String role;

    public UserInfoDTO(String fullName, String phone, String email, boolean enabled, LocalDate createAt, String role) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.enabled = enabled;
        this.createAt = createAt;
        this.role = role;
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
