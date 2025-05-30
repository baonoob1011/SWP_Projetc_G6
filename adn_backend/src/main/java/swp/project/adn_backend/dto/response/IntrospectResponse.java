package swp.project.adn_backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IntrospectResponse {
    boolean valid;

    public IntrospectResponse() {}

    public IntrospectResponse(boolean valid) {
        this.valid = valid;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        boolean valid;

        public Builder valid(boolean valid) {
            this.valid = valid;
            return this;
        }

        public IntrospectResponse build() {
            return new IntrospectResponse(valid);
        }
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
