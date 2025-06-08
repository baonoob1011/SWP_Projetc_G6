package swp.project.adn_backend.service.registerForConsultation;

import org.springframework.stereotype.Service;
import swp.project.adn_backend.mapper.RegisterConsultationMapper;
import swp.project.adn_backend.repository.RegisterForConsultationRepository;

@Service
public class RegisterForConsultationService {
    private RegisterConsultationMapper registerConsultationMapper;
    private RegisterForConsultationRepository registerForConsultationRepository;
}
