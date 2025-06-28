package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.registerConsultation.RegisterConsultationRequest;
import swp.project.adn_backend.dto.response.registerConsultation.RegisterConsultationResponse;
import swp.project.adn_backend.entity.RegisterForConsultation;

@Mapper(componentModel = "spring")
public interface RegisterConsultationMapper {
    RegisterForConsultation toRegisterConsultationMapper(RegisterConsultationRequest registerConsultationRequest);
    RegisterConsultationResponse toRegisterConsultationResponse(RegisterForConsultation registerForConsultation);
}