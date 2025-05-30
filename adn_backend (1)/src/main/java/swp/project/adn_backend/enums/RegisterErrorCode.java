package swp.project.adn_backend.enums;

import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum RegisterErrorCode {
    USER_EXISTED(1001,"User is existed"),
    USERNAME_INVALID(1002,"Username at least 8 character"),
    EMAIL_INVALID(1003, "Email format is invalid"),
    PASSWORD_WEAK(1004, "Password must contain at least one uppercase letter, one digit, and one special character"),
    EMAIL_BLANK(1004, "Email must not be blank"),
    FULLNAME_BLANK(1005, "Full name must not be blank"),
    FULLNAME_TOO_LONG(1006, "Full name must not exceed 255 characters"),
    PHONE_BLANK(1007, "Phone number must not be blank"),
    PHONE_INVALID(1008, "Phone number must be valid, between 9 to 15 digits"),
    USERNAME_BLANK(1009, "Username must not be blank"),
    PASSWORD_BLANK(1010, "Password must not be blank"),
    PASSWORD_TOO_SHORT(1011, "Password must be at least 8 characters"),
    EMAIL_EXISTED(1012, "Email is already registered"),
    PHONE_EXISTED(10013, "Phone number already in use"),
    INVALID_KEY(1014,"Valid Message Key")
    ;
    int code;
    String message;

    RegisterErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
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
