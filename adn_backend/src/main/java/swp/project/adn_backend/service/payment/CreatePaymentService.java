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
        System.out.println("▶️ Start createPayment: paymentId=" + paymentId + ", serviceId=" + serviceId);

        try {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

            ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                    .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

            Double amount = payment.getAmount();
            if (amount == null) {
                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
            }

            // Sinh txnRef duy nhất
            String txnRef;
            int attempts = 0;
            do {
                txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
                attempts++;
                System.out.println("🔁 Generated txnRef attempt " + attempts + ": " + txnRef);
            } while (invoiceRepository.existsByTxnRef(txnRef));

            System.out.println("✅ Final txnRef: " + txnRef);

            // Tạo hóa đơn
            Invoice invoice = new Invoice();
            invoice.setTxnRef(txnRef);
            invoice.setAmount((long) payment.getAmount());
            invoice.setOrderInfo(serviceTest.getServiceName());
            invoice.setStatus("PENDING");
            invoice.setCreatedDate(LocalDateTime.now());
            invoice.setPayment(payment);
            invoice.setServiceTest(serviceTest);

            invoiceRepository.save(invoice);
            System.out.println("🧾 Invoice saved: txnRef=" + txnRef + ", amount=" + invoice.getAmount() + ", status=" + invoice.getStatus());

            // Chuẩn bị response trả về FE
            CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
            createPaymentRequest.setAmount(payment.getAmount());
            createPaymentRequest.setOrderInfo(serviceTest.getServiceName());
            createPaymentRequest.setTxnRef(txnRef);
            createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment");

            System.out.println("↩️ Returning createPaymentRequest with txnRef=" + txnRef);

            return createPaymentRequest;

        } catch (Exception ex) {
            System.out.println("❌ Error during createPayment: " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
    }
}
