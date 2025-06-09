package swp.project.adn_backend.dto.request.updateRequest;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStaffAndManagerRequest {
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
    String phone;
    @Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits")
    String idCard;
    String gender;

    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth;
    String fullName;

    // Password: enforcing strong password policy

    @Size(min = 8, message = "PASSWORD_WEAK")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    )
    String password;

    @Email(message = "EMAIL_INVALID")
    String email;

    private String oldPassword;
    private String confirmPassword;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;

    public @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String getPhone() {
        return phone;
    }

    public void setPhone(@Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String phone) {
        this.phone = phone;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public @Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String password) {
        this.password = password;
    }

    public @Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits") String getIdCard() {
        return idCard;
    }

    public void setIdCard(@Pattern(regexp = "\\d{9}|\\d{12}", message = "ID Card must be 9 or 12 digits") String idCard) {
        this.idCard = idCard;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public @Past(message = "Date of birth must be in the past") LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(@Past(message = "Date of birth must be in the past") LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public @Email(message = "EMAIL_INVALID") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "EMAIL_INVALID") String email) {
        this.email = email;
    }

    public @Size(min = 6, message = "Old password must be at least 6 characters") String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(@Size(min = 6, message = "Old password must be at least 6 characters") String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public @Size(max = 255, message = "Address must be less than 255 characters") String getAddress() {
        return address;
    }

    public void setAddress(@Size(max = 255, message = "Address must be less than 255 characters") String address) {
        this.address = address;
    }
}
