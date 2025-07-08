package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walletTransactionId;

    private long amount;
    private String txnRef;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;
    private LocalDateTime timestamp;
    private String bankCode;
    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    public Long getWalletTransactionId() {
        return walletTransactionId;
    }

    public String getBankCode() {
        return bankCode;
    }

    public String getTxnRef() {
        return txnRef;
    }

    public void setTxnRef(String txnRef) {
        this.txnRef = txnRef;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatus transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public void setWalletTransactionId(Long walletTransactionId) {
        walletTransactionId = walletTransactionId;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }
}
