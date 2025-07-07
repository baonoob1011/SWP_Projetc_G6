package swp.project.adn_backend.service.notification;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.NotificationResponse;
import swp.project.adn_backend.dto.InfoDTO.UserResponse;
import swp.project.adn_backend.entity.Notification;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.NotificationRepository;
import swp.project.adn_backend.repository.StaffRepository;

@Service
public class NotificationService {
    private NotificationRepository notificationRepository;
    private EntityManager entityManager;
    private StaffRepository staffRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, EntityManager entityManager, StaffRepository staffRepository) {
        this.notificationRepository = notificationRepository;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
    }

    public NotificationResponse getNotification(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.NotificationResponse(" +
                "s.notificationId, s.numOfNotification, s.note) FROM Notification s " +
                "Where s.staff.staffId=:staffId";
        TypedQuery<NotificationResponse> query = entityManager.createQuery(jpql, NotificationResponse.class);
        query.setParameter("staffId", staffId);
        return query.getSingleResult();
    }
}
