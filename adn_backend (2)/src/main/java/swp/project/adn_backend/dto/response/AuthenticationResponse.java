package swp.project.adn_backend.dto.response;

import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;
    String authenticated;
    // Thêm các trường khác nếu cần

    // Constructor không tham số
    public AuthenticationResponse() {}

    // Constructor đầy đủ tham số
    public AuthenticationResponse(String token, String authenticated) {
        this.token = token;
        this.authenticated = authenticated;
    }

    // Static builder method
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String authenticated;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder authenticated(String authenticated) {
            this.authenticated = authenticated;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, authenticated);
        }
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(String authenticated) {
        this.authenticated = authenticated;
    }
}
