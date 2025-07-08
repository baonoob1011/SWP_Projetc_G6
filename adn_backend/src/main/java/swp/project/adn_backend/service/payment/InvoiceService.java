package swp.project.adn_backend.service.payment;


import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.InvoiceUserDTO;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.InvoiceRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class InvoiceService {

    private InvoiceRepository invoiceRepository;
    private UserRepository userRepository;
    private AppointmentRepository appointmentRepository;
    private EntityManager entityManager;

    @Autowired
    public InvoiceService(InvoiceRepository invoiceRepository, UserRepository userRepository, AppointmentRepository appointmentRepository, EntityManager entityManager) {
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.entityManager = entityManager;
    }

    public List<InvoiceUserDTO>getInvoiceOfUser(long appointmentId){
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        System.out.println("appointmentId = " + appointmentId);

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.InvoiceUserDTO(" +
                "i.invoiceId, i.amount, i.createdDate, i.payDate, " +
                "i.bankCode, i.transactionStatus, i.orderInfo) " +
                "FROM Invoice i WHERE i.appointment.appointmentId = :appointmentId";

        TypedQuery<InvoiceUserDTO> query = entityManager.createQuery(jpql, InvoiceUserDTO.class);
        query.setParameter("appointmentId", appointmentId);
        return query.getResultList();
    }

    public Invoice saveInvoice(Invoice invoice) {
        invoice.setBankCode(generateRandomBankCode(6));
        invoice.setCreatedDate(LocalDateTime.now());
        invoice.setTransactionStatus(TransactionStatus.SUCCESS);
        invoice.getAppointment().setNote("Đã thanh toán");
        return invoiceRepository.save(invoice);
    }

    // ✅ Thêm hàm để lấy hóa đơn theo txnRef
    public Optional<Invoice> getInvoiceByTxnRef(String txnRef) {
        return invoiceRepository.findByTxnRef(txnRef);
    }
    public String generateRandomBankCode(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

}

