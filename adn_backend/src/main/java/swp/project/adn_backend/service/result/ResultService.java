package swp.project.adn_backend.service.result;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.ResultInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.request.HardCopyDeliveryRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static swp.project.adn_backend.service.registerServiceTestService.AppointmentService.generateRandomBankCode;

@Service
public class ResultService {
    private ResultMapper resultMapper;
    private ResultRepository resultRepository;
    private SampleRepository sampleRepository;
    private AppointmentRepository appointmentRepository;
    private PaymentRepository paymentRepository;
    private WalletTransactionRepository walletTransactionRepository;
    private EntityManager entityManager;
    private  UserRepository userRepository;

    @Autowired
    public ResultService(ResultMapper resultMapper, ResultRepository resultRepository, SampleRepository sampleRepository, AppointmentRepository appointmentRepository, PaymentRepository paymentRepository, WalletTransactionRepository walletTransactionRepository, EntityManager entityManager, UserRepository userRepository) {
        this.resultMapper = resultMapper;
        this.resultRepository = resultRepository;
        this.sampleRepository = sampleRepository;
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.entityManager = entityManager;
        this.userRepository = userRepository;
    }

    public ResultResponse createResult(ResultRequest resultRequest,
                                       long sampleId) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Result result = resultMapper.toResult(resultRequest);
        result.setCollectionDate(sample.getCollectionDate());
        result.setResultStatus(ResultStatus.IN_PROGRESS);
        ResultResponse resultResponse = resultMapper.toResultResponse(result);
        return resultResponse;
    }

    //user yeu cau tao bang cung
    @Transactional
    public void requestHardCopyDelivery(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        if (!appointment.getAppointmentStatus().equals(AppointmentStatus.COMPLETED)) {
            throw new RuntimeException("Đơn đăng kí chưa có kết quả");
        }
        Long balance = appointment.getUsers().getWallet().getBalance();
        if (balance == null || balance < 50000) {
            throw new RuntimeException("Số tiền trong tài khoản không đủ");
        }

        if (appointment.getUsers().getWallet().getBalance() < 50000) {
            throw new RuntimeException("Số tiền trong tài khoản không đủ");
        }
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        Result result = appointment.getResults().getFirst();
        result.setHardCopyDeliveryStatus(HardCopyDeliveryStatus.PENDING);
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setWallet(appointment.getUsers().getWallet()); // ✅ bắt buộc
        walletTransaction.setType(TransactionType.PAYMENT);
        walletTransaction.setAmount(50000);
        walletTransaction.setTimestamp(LocalDateTime.now());
        walletTransaction.setBankCode(generateRandomBankCode());
        walletTransaction.setTransactionStatus(TransactionStatus.SUCCESS);
        walletTransaction.setTxnRef(txnRef);
        walletTransactionRepository.save(walletTransaction);

        Wallet wallet = appointment.getUsers().getWallet();
        wallet.setBalance(wallet.getBalance() - 50000);
        wallet.setUpdatedAt(LocalDate.now());
    }
    @Scheduled(cron = "0 0 2 * * *") // chạy mỗi ngày lúc 2h sáng
    @Transactional
    public void autoUpdateDeliveredStatus() {
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(5);

        String jpql = "SELECT r FROM Result r " +
                "WHERE r.hardCopyDeliveryStatus <> :delivered " +
                "AND r.hardCopyDeliveryStatus = :printed " +
                "AND r.hardCopyStatusUpdatedAt <= :fiveDaysAgo";

        List<Result> results = entityManager.createQuery(jpql, Result.class)
                .setParameter("delivered", HardCopyDeliveryStatus.DELIVERED)
                .setParameter("printed", HardCopyDeliveryStatus.PRINTED)
                .setParameter("fiveDaysAgo", fiveDaysAgo)
                .getResultList();

        for (Result r : results) {
            r.setHardCopyDeliveryStatus(HardCopyDeliveryStatus.DELIVERED);
            r.setHardCopyStatusUpdatedAt(LocalDateTime.now());
        }
    }

    @Transactional
    public void updateHardCopyDelivery(long appointmentId, HardCopyDeliveryRequest hardCopyDeliveryRequest) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        Result result = appointment.getResults().getFirst();
        result.setHardCopyDeliveryStatus(hardCopyDeliveryRequest.getHardCopyDeliveryStatus());
    }

    public List<ResultInfoDTO> getHardCopyResultStatus() {

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.ResultInfoDTO(" +
                "s.result_id, s.hardCopyDeliveryStatus, s.appointment.appointmentId) FROM Result s" ;
//                "WHERE s.appointment.appointmentId = :appointmentId";

        TypedQuery<ResultInfoDTO> query = entityManager.createQuery(jpql, ResultInfoDTO.class);
//        query.setParameter("appointmentId", appointmentId);

        return query.getResultList();
    }


}
