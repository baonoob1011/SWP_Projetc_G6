package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.KitDeliveryStatusRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.List;

@Service
public class KitDeliveryStatusService {
    private KitDeliveryStatusRepository kitDeliveryStatusRepository;
    private UserRepository userRepository;
    private EntityManager entityManager;

    @Autowired
    public KitDeliveryStatusService(KitDeliveryStatusRepository kitDeliveryStatusRepository, UserRepository userRepository, EntityManager entityManager) {
        this.kitDeliveryStatusRepository = kitDeliveryStatusRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
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
}
