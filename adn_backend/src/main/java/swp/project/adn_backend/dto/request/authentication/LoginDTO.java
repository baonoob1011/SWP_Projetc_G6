package swp.project.adn_backend.dto.request.authentication;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginDTO {
    @NotBlank(message = "USERNAME_BLANK")
    private String username;

    @NotBlank(message = "PASSWORD_BLANK")
    private String password;

    public LoginDTO() {
    }

    public LoginDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public @NotBlank(message = "USERNAME_BLANK") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "USERNAME_BLANK") String username) {
        this.username = username;
    }

    public @NotBlank(message = "PASSWORD_BLANK") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "PASSWORD_BLANK") String password) {
        this.password = password;
    }
}
