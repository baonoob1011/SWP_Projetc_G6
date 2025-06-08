package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.entity.Patient;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toPatientRequest(PatientRequest patientRequest);
}
