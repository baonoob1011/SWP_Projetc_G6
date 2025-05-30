package swp.project.adn_backend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;


@AllArgsConstructor
@RequiredArgsConstructor
@Data
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    // Full name with length limit
    @NotBlank(message = "FULLNAME_BLANK")
    @Size(max = 255, message = "FULLNAME_TOO_LONG")
     String fullName;

    // Phone number with validation for proper format
    @NotBlank(message = "PHONE_BLANK")
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
     String phone;

    // Username: email validation if you want the username to be an email
    @NotBlank(message = "USERNAME_BLANK")
    @Size(min = 8, message = "USERNAME_INVALID")
    String username;

    // Password: enforcing strong password policy
    @NotBlank(message = "PASSWORD_BLANK")
    @Size(min = 8, message = "PASSWORD_WEAK")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    )
     String password;

    // Email validation (should be a proper email format)
    @NotBlank(message = "Email must not be blank")
    @Email(message = "EMAIL_INVALID")
     String email;

    // Confirm Password: ensuring it matches the password
    @NotBlank(message = "CONFIRM_PASSWORD_BLANK")
    String confirmPassword;

    public @NotBlank(message = "CONFIRM_PASSWORD_BLANK") String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(@NotBlank(message = "CONFIRM_PASSWORD_BLANK") String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    String role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public @NotBlank(message = "FULLNAME_BLANK") @Size(max = 255, message = "FULLNAME_TOO_LONG") String getFullName() {
        return fullName;
    }

    public void setFullName(@NotBlank(message = "FULLNAME_BLANK") @Size(max = 255, message = "FULLNAME_TOO_LONG") String fullName) {
        this.fullName = fullName;
    }

    public @NotBlank(message = "PHONE_BLANK") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank(message = "PHONE_BLANK") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String phone) {
        this.phone = phone;
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

}
