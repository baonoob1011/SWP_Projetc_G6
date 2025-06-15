package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.KitStatusInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.KitMapper;
import swp.project.adn_backend.repository.KitRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.util.List;

@Service
public class KitService {
    private KitRepository kitRepository;
    private KitMapper kitMapper;
    private ServiceTestRepository serviceTestRepository;
    private EntityManager entityManager;

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
        kit.setKitStatus(DeliveryStatus.IN_PROGRESS);
        return kitRepository.save(kit);
    }

    public List<KitInfoDTO> getAllKitForStaff() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitInfoDTO(" +
                "s.kitId, s.kitCode, s.kitName, s.targetPersonCount, s.price, s.contents, s.kitStatus, s.deliveryDate, s.returnDate) " +
                "FROM Kit s";

        TypedQuery<KitInfoDTO> query = entityManager.createQuery(jpql, KitInfoDTO.class);
        return query.getResultList();
    }


    public List<KitStatusInfoDTO> getKitStatusForUser() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitStatusInfoDTO(" +
                "s.kitId, s.kitCode, s.kitName, s.kitStatus, s.deliveryDate, returnDate) " +
                "FROM Kit s";

        TypedQuery<KitStatusInfoDTO> query = entityManager.createQuery(jpql, KitStatusInfoDTO.class);
        return query.getResultList();
    }

    public Kit updateStatusByKitId(long kitId, UpdateKitRequest updateKitRequest) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.KIT_NOT_EXISTS));
        if (updateKitRequest.getKitCode() != null &&
                !updateKitRequest.getKitCode().equals(kit.getKitCode())) {
            kit.setKitCode(updateKitRequest.getKitCode());
        }

        if (updateKitRequest.getKitName() != null &&
                !updateKitRequest.getKitName().equals(kit.getKitName())) {
            kit.setKitName(updateKitRequest.getKitName());
        }

        if (updateKitRequest.getTargetPersonCount() != null &&
                !updateKitRequest.getTargetPersonCount().equals(kit.getTargetPersonCount())) {
            kit.setTargetPersonCount(updateKitRequest.getTargetPersonCount());
        }
        if (updateKitRequest.getPrice() != null &&
                !updateKitRequest.getPrice().equals(kit.getPrice())) {
            kit.setPrice(updateKitRequest.getPrice());
        }

        if (updateKitRequest.getContents() != null &&
                !updateKitRequest.getContents().equals(kit.getContents())) {
            kit.setContents(updateKitRequest.getContents());
        }

        if (updateKitRequest.getKitStatus() != null &&
                !updateKitRequest.getKitStatus().equals(kit.getKitStatus())) {
            kit.setKitStatus(updateKitRequest.getKitStatus());
        }

        if (updateKitRequest.getDeliveryDate() != null &&
                !updateKitRequest.getDeliveryDate().equals(kit.getDeliveryDate())) {
            kit.setDeliveryDate(updateKitRequest.getDeliveryDate());
        }

        if (updateKitRequest.getReturnDate() != null &&
                !updateKitRequest.getReturnDate().equals(kit.getReturnDate())) {
            kit.setReturnDate(updateKitRequest.getReturnDate());
        }

        return kitRepository.save(kit);
    }

}
