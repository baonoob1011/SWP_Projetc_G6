package swp.project.adn_backend.service.payment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.OrderInfoResponseDTO;
import swp.project.adn_backend.dto.InfoDTO.PaymentInfoDTO;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.Payment;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.entity.WalletTransaction;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.PaymentMapper;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.PaymentRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static swp.project.adn_backend.service.registerServiceTestService.AppointmentService.generateRandomBankCode;

@Service
public class PaymentService {
    private PaymentRepository paymentRepository;
    private PaymentMapper paymentMapper;
    private EntityManager entityManager;
    private UserRepository userRepository;
    private AppointmentRepository appointmentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, EntityManager entityManager, UserRepository userRepository, AppointmentRepository appointmentRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Payment createPayment(PaymentRequest paymentRequest) {
        Payment payment = paymentMapper.toPayment(paymentRequest);
        return paymentRepository.save(payment);
    }

    public List<PaymentInfoDTO> getAllPayment(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userPayment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.PaymentInfoDTO(" +
                "s.paymentId, s.amount, s.paymentMethod, s.getPaymentStatus) " +
                "FROM Payment s Where s.Users.userId=:userId";

        TypedQuery<PaymentInfoDTO> query = entityManager.createQuery(jpql, PaymentInfoDTO.class);
        query.setParameter("userId", userId);  // Đặt giá trị userId vào câu truy vấn

        return query.getResultList();
    }

    public List<OrderInfoResponseDTO> getOrderPaymentInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.OrderInfoResponseDTO(" +
                "s.paymentId, s.amount, s.paymentMethod, s.getPaymentStatus, s.transitionDate) " +
                "FROM Payment s";
        TypedQuery<OrderInfoResponseDTO> query = entityManager.createQuery(jpql, OrderInfoResponseDTO.class);
        return query.getResultList();
    }

    @Transactional
    public void updatePaymentMethod(long paymentId, PaymentRequest paymentRequest) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

        payment.setPaymentMethod(paymentRequest.getPaymentMethod());

    }

    @Transactional
    public void walletRefund(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        Users users = appointment.getUsers();
        for (Payment payment : appointment.getPayments()) {
            if (payment.getGetPaymentStatus().equals(PaymentStatus.PAID)) {
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                users.getWallet().setBalance(users.getWallet().getBalance() + (long) payment.getAmount());
                WalletTransaction walletTransaction = new WalletTransaction();
                walletTransaction.setAmount((long) payment.getAmount());
                walletTransaction.setTimestamp(LocalDateTime.now());
                walletTransaction.setBankCode(generateRandomBankCode());
                walletTransaction.setTransactionStatus(TransactionStatus.SUCCESS);
                walletTransaction.setType(TransactionType.REFUND);
                String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20); // max 20 ký tự
                walletTransaction.setTxnRef(txnRef);
            }
        }
    }
}

