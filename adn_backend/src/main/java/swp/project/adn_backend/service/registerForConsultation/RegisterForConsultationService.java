package swp.project.adn_backend.service.registerForConsultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.registerConsultation.RegisterConsultationRequest;
import swp.project.adn_backend.dto.response.registerConsultation.RegisterConsultationResponse;
import swp.project.adn_backend.entity.RegisterForConsultation;
import swp.project.adn_backend.mapper.RegisterConsultationMapper;
import swp.project.adn_backend.repository.RegisterForConsultationRepository;

@Service
public class RegisterForConsultationService {
    private RegisterConsultationMapper registerConsultationMapper;
    private RegisterForConsultationRepository registerForConsultationRepository;

    @Autowired
    public RegisterForConsultationService(RegisterConsultationMapper registerConsultationMapper, RegisterForConsultationRepository registerForConsultationRepository) {
        this.registerConsultationMapper = registerConsultationMapper;
        this.registerForConsultationRepository = registerForConsultationRepository;
    }

    public RegisterConsultationResponse createConsultation(RegisterConsultationRequest registerConsultationRequest) {
        RegisterForConsultation registerForConsultation = registerConsultationMapper.toRegisterConsultationMapper(registerConsultationRequest);
        registerForConsultationRepository.save(registerForConsultation);
        RegisterConsultationResponse registerConsultationResponse = registerConsultationMapper.toRegisterConsultationResponse(registerForConsultation);
        return registerConsultationResponse;
    }
}
