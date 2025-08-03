package swp.project.adn_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemTransactionHistoryResponse {
    private List<TransactionRecord> transactions;
    private long totalIncome;
    private long totalExpense;
    private long netAmount;
    private String description;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionRecord {
        private Long transactionId;
        private String transactionType; // "INCOME" hoặc "EXPENSE"
        private String category; // "PAYMENT", "REFUND", "DEPOSIT", 
        private long amount;
        private String currency; // "VND"
        private String description;
        private String userName;
        private String userEmail;
        private String userPhone; // Số điện thoại người dùng
        private LocalDateTime timestamp;
        private String status; // "SUCCESS", "PENDING", "FAILED"
        private String paymentMethod; // "CASH",  "WALLET"
        private String appointmentInfo; // Thông tin lịch hẹn liên quan
        private String serviceName; // Tên dịch vụ xét nghiệm
        private Long serviceId; // ID dịch vụ
        private Long appointmentId; // ID lịch hẹn
        private String appointmentDate; // Ngày hẹn
        private String appointmentType; // Loại lịch hẹn
        private String createdBy; // Người tạo giao dịch (USER, ADMIN, MANAGER, SYSTEM)
        private String note; // Ghi chú
        private Long refTransactionId; // ID giao dịch gốc (cho hoàn tiền)
        private Long walletBalanceAfter; // Số dư ví sau giao dịch (cho giao dịch ví)
    }
} 