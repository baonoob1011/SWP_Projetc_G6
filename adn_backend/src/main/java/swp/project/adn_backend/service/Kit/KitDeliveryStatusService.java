package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoByAppointmentDTO;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoStaffDTO;
import swp.project.adn_backend.dto.request.Kit.KitDeliveryStatusRequest;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.dto.response.kit.KitDeliveryStatusResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.KitDeliveryStatus;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.AppointmentStatus;
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
                "FROM KitDeliveryStatus s WHERE s.users.userId = :userId " +
                "And s.deliveryStatus <> :excludedStatus";

        TypedQuery<KitDeliveryStatusInfoDTO> query = entityManager.createQuery(jpql, KitDeliveryStatusInfoDTO.class);
        query.setParameter("userId", userId);
        query.setParameter("excludedStatus", DeliveryStatus.COMPLETED);
        return query.getResultList();
    }

    // lấy appointment at home theo staff at home
    public List<KitDeliveryStatusInfoStaffDTO> getKitDeliveryStatusStaff(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if(!staff.getRole().equals("STAFF_AT_HOME")){
            throw new RuntimeException("Chỉ có nhân viên thu mẫu tại nhà mới có thể lấy");
        }
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoStaffDTO(" +
                "s.kitDeliveryStatusId, s.deliveryStatus, s.createOrderDate, s.returnDate, s.appointment.appointmentId, s.appointment.appointmentType, s.appointment.appointmentStatus) " +
                "FROM KitDeliveryStatus s WHERE s.staff.staffId = :staffId";
//                "s.deliveryStatus <> :excludedStatus";

        TypedQuery<KitDeliveryStatusInfoStaffDTO> query = entityManager.createQuery(jpql, KitDeliveryStatusInfoStaffDTO.class);
        query.setParameter("staffId", userId);
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

        List<Staff> labTechnicians = staffRepository.findAll();

        KitDeliveryStatus kitDeliveryStatus = appointment.getKitDeliveryStatus();
        DeliveryStatus newStatus = kitDeliveryStatusRequest.getDeliveryStatus();
        DeliveryStatus currentStatus = kitDeliveryStatus.getDeliveryStatus();

        // Kiểm tra không cho phép cập nhật lùi trạng thái (ngoại trừ FAILED)
        if (newStatus != null && currentStatus != null
                && newStatus != DeliveryStatus.FAILED
                && newStatus.ordinal() < currentStatus.ordinal()) {
            throw new RuntimeException("Không thể cập nhật trạng thái lùi về bước trước đó.");
        }

        // Xử lý nếu trạng thái mới là DONE
        if (newStatus == DeliveryStatus.DONE) {
            kitDeliveryStatus.setReturnDate(LocalDate.now());
            appointment.setNote("Đã nhận lại bộ kit");
        }

        // Cập nhật ghi chú theo trạng thái
        if (newStatus != null) {
            switch (newStatus) {
                case PENDING -> appointment.setNote("Đang chờ giao bộ kit");
                case IN_PROGRESS -> appointment.setNote("Đang giao bộ kit");
                case DELIVERED -> appointment.setNote("Đã giao bộ kit thành công");
                case FAILED ->{
                    appointment.setNote("Khách hàng không nhận hàng");
                    appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
                }
                default -> { } // DONE đã xử lý ở trên
            }

            kitDeliveryStatus.setDeliveryStatus(newStatus);
        }

        if (kitDeliveryStatusRequest.getReturnDate() != null) {
            kitDeliveryStatus.setReturnDate(kitDeliveryStatusRequest.getReturnDate());
        }

        return kitDeliveryStatusMapper.toKitDeliveryStatusResponse(kitDeliveryStatus);
    }

}
