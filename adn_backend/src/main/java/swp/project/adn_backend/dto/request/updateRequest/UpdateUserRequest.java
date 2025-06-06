package swp.project.adn_backend.dto.request.updateRequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID")
    String phone;

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

    @Size(min = 6, message = "Old password must be at least 6 characters")
    private String oldPassword;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String  address;

    public @Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String getPhone() {
        return phone;
    }

    public void setPhone(@Pattern(regexp = "^\\+?\\d{9,15}$", message = "PHONE_INVALID") String phone) {
        this.phone = phone;
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
