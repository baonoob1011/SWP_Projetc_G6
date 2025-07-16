package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.entity.WalletTransaction;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.enums.TransactionType;

import java.time.LocalDateTime;

public class WalletTransitionDTO {
    private Long walletTransactionId;
    private long amount;
    private TransactionType type;
    private TransactionStatus transactionStatus;
    private LocalDateTime timestamp;
    private String bankCode;

    public WalletTransitionDTO(Long walletTransactionId, long amount, TransactionType type, TransactionStatus transactionStatus, LocalDateTime timestamp, String bankCode) {
        this.walletTransactionId = walletTransactionId;
        this.amount = amount;
        this.type = type;
        this.transactionStatus = transactionStatus;
        this.timestamp = timestamp;
        this.bankCode = bankCode;
    }

    public Long getWalletTransactionId() {
        return walletTransactionId;
    }

    public void setWalletTransactionId(Long walletTransactionId) {
        this.walletTransactionId = walletTransactionId;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatus transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
}
