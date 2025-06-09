package swp.project.adn_backend.dto.request.updateRequest;


import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @Size(max = 255, message = "FULLNAME_TOO_LONG")
    String fullName;

    // Phone number with validation for proper format
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
    String phone;

    @Size(min = 8, message = "USERNAME_INVALID")
    String username;
    String confirmPassword;
    @Size(min = 8, message = "PASSWORD_WEAK")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    )
    String password;

    // Email validation (should be a proper email format)
    @Email(message = "EMAIL_INVALID")
    String email;

    String oldPassword;
    String address;
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth;

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public @Past(message = "Date of birth must be in the past") LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(@Past(message = "Date of birth must be in the past") LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public @Size(max = 255, message = "FULLNAME_TOO_LONG") String getFullName() {
        return fullName;
    }

    public void setFullName(@Size(max = 255, message = "FULLNAME_TOO_LONG") String fullName) {
        this.fullName = fullName;
    }

    public @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String getPhone() {
        return phone;
    }

    public void setPhone(@Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String phone) {
        this.phone = phone;
    }

    public @Size(min = 8, message = "USERNAME_INVALID") String getUsername() {
        return username;
    }

    public void setUsername(@Size(min = 8, message = "USERNAME_INVALID") String username) {
        this.username = username;
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

    public @Email(message = "EMAIL_INVALID") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "EMAIL_INVALID") String email) {
        this.email = email;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
}
