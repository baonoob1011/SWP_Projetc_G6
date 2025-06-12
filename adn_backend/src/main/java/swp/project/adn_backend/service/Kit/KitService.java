package swp.project.adn_backend.service.Kit;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.ServiceTest;
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
    public KitService(KitRepository kitRepository, KitMapper kitMapper, ServiceTestRepository serviceTestRepository) {
        this.kitRepository = kitRepository;
        this.kitMapper = kitMapper;
        this.serviceTestRepository = serviceTestRepository;
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
                "s.kitCode, s.kitName, s.targetPersonCount, s.price, contents) " +
                "FROM Kit s";

        TypedQuery<KitInfoDTO> query = entityManager.createQuery(jpql, KitInfoDTO.class);
        return query.getResultList();
    }

    public List<KitInfoDTO> viewKitStatus() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.KitInfoDTO(" +
                "s.kitCode, s.kitName, s.kitStatus, s.delivery_date, return_date) " +
                "FROM Kit s";

        TypedQuery<KitInfoDTO> query = entityManager.createQuery(jpql, KitInfoDTO.class);
        return query.getResultList();
    }


}
