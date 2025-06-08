package swp.project.adn_backend.dto.request.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OtpVerifyRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;


    // Getters & Setters


    public @NotBlank @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank @Email String email) {
        this.email = email;
    }

    public @NotBlank String getOtp() {
        return otp;
    }

    public void setOtp(@NotBlank String otp) {
        this.otp = otp;
    }

}
