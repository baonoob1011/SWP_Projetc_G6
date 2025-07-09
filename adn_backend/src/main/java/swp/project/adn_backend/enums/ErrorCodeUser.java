package swp.project.adn_backend.enums;

import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCodeUser {
    USER_EXISTED(1001, "Tên đăng nhập đã tồn tại", HttpStatus.BAD_REQUEST),
    KIT_EXISTED(1039, "Kit đã tồn tại", HttpStatus.BAD_REQUEST),
    STAFF_NOT_EXISTED(1002, "Nhân viên không tồn tại", HttpStatus.BAD_REQUEST),
    ROOM_TIME_INVALID(1003, "Phòng không hoạt động trong khoảng thời gian đã chọn", HttpStatus.BAD_REQUEST),
    TIME_EXISTED(1004, "Khung giờ bị trùng với một slot đã tồn tại trong cùng phòng", HttpStatus.BAD_REQUEST),
    SLOT_NOT_EXISTS(1005, "Slot không tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_SAMPLE_STATUS_TRANSITION(1005, "Không được quay lại trạng thái trước của mẫu", HttpStatus.BAD_REQUEST),
    LOCATION_NOT_EXISTS(1006, "Địa điểm không tồn tại", HttpStatus.BAD_REQUEST),
    DISCOUNT_NOT_EXISTS(1006, "Địa điểm không tồn tại", HttpStatus.BAD_REQUEST),
    PRICE_LIST_NOT_FOUND(1007, "Không tìm thấy bảng giá", HttpStatus.BAD_REQUEST),
    ROOM_NOT_FOUND(1008, "Phòng không tồn tại", HttpStatus.BAD_REQUEST),
    MANAGER_NOT_FOUND(1009, "Quản lý không tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_DATE_OF_BIRTH(1010, "Ngày sinh là bắt buộc trong yêu cầu", HttpStatus.BAD_REQUEST),
    INVALID_GENDER(1011, "Giới tính không hợp lệ", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_MAPPING(1012, "Mật khẩu cũ không đúng hoặc không tồn tại", HttpStatus.BAD_REQUEST),
    PASSWORD_EXISTED(1013, "Mật khẩu đã tồn tại", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_EXISTS(1014, "Dịch vụ không tồn tại", HttpStatus.BAD_REQUEST),
    USER_DISABLED(1015, "Tài khoản người dùng chưa được kích hoạt", HttpStatus.BAD_REQUEST),

    USERNAME_INVALID(1016, "Tên đăng nhập phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1017, "Định dạng email không hợp lệ", HttpStatus.BAD_REQUEST),
    PASSWORD_WEAK(1018, "Mật khẩu phải bao gồm ít nhất một chữ hoa, một chữ số và một ký tự đặc biệt", HttpStatus.BAD_REQUEST),
    EMAIL_BLANK(1019, "Email không được để trống", HttpStatus.BAD_REQUEST),
    FULLNAME_BLANK(1020, "Họ và tên không được để trống", HttpStatus.BAD_REQUEST),
    FULLNAME_TOO_LONG(1021, "Họ và tên không được vượt quá 255 ký tự", HttpStatus.BAD_REQUEST),
    PHONE_BLANK(1022, "Số điện thoại không được để trống", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1023, "Số điện thoại phải có từ 9 đến 15 chữ số", HttpStatus.BAD_REQUEST),
    USERNAME_BLANK(1024, "Tên đăng nhập không được để trống", HttpStatus.BAD_REQUEST),
    PASSWORD_BLANK(1025, "Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    PASSWORD_TOO_SHORT(1026, "Mật khẩu phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1027, "Email đã được đăng ký", HttpStatus.BAD_REQUEST),
    LOCUS_EXISTED(1027, "Locus này đã được đăng ký", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1028, "Số điện thoại đã được sử dụng", HttpStatus.BAD_REQUEST),
    ADDRESS_EXISTED(1029, "Địa chỉ đã được sử dụng", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1030, "Mã xác minh không hợp lệ", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_BLANK(1031, "Xác nhận mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_NOT_MATCHING(1032, "Mật khẩu xác nhận không khớp", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1033, "Người dùng không tồn tại", HttpStatus.BAD_REQUEST),
    CONSULTANT_REGISTER_NOT_EXISTED(1033, "Đơn đăng ký tư vấn không tồn tại", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1034, "Chưa xác thực người dùng", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1035, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    PHONE_NOT_EXISTS(1036, "Số điện thoại không tồn tại", HttpStatus.BAD_REQUEST),
    KIT_NOT_EXISTS(1036, "Kit không tồn tại", HttpStatus.BAD_REQUEST),
    PRICE_NOT_EXISTS(1040, "price không tồn tại", HttpStatus.BAD_REQUEST),
    SAMPLE_NOT_EXISTS(1040, "Sample không tồn tại", HttpStatus.BAD_REQUEST),
    LOCUS_NOT_EXISTS(1040, "locus không tồn tại", HttpStatus.BAD_REQUEST),
    RESULT_LOCUS_NOT_EXISTS(1040, "Result Locus không tồn tại", HttpStatus.BAD_REQUEST),
    LOCUS_NOT_FOUND(1040, "locus Locus không tồn tại", HttpStatus.BAD_REQUEST),

    // Service validation
    SERVICE_NAME_IS_EXISTED(1037, "Tên dịch vụ đã tồn tại", HttpStatus.BAD_REQUEST),
    //    SERVICE_NOT_EXISTS(1038, "Dịch vụ không tồn tại", HttpStatus.BAD_REQUEST),
    ROOM_TIME_OVERLAP(1038, "Room's open and close time overlaps with another room", HttpStatus.BAD_REQUEST),
    APPOINTMENT_NOT_EXISTS(1036, "Appointment không tồn tại", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_EXISTS(1036, "payment không tồn tại", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_EXISTS(10341, "emial không tồn tại", HttpStatus.BAD_REQUEST),
    PAYMENT_INFO_NOT_EXISTS(10341, "payment info không tồn tại", HttpStatus.BAD_REQUEST),
    WALLET_INFO_NOT_EXISTS(10341, "wallet info không tồn tại", HttpStatus.BAD_REQUEST),
    PATIENT_INFO_NOT_EXISTS(10341, "patient info không tồn tại", HttpStatus.BAD_REQUEST),
    INVOICE_NOT_EXISTS(10341, "invoice không tồn tại", HttpStatus.BAD_REQUEST),
    SLOT_OUTSIDE_ROOM_TIME(10342, "Slot time is outside of room's available time range", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_NOT_MATCH(1043, "Confirm password does not match the new password", HttpStatus.BAD_REQUEST),
    INVOICE_ALREADY_PAID(1043, "Invoice has already been paid", HttpStatus.BAD_REQUEST),
    NO_RESULT_LOCUS_FOUND_FOR_SAMPLE(1043, "Không tìm thấy ResultLocus cho mẫu này", HttpStatus.BAD_REQUEST),
    STAFF_TIME_OVERLAP(1003, "Nhân viên đã được phân công vào khung giờ này ở phòng khác"),
    STAFF_SLOT_CREATION_FAILED(1003, "Không thể tạo slot: Nhân viên đã có lịch tại phòng khác trong cùng khung giờ"),

    // Blog validation  
    BLOG_NOT_FOUND(1003, "Blog không tồn tại", HttpStatus.BAD_REQUEST),

    // Feedback validation
    FEEDBACK_NOT_FOUND(1044, "Feedback không tồn tại", HttpStatus.NOT_FOUND),

    //

    // Trường hợp đặc biệt
    INVALID_REQUEST(1021, "Invalid request"),
    INTERNAL_ERROR(1022, "Internal server error. Please try again later.");
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
