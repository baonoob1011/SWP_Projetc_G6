package swp.project.adn_backend.exception;



import java.util.Map;

public class MultiFieldValidationException extends RuntimeException {
    private final Map<String, String> errors;

    public MultiFieldValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
