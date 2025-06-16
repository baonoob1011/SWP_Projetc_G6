package swp.project.adn_backend.enums;

public enum TransactionStatus {
    SUCCESS("00", "Giao dịch thành công"),
    FAILED("01", "Giao dịch thất bại"),
    PENDING("02", "Đang xử lý"),
    UNKNOWN("UNKNOWN", "Không xác định");

    private final String code;
    private final String description;

    TransactionStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    // ✅ Dùng để lấy enum từ mã code
    public static TransactionStatus fromCode(String code) {
        for (TransactionStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return UNKNOWN;
    }
}
