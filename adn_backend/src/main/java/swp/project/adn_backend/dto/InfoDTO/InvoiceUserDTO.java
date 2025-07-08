package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.enums.TransactionStatus;

import java.time.LocalDateTime;

public class InvoiceUserDTO {
    private Long invoiceId;
    private Long amount;
    private LocalDateTime createdDate;
    private LocalDateTime payDate; // Ngày giờ thanh toán
    private String bankCode;
    private TransactionStatus transactionStatus;
    private String orderInfo; // Tên dịch vụ hoặc mô tả

    public InvoiceUserDTO(Long invoiceId, Long amount, LocalDateTime createdDate, LocalDateTime payDate, String bankCode, TransactionStatus transactionStatus, String orderInfo) {
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.createdDate = createdDate;
        this.payDate = payDate;
        this.bankCode = bankCode;
        this.transactionStatus = transactionStatus;
        this.orderInfo = orderInfo;
    }

    public LocalDateTime getPayDate() {
        return payDate;
    }

    public void setPayDate(LocalDateTime payDate) {
        this.payDate = payDate;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatus transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }


}
