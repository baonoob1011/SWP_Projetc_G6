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

    @Autowired
    public CreatePaymentService(PaymentRepository paymentRepository,
                                ServiceTestRepository serviceTestRepository) {
        this.paymentRepository = paymentRepository;
        this.serviceTestRepository = serviceTestRepository;
    }

    public CreatePaymentRequest createPayment(long paymentId, long serviceId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
        createPaymentRequest.setAmount(payment.getAmount());
        createPaymentRequest.setOrderInfo(serviceTest.getServiceName());
        createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment");
        return createPaymentRequest;
    }
}
