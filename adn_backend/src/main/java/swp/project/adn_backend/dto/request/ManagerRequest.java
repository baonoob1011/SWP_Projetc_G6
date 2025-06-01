package swp.project.adn_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Users;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManagerRequest {

    @NotBlank(message = "FULLNAME_BLANK")
    String fullName;

    @NotBlank(message = "ID Card is required")
    @Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits")
    String idCard;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "EMAIL_INVALID")
    String email;

    @NotBlank(message = "USERNAME_BLANK")
    @Size(min = 8, message = "USERNAME_INVALID")
    String username;

    @NotBlank(message = "PASSWORD_BLANK")
    @Size(min = 8, message = "PASSWORD_WEAK")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    )
    String password;

    boolean enabled = true;

    @NotBlank(message = "CONFIRM_PASSWORD_BLANK")
    String confirmPassword;

    String role;

    @NotBlank(message = "Gender is required")
    String gender;

    @NotBlank(message = "Address is required")
    String address;

    @NotBlank(message = "PHONE_BLANK")
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
    String phone;

    @NotBlank(message = "Birth day is required")
    LocalDate dayOfBirth;

    LocalDate createAt;

    Users users;

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public @NotBlank(message = "FULLNAME_BLANK") String getFullName() {
        return fullName;
    }

    public void setFullName(@NotBlank(message = "FULLNAME_BLANK") String fullName) {
        this.fullName = fullName;
    }

    public @NotBlank(message = "ID Card is required") @Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits") String getIdCard() {
        return idCard;
    }

    public void setIdCard(@NotBlank(message = "ID Card is required") @Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits") String idCard) {
        this.idCard = idCard;
    }

    public @NotBlank(message = "Email must not be blank") @Email(message = "EMAIL_INVALID") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email must not be blank") @Email(message = "EMAIL_INVALID") String email) {
        this.email = email;
    }

    public @NotBlank(message = "USERNAME_BLANK") @Size(min = 8, message = "USERNAME_INVALID") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "USERNAME_BLANK") @Size(min = 8, message = "USERNAME_INVALID") String username) {
        this.username = username;
    }

    public @NotBlank(message = "PASSWORD_BLANK") @Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "PASSWORD_BLANK") @Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public @NotBlank(message = "CONFIRM_PASSWORD_BLANK") String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(@NotBlank(message = "CONFIRM_PASSWORD_BLANK") String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public @NotBlank(message = "Gender is required") String getGender() {
        return gender;
    }

    public void setGender(@NotBlank(message = "Gender is required") String gender) {
        this.gender = gender;
    }

    public @NotBlank(message = "Address is required") String getAddress() {
        return address;
    }

    public void setAddress(@NotBlank(message = "Address is required") String address) {
        this.address = address;
    }

    public @NotBlank(message = "PHONE_BLANK") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank(message = "PHONE_BLANK") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String phone) {
        this.phone = phone;
    }

    public @NotBlank(message = "Birth day is required") LocalDate getDayOfBirth() {
        return dayOfBirth;
    }

    public void setDayOfBirth(@NotBlank(message = "Birth day is required") LocalDate dayOfBirth) {
        this.dayOfBirth = dayOfBirth;
    }

    public LocalDate getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDate createAt) {
        this.createAt = createAt;
    }
}
