package swp.project.adn_backend.service.Kit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public List<Kit> getAllKit() {
        return kitRepository.findAll();
    }

}
