package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.entity.Invoice;
import java.time.LocalDateTime;

public class InvoiceDTO {
    private Long invoiceId;
    private Long amount;
    private LocalDateTime createdDate;
    private String serviceName;
    private String userFullName;

    public InvoiceDTO(Invoice invoice) {
        this.invoiceId = invoice.getInvoiceId();
        this.amount = invoice.getAmount();
        this.createdDate = invoice.getCreatedDate();
        this.serviceName = invoice.getServiceTest().getServiceName(); // cần getter từ ServiceTest
        this.userFullName = invoice.getPayment().getUsers().getFullName(); // cần getter từ Payment → User
    }

    // Getters
    public Long getInvoiceId() {
        return invoiceId;
    }

    public Long getAmount() {
        return amount;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getUserFullName() {
        return userFullName;
    }
}
