package swp.project.adn_backend.dto.InfoDTO;

import java.time.LocalDate;
import java.util.Set;

public class UserInfoDTO {
    private String fullName;
    private String phone;
    private String email;
    private boolean enabled;
    private LocalDate createAt;
    private Set<String> roles;
    private String address;

    public UserInfoDTO(String fullName, String phone, String email,
                       boolean enabled, LocalDate createAt) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.enabled = enabled;
        this.createAt = createAt;
    }

    public UserInfoDTO(String fullName, String phone, String email, boolean enabled, LocalDate createAt, String address) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.enabled = enabled;
        this.createAt = createAt;
        this.address = address;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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


    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
