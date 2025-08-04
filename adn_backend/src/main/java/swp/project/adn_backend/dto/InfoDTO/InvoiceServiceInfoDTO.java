package swp.project.adn_backend.dto.InfoDTO;

import java.time.LocalDateTime;

public class InvoiceServiceInfoDTO {
    private Long invoiceId;
    private String txnRef;
    private String orderInfo;
    private Long amount;
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime payDate;
    private LocalDateTime createdDate;

    public InvoiceServiceInfoDTO(Long invoiceId, String txnRef, String orderInfo, Long amount, 
                                String serviceName, String serviceDescription, 
                                LocalDateTime payDate, LocalDateTime createdDate) {
        this.invoiceId = invoiceId;
        this.txnRef = txnRef;
        this.orderInfo = orderInfo;
        this.amount = amount;
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
        this.payDate = payDate;
        this.createdDate = createdDate;
    }

    // Getters and Setters
    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getTxnRef() {
        return txnRef;
    }

    public void setTxnRef(String txnRef) {
        this.txnRef = txnRef;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    public LocalDateTime getPayDate() {
        return payDate;
    }

    public void setPayDate(LocalDateTime payDate) {
        this.payDate = payDate;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
} 