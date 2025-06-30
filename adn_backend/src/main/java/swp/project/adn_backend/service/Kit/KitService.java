package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.KitStatusInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.dto.response.kit.KitStatusResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.KitMapper;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.KitRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.List;

@Service
public class KitService {
    private KitRepository kitRepository;
    private KitMapper kitMapper;
    private ServiceTestRepository serviceTestRepository;
    private EntityManager entityManager;
    private UserRepository userRepository;
    private AppointmentRepository appointmentRepository;

    @Autowired
    public KitService(KitRepository kitRepository, KitMapper kitMapper, ServiceTestRepository serviceTestRepository, EntityManager entityManager) {
        this.kitRepository = kitRepository;
        this.kitMapper = kitMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
    }

    public Kit createKit(KitRequest kitRequest) {

        Kit kit = kitMapper.toKit(kitRequest);
        if (kitRepository.existsByKitCode(kitRequest.getKitCode())) {
            throw new AppException(ErrorCodeUser.KIT_EXISTED);
        }
        return kitRepository.save(kit);
    }

    public List<KitInfoDTO> getAllKit() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitInfoDTO(" +
                "s.kitId, s.kitCode, s.kitName, s.targetPersonCount, s.price, s.contents, s.quantity) " +
                "FROM Kit s";

        TypedQuery<KitInfoDTO> query = entityManager.createQuery(jpql, KitInfoDTO.class);
        return query.getResultList();
    }


//    public KitStatusResponse getKitStatusForUser(long appointmentId) {
////        Jwt jwt = (Jwt) authentication.getPrincipal();
////        Long userId = jwt.getClaim("id");
//        Appointment appointment = appointmentRepository.findById(appointmentId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
//
//
//    }
//    @Transactional
//    public void updateStatusByKitId(long kitId, UpdateKitRequest updateKitRequest) {
//        Kit kit = kitRepository.findById(kitId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.KIT_NOT_EXISTS));
//            kit.setKitStatus(updateKitRequest.getKitStatus());
//            kit.setReturnDate(updateKitRequest.getReturnDate());
//    }

}
