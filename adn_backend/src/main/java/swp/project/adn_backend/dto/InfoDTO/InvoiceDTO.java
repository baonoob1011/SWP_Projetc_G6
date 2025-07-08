package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.entity.Invoice;
import java.time.LocalDateTime;

public class  InvoiceDTO {
    private Long invoiceId;
    private Long amount;
    private LocalDateTime createdDate;
    private String serviceName;
    private String userFullName;
    private String bankCode;

    public InvoiceDTO(Invoice invoice) {
        this.invoiceId = invoice.getInvoiceId();
        this.amount = invoice.getAmount();
        this.createdDate = invoice.getCreatedDate();
        this.serviceName = invoice.getServiceTest().getServiceName(); // cần getter từ ServiceTest
        this.userFullName = invoice.getPayment().getUsers().getFullName();
        this.bankCode=invoice.getBankCode();
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

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }
}
