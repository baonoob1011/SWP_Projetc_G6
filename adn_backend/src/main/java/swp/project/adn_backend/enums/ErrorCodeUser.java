package swp.project.adn_backend.enums;

import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCodeUser {
    USER_EXISTED(1001, "Username is existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Username must be at least 8 characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email format is invalid", HttpStatus.BAD_REQUEST),
    PASSWORD_WEAK(1004, "Password must contain at least one uppercase letter, one digit, and one special character", HttpStatus.BAD_REQUEST),
    EMAIL_BLANK(1005, "Email must not be blank", HttpStatus.BAD_REQUEST),
    FULLNAME_BLANK(1006, "Full name must not be blank", HttpStatus.BAD_REQUEST),
    FULLNAME_TOO_LONG(1007, "Full name must not exceed 255 characters", HttpStatus.BAD_REQUEST),
    PHONE_BLANK(1008, "Phone number must not be blank", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1009, "Phone number must be valid, between 9 to 15 digits", HttpStatus.BAD_REQUEST),
    USERNAME_BLANK(1010, "Username must not be blank", HttpStatus.BAD_REQUEST),
    PASSWORD_BLANK(1011, "Password must not be blank", HttpStatus.BAD_REQUEST),
    PASSWORD_TOO_SHORT(1012, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1013, "Email is already registered", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1014, "Phone number already in use", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1015, "Valid Message Key", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_BLANK(1016, "Confirm password must not be blank", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_NOT_MATCHING(1017, "Passwords do not match", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1018, "User is not existed", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1019, "Unauthenticated", HttpStatus.UNAUTHORIZED),// Trường hợp đặc biệt
    UNAUTHORIZED(1020, "You do not have permission", HttpStatus.FORBIDDEN),


    //service validation
    SERVICE_NAME_IS_EXISTED(1001,"Service name is existed", HttpStatus.BAD_REQUEST);

    // Trường hợp đặc biệt
    ;
    int code;
    String message;
    HttpStatusCode httpStatusCode;

    ErrorCodeUser(int code, String message) {
        this.code = code;
        this.message = message;
    }

    ErrorCodeUser(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    public HttpStatusCode getHttpStatusCode() {
        return httpStatusCode;
    }

    public void setHttpStatusCode(HttpStatusCode httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }




}
