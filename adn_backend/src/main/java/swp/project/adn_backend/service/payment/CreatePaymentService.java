package swp.project.adn_backend.service.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.entity.Payment;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.PaymentStatus;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.InvoiceRepository;
import swp.project.adn_backend.repository.PaymentRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class CreatePaymentService {

    private final PaymentRepository paymentRepository;
    private final ServiceTestRepository serviceTestRepository;
    private final InvoiceRepository invoiceRepository;

    @Autowired
    public CreatePaymentService(PaymentRepository paymentRepository,
                                ServiceTestRepository serviceTestRepository,
                                InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public CreatePaymentRequest createPayment(long paymentId, long serviceId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));
        if (!payment.getPaymentMethod().equals(PaymentMethod.VN_PAY)) {
            throw new RuntimeException("Vui lòng chọn phương pháp thanh toán là Vnpay");
        }
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        // ✅ Tạo mã giao dịch duy nhất (txnRef)
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20); // max 20 ký tự

        // ✅ Tạo Invoice
        Invoice invoice = new Invoice();
        invoice.setTxnRef(txnRef);
        invoice.setBankCode(generateRandomBankCode()); // sửa dòng này
        invoice.setAmount((long) payment.getAmount());
        invoice.setOrderInfo(serviceTest.getServiceName());
        invoice.setTransactionStatus(TransactionStatus.PENDING);
        invoice.setCreatedDate(LocalDateTime.now());

        // Gán quan hệ trước
        invoice.setPayment(payment);
        invoice.setServiceTest(serviceTest);

        // ✅ Gán appointment từ payment (sau khi đã gán payment ở trên)
        if (payment.getAppointment() != null) {
            invoice.setAppointment(payment.getAppointment());
        }
        // ✅ Lưu hóa đơn
        invoiceRepository.save(invoice);

        // ✅ Tạo request để trả về cho client tạo URL thanh toán
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
        createPaymentRequest.setAmount(payment.getAmount());
        createPaymentRequest.setOrderInfo(serviceTest.getServiceName());
        createPaymentRequest.setTxnRef(txnRef); // rất quan trọng
        createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment");

        return createPaymentRequest;
    }

    private String generateRandomBankCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int length = 6;
        StringBuilder result = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            result.append(characters.charAt(random.nextInt(characters.length())));
        }
        return result.toString();
    }

    public void successPayment(String vnpTxnRef, String responseCode) {

        Invoice invoice1 = invoiceRepository.findByTxnRef(vnpTxnRef)
                .orElseThrow(() -> new AppException(ErrorCodeUser.INVOICE_NOT_EXISTS));
        invoice1.setTransactionStatus(TransactionStatus.SUCCESS);
        invoice1.setPayDate(LocalDateTime.now());
        invoice1.setResponseCode(responseCode);
        Payment payment = invoice1.getPayment();
        if (payment != null) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransitionDate(LocalDate.now());
            payment.getAppointment().setNote("Đã thanh toán");
        }
        invoiceRepository.save(invoice1);
        System.out.println("✅ Invoice updated.");

    }

    public void failPayment(String vnpTxnRef, String responseCode) {
        Invoice invoice = invoiceRepository.findByTxnRef(vnpTxnRef)
                .orElseThrow(() -> new AppException(ErrorCodeUser.INVOICE_NOT_EXISTS));

        invoice.setTransactionStatus(TransactionStatus.FAILED);
        invoice.setPayDate(LocalDateTime.now());
        invoice.setResponseCode(responseCode);

        Payment payment = invoice.getPayment();
        if (payment != null) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setTransitionDate(LocalDate.now());
            payment.getAppointment().setNote("thanh toán thất bại");
        }

        invoiceRepository.save(invoice);
        System.out.println("❌ Invoice marked as FAILED.");
    }
}

