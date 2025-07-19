package swp.project.adn_backend.service.payment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.ServiceFeedbackInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletInfoAmountDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletTransitionDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletTransitionInfoDTO;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.dto.request.payment.WalletRequest;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CreatePaymentService {

    private final PaymentRepository paymentRepository;
    private final ServiceTestRepository serviceTestRepository;
    private final InvoiceRepository invoiceRepository;
    private AppointmentService appointmentService;
    private UserRepository userRepository;
    private final WalletRepository walletRepository;
    private WalletTransactionRepository walletTransactionRepository;
    private EntityManager entityManager;

    @Autowired
    public CreatePaymentService(PaymentRepository paymentRepository, ServiceTestRepository serviceTestRepository, InvoiceRepository invoiceRepository, WalletRepository walletRepository, AppointmentService appointmentService, UserRepository userRepository, WalletTransactionRepository walletTransactionRepository, EntityManager entityManager) {
        this.paymentRepository = paymentRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.invoiceRepository = invoiceRepository;
        this.walletRepository = walletRepository;
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.entityManager = entityManager;
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
    @Transactional
    public CreatePaymentRequest CreateWallet(Authentication authentication,
                                             WalletRequest walletRequest) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);

        // Lấy ví hiện có hoặc tạo mới nếu chưa có
        Wallet wallet = walletRepository.findByUser(users).orElse(null);
        // Cộng tiền nạp
        wallet.setUpdatedAt(LocalDate.now());

        // Ghi lịch sử giao dịch nạp tiền
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setWallet(wallet); // ✅ bắt buộc
        walletTransaction.setType(TransactionType.DEPOSIT);
        walletTransaction.setAmount(walletRequest.getAmount());
        walletTransaction.setTimestamp(LocalDateTime.now());
        walletTransaction.setBankCode(generateRandomBankCode());
        walletTransaction.setTransactionStatus(TransactionStatus.PENDING);
        walletTransaction.setTxnRef(txnRef);
        walletTransactionRepository.save(walletTransaction);

        // Tạo request trả về để gọi VNPay
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
        createPaymentRequest.setAmount(walletRequest.getAmount());
        createPaymentRequest.setOrderInfo("Nạp Tiền");
        createPaymentRequest.setTxnRef(txnRef);
        createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment/wallet");
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

    @Transactional
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
            appointmentService.increaseStaffNotification(payment.getAppointment().getStaff());

        }
        invoiceRepository.save(invoice1);
        System.out.println("✅ Invoice updated.");

    }
    @Transactional
    public void successPaymentWallet(String vnpTxnRef) {
        WalletTransaction walletTransaction = walletTransactionRepository.findByTxnRef(vnpTxnRef)
                .orElseThrow(() -> new AppException(ErrorCodeUser.INVOICE_NOT_EXISTS));

        // Nếu đã xử lý rồi thì bỏ qua
        if (walletTransaction.getTransactionStatus() == TransactionStatus.SUCCESS) {
            System.out.println("⚠️ Giao dịch đã xử lý rồi, bỏ qua.");
            return;
        }

        // Cập nhật ví và trạng thái giao dịch
        Wallet wallet = walletTransaction.getWallet();
        System.out.println(wallet.getBalance());
        System.out.println(walletTransaction.getAmount());
        wallet.setBalance(wallet.getBalance() + walletTransaction.getAmount());

        walletTransaction.setTransactionStatus(TransactionStatus.SUCCESS);
        walletTransaction.setTimestamp(LocalDateTime.now());

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
    @Transactional
    public void failPaymentWallet(String vnpTxnRef) {
        WalletTransaction walletTransaction = walletTransactionRepository.findByTxnRef(vnpTxnRef)
                .orElseThrow(() -> new AppException(ErrorCodeUser.INVOICE_NOT_EXISTS));

        walletTransaction.setTransactionStatus(TransactionStatus.FAILED);
        walletTransaction.setTimestamp(LocalDateTime.now());
        System.out.println("thanh Toán Thất bại");
    }
    public List<WalletTransitionDTO> getWalletTransition(Authentication authentication){
        Jwt jwt=(Jwt) authentication.getPrincipal();
        long userId=jwt.getClaim("id");
        Users users=userRepository.findById(userId)
                .orElseThrow(()->new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Wallet wallet=walletRepository.findByUser(users)
                .orElseThrow(()->new AppException(ErrorCodeUser.WALLET_INFO_NOT_EXISTS));

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.WalletTransitionDTO(" +
                "s.walletTransactionId, s.amount, s.type, s.transactionStatus, s.timestamp, s.bankCode) " +
                "FROM WalletTransaction s " +
                "WHERE s.wallet.walletId = :walletId";
        TypedQuery<WalletTransitionDTO> query = entityManager.createQuery(jpql, WalletTransitionDTO.class);
        query.setParameter("walletId", wallet.getWalletId());
        return query.getResultList();

    }

}

