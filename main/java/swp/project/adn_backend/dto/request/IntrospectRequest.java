package swp.project.adn_backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class IntrospectRequest {
    String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
