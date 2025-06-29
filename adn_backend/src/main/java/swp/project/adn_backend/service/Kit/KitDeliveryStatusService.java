package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoByAppointmentDTO;
import swp.project.adn_backend.dto.request.Kit.KitDeliveryStatusRequest;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.dto.response.kit.KitDeliveryStatusResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.KitDeliveryStatus;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.KitDeliveryStatusMapper;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.KitDeliveryStatusRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.service.slot.StaffAssignmentTracker;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KitDeliveryStatusService {
    private KitDeliveryStatusRepository kitDeliveryStatusRepository;
    private UserRepository userRepository;
    private EntityManager entityManager;
    private AppointmentRepository appointmentRepository;
    private KitDeliveryStatusMapper kitDeliveryStatusMapper;
    private StaffRepository staffRepository;
    private StaffAssignmentTracker staffAssignmentTracker;


    @Autowired
    public KitDeliveryStatusService(KitDeliveryStatusRepository kitDeliveryStatusRepository, UserRepository userRepository, EntityManager entityManager, AppointmentRepository appointmentRepository, KitDeliveryStatusMapper kitDeliveryStatusMapper, StaffRepository staffRepository, StaffAssignmentTracker staffAssignmentTracker) {
        this.kitDeliveryStatusRepository = kitDeliveryStatusRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.appointmentRepository = appointmentRepository;
        this.kitDeliveryStatusMapper = kitDeliveryStatusMapper;
        this.staffRepository = staffRepository;
        this.staffAssignmentTracker = staffAssignmentTracker;
    }

    public List<KitDeliveryStatusInfoDTO> getKitDeliveryStatus(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO(" +
                "s.kitDeliveryStatusId, s.deliveryStatus, s.createOrderDate, s.returnDate) " +
                "FROM KitDeliveryStatus s WHERE s.users.userId = :userId";
//                "s.deliveryStatus <> :excludedStatus";

        TypedQuery<KitDeliveryStatusInfoDTO> query = entityManager.createQuery(jpql, KitDeliveryStatusInfoDTO.class);
        query.setParameter("userId", userId);
//        query.setParameter("excludedStatus", DeliveryStatus.DONE); // hoặc chuỗi nếu dùng Enum/String
        return query.getResultList();
    }

    public List<KitDeliveryStatusInfoByAppointmentDTO> getKitDeliveryStatusByAppointment(long appointmentId) {

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoByAppointmentDTO(" +
                "s.kitDeliveryStatusId, s.deliveryStatus, s.createOrderDate, s.returnDate, s.appointment.appointmentId) " +
                "FROM KitDeliveryStatus s WHERE s.appointment.appointmentId = :appointmentId AND " +
                "s.deliveryStatus <> :excludedStatus";

        TypedQuery<KitDeliveryStatusInfoByAppointmentDTO> query = entityManager.createQuery(jpql, KitDeliveryStatusInfoByAppointmentDTO.class);
        query.setParameter("appointmentId", appointmentId);
        query.setParameter("excludedStatus", DeliveryStatus.DONE); // hoặc chuỗi nếu dùng Enum/String

        return query.getResultList();
    }

    @Transactional
    public KitDeliveryStatusResponse updateKitDeliveryStatus(KitDeliveryStatusRequest kitDeliveryStatusRequest,
                                                             long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        List<Staff> labTechnician = staffRepository.findAll();
        KitDeliveryStatus kitDeliveryStatus = appointment.getKitDeliveryStatus();
        if (kitDeliveryStatusRequest.getDeliveryStatus().equals(DeliveryStatus.DONE)) {
            kitDeliveryStatus.setReturnDate(LocalDate.now());
            // Lọc ra danh sách nhân viên tại nhà còn hoạt động
            List<Staff> labTechnician1 = labTechnician.stream()
                    .filter(staff -> "LAB_TECHNICIAN".equals(staff.getRole()))
                    .collect(Collectors.toList());

            if (labTechnician1.isEmpty()) {
                throw new RuntimeException("Không có nhân viên lab");
            }

            // Chọn nhân viên tiếp theo theo round-robin
            int selectedIndex = staffAssignmentTracker.getNextIndex(labTechnician1.size());
            Staff selectedStaff = labTechnician1.get(selectedIndex);
            appointment.setStaff(selectedStaff);
        }
        if (kitDeliveryStatusRequest.getDeliveryStatus() != null) {
            kitDeliveryStatus.setDeliveryStatus(kitDeliveryStatusRequest.getDeliveryStatus());
        }
        if (kitDeliveryStatusRequest.getReturnDate() != null) {
            kitDeliveryStatus.setReturnDate(kitDeliveryStatusRequest.getReturnDate());
        }
        KitDeliveryStatusResponse kitDeliveryStatusResponse = kitDeliveryStatusMapper.toKitDeliveryStatusResponse(kitDeliveryStatus);
        return kitDeliveryStatusResponse;
    }
}
