package swp.project.adn_backend.entity;


import jakarta.persistence.*;
import swp.project.adn_backend.enums.TransactionStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    private String txnRef; // Mã giao dịch VNPay (gửi sang VNPay)

    @Column(columnDefinition = "nvarchar(255)")
    private String orderInfo; // Tên dịch vụ hoặc mô tả

    private Long amount; // Số tiền thanh toán (đơn vị VND)

    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;

    private String responseCode; // Mã phản hồi (00 là thành công)

    private String bankCode; // Mã ngân hàng

    private LocalDateTime payDate; // Ngày giờ thanh toán


    private LocalDateTime createdDate; // Lưu thời điểm tạo invoice

    // Optional - nếu bạn có quan hệ với bảng Payment và ServiceTest
    @ManyToOne(fetch = FetchType.LAZY,cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "service_test_id")
    private ServiceTest serviceTest;

    @ManyToOne(fetch = FetchType.LAZY,cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // Constructors
    public Invoice() {
    }

    // Getters & Setters


    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

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

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatus transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
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

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public ServiceTest getServiceTest() {
        return serviceTest;
    }

    public void setServiceTest(ServiceTest serviceTest) {
        this.serviceTest = serviceTest;
    }
}

