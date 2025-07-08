package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.Column;
import swp.project.adn_backend.entity.WalletTransaction;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.enums.TransactionType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WalletInfoAmountDTO {
    private Long walletId;
    private long balance;


    public WalletInfoAmountDTO(Long walletId, long balance) {
        this.walletId = walletId;
        this.balance = balance;
    }

    public Long getWalletId() {
        return walletId;
    }

    public void setWalletId(Long walletId) {
        this.walletId = walletId;
    }

    public long getBalance() {
        return balance;
    }

    public void setBalance(long balance) {
        this.balance = balance;
    }
}
