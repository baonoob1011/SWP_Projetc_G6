package swp.project.adn_backend.service.registerForConsultation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.ConsultantInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.request.registerConsultation.RegisterConsultationRequest;
import swp.project.adn_backend.dto.response.registerConsultation.RegisterConsultationResponse;
import swp.project.adn_backend.entity.RegisterForConsultation;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ConsultationStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.RegisterConsultationMapper;
import swp.project.adn_backend.repository.RegisterForConsultationRepository;

import java.util.List;

@Service
public class RegisterForConsultationService {
    private RegisterConsultationMapper registerConsultationMapper;
    private RegisterForConsultationRepository registerForConsultationRepository;
    private EntityManager entityManager;

    @Autowired
    public RegisterForConsultationService(RegisterConsultationMapper registerConsultationMapper, RegisterForConsultationRepository registerForConsultationRepository, EntityManager entityManager) {
        this.registerConsultationMapper = registerConsultationMapper;
        this.registerForConsultationRepository = registerForConsultationRepository;
        this.entityManager = entityManager;
    }

    public RegisterConsultationResponse createConsultation(RegisterConsultationRequest registerConsultationRequest) {
        RegisterForConsultation registerForConsultation = registerConsultationMapper.toRegisterConsultationMapper(registerConsultationRequest);
        registerForConsultation.setConsultationStatus(ConsultationStatus.CONFIRMED);
        registerForConsultationRepository.save(registerForConsultation);
        RegisterConsultationResponse registerConsultationResponse = registerConsultationMapper.toRegisterConsultationResponse(registerForConsultation);
        return registerConsultationResponse;
    }

    public List<ConsultantInfoDTO> getAllConsultant() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.ConsultantInfoDTO(" +
                "s.registerForConsultationId, s.name, s.phone, s.consultationStatus) FROM RegisterForConsultation s " +
                "Where s.consultationStatus=:consultationStatus";
        TypedQuery<ConsultantInfoDTO> query = entityManager.createQuery(jpql, ConsultantInfoDTO.class);
        query.setParameter("consultationStatus", ConsultationStatus.CONFIRMED);
        return query.getResultList();
    }

    @Transactional
    public void updateConsultantStatus(long registerForConsultationId,
                                       RegisterConsultationRequest registerConsultationRequest) {
        RegisterForConsultation registerForConsultation = registerForConsultationRepository.findById(registerForConsultationId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.CONSULTANT_REGISTER_NOT_EXISTED));
        registerForConsultation.setConsultationStatus(registerConsultationRequest.getConsultationStatus());
    }
}
