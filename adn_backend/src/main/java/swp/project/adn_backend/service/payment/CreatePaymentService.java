package swp.project.adn_backend.service.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.entity.Payment;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.InvoiceRepository;
import swp.project.adn_backend.repository.PaymentRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.time.LocalDateTime;
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

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        // ✅ Tạo mã giao dịch duy nhất (txnRef)
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20); // max 20 ký tự

        // ✅ Tạo Invoice
        Invoice invoice = new Invoice();
        invoice.setTxnRef(txnRef);
        invoice.setAmount((long) payment.getAmount());
        invoice.setOrderInfo(serviceTest.getServiceName());
        invoice.setStatus("PENDING");
        invoice.setCreatedDate(LocalDateTime.now());

        // Gán quan hệ nếu có
        invoice.setPayment(payment);
        invoice.setServiceTest(serviceTest);

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
}


