package swp.project.adn_backend.dto.request.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {
    @NotBlank
    @Email
    private String email;



    @NotBlank(message = "PASSWORD_BLANK")
    @Size(min = 8, message = "PASSWORD_WEAK")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    )
    private String newPassword;

    // Getters & Setters


    public @NotBlank @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank @Email String email) {
        this.email = email;
    }



    public @NotBlank(message = "PASSWORD_BLANK") @Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(@NotBlank(message = "PASSWORD_BLANK") @Size(min = 8, message = "PASSWORD_WEAK") @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!\\-_]).{8,}$",
            message = "PASSWORD_TOO_SHORT"
    ) String newPassword) {
        this.newPassword = newPassword;
    }
}
