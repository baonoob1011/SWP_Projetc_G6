package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.entity.WalletTransaction;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.enums.TransactionType;

import java.time.LocalDateTime;

public class WalletTransitionInfoDTO {
    private Long walletTransactionId;
    private long amount;
    private TransactionType type;
    private TransactionStatus transactionStatus;
    private LocalDateTime timestamp;
    private String bankCode;

    public WalletTransitionInfoDTO(WalletTransaction walletTransaction) {
        this.walletTransactionId = walletTransaction.getWalletTransactionId();
        this.amount = walletTransaction.getAmount();
        this.type = walletTransaction.getType();
        this.transactionStatus = walletTransaction.getTransactionStatus();
        this.timestamp = walletTransaction.getTimestamp();
        this.bankCode = walletTransaction.getBankCode();
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
