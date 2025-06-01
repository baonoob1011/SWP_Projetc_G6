package swp.project.adn_backend.dto.response;

import swp.project.adn_backend.enums.ErrorCodeUser;

public class ErrorResponse {
    private ErrorCodeUser errorCode;
    private String message;

    public ErrorResponse(ErrorCodeUser errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public ErrorCodeUser getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCodeUser errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
