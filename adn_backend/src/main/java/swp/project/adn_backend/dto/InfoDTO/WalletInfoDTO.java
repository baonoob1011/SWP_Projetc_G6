package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import swp.project.adn_backend.entity.WalletTransaction;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.enums.TransactionType;

import java.time.LocalDateTime;

public class WalletInfoDTO {
    private Long walletTransactionId;
    private long amount;
    private TransactionType type;
    private TransactionStatus transactionStatus;
    private LocalDateTime timestamp;
    private String bankCode;

    public WalletInfoDTO(WalletTransaction walletTransaction) {
        this.walletTransactionId = walletTransaction.getWalletTransactionId();
        this.amount = walletTransaction.getAmount();
        this.type = walletTransaction.getType();
        this.transactionStatus = walletTransaction.getTransactionStatus();
        this.timestamp = walletTransaction.getTimestamp();
        this.bankCode = walletTransaction.getBankCode();
    }

}
