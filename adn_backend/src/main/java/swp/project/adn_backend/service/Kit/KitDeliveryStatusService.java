package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.Kit.KitDeliveryStatusRequest;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.dto.response.kit.KitDeliveryStatusResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.KitDeliveryStatus;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.KitDeliveryStatusMapper;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.KitDeliveryStatusRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.List;

@Service
public class KitDeliveryStatusService {
    private KitDeliveryStatusRepository kitDeliveryStatusRepository;
    private UserRepository userRepository;
    private EntityManager entityManager;
    private AppointmentRepository appointmentRepository;
    private KitDeliveryStatusMapper kitDeliveryStatusMapper;

    @Autowired
    public KitDeliveryStatusService(KitDeliveryStatusRepository kitDeliveryStatusRepository, UserRepository userRepository, EntityManager entityManager, AppointmentRepository appointmentRepository, KitDeliveryStatusMapper kitDeliveryStatusMapper) {
        this.kitDeliveryStatusRepository = kitDeliveryStatusRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.appointmentRepository = appointmentRepository;
        this.kitDeliveryStatusMapper = kitDeliveryStatusMapper;
    }

    public List<KitDeliveryStatusInfoDTO> getKitDeliveryStatus(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO(" +
                "s.kitDeliveryStatusId, s.deliveryStatus, s.createOrderDate, s.returnDate) " +
                "FROM KitDeliveryStatus s WHERE s.users.userId = :userId AND " +
                "s.deliveryStatus <> :excludedStatus";

        TypedQuery<KitDeliveryStatusInfoDTO> query = entityManager.createQuery(jpql, KitDeliveryStatusInfoDTO.class);
        query.setParameter("userId", userId);
        query.setParameter("excludedStatus", DeliveryStatus.DONE); // hoặc chuỗi nếu dùng Enum/String

        return query.getResultList();
    }

    @Transactional
    public KitDeliveryStatusResponse updateKitDeliveryStatus(KitDeliveryStatusRequest kitDeliveryStatusRequest,
                                                             long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        KitDeliveryStatus kitDeliveryStatus = appointment.getKitDeliveryStatus();
        if (kitDeliveryStatusRequest.getDeliveryStatus() != null) {
            kitDeliveryStatus.setDeliveryStatus(kitDeliveryStatusRequest.getDeliveryStatus());
        }
        if (kitDeliveryStatusRequest.getReturnDate() != null) {
            kitDeliveryStatus.setReturnDate(kitDeliveryStatusRequest.getReturnDate());
        }
        KitDeliveryStatusResponse kitDeliveryStatusResponse=kitDeliveryStatusMapper.toKitDeliveryStatusResponse(kitDeliveryStatus);
        return kitDeliveryStatusResponse;
    }
}
