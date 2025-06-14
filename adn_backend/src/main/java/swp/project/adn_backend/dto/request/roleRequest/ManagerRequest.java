package swp.project.adn_backend.dto.request.roleRequest;


import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

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
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z]).*$",
            message = "Password must contain at least one uppercase letter"
    )
    @Pattern(
            regexp = "^(?=.*[0-9]).*$",
            message = "Password must contain at least one number"
    )
    @Pattern(
            regexp = "^(?=.*[@#$%^&+=!\\-_]).*$",
            message = "Password must contain at least one special character (@#$%^&+=!\\-_)"
    )
    String password;

    boolean enabled = true;

    @NotBlank(message = "CONFIRM_PASSWORD_BLANK")
    String confirmPassword;


    @NotBlank(message = "Gender is required")
    String gender;

    @NotBlank(message = "Address is required")
    String address;

    @NotBlank(message = "PHONE_BLANK")
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
    String phone;

    @NotNull(message = "Birth day is required")
    @Past(message = "Birth day must be in the past")
    private LocalDate dateOfBirth;

    LocalDate createAt;

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

    public @NotBlank(message = "PASSWORD_BLANK") 
           @Size(min = 8, message = "Password must be at least 8 characters long")
           @Pattern(regexp = "^(?=.*[A-Z]).*$", message = "Password must contain at least one uppercase letter")
           @Pattern(regexp = "^(?=.*[0-9]).*$", message = "Password must contain at least one number")
           @Pattern(regexp = "^(?=.*[@#$%^&+=!\\-_]).*$", message = "Password must contain at least one special character (@#$%^&+=!\\-_)")
           String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "PASSWORD_BLANK") 
                           @Size(min = 8, message = "Password must be at least 8 characters long")
                           @Pattern(regexp = "^(?=.*[A-Z]).*$", message = "Password must contain at least one uppercase letter")
                           @Pattern(regexp = "^(?=.*[0-9]).*$", message = "Password must contain at least one number")
                           @Pattern(regexp = "^(?=.*[@#$%^&+=!\\-_]).*$", message = "Password must contain at least one special character (@#$%^&+=!\\-_)")
                           String password) {
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

    public @NotNull(message = "Birth day is required") @Past(message = "Birth day must be in the past") LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(@NotNull(message = "Birth day is required") @Past(message = "Birth day must be in the past") LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDate createAt) {
        this.createAt = createAt;
    }
}
