package swp.project.adn_backend.exception;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.ErrorCodeUser;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppException extends  RuntimeException{
    ErrorCodeUser errorCode;

    public AppException(ErrorCodeUser errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ErrorCodeUser getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCodeUser errorCode) {
        this.errorCode = errorCode;
    }
}
