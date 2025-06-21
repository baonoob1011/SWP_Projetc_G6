package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.serviceRequest.AdministrativeServiceRequest;
import swp.project.adn_backend.dto.response.sample.PatientSampleResponse;
import swp.project.adn_backend.dto.response.sample.StaffSampleResponse;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.Patient;
import swp.project.adn_backend.entity.Staff;

@Mapper(componentModel = "spring")
public interface AllSampleResponseMapper {
    StaffSampleResponse toStaffSampleResponse(Staff staff);
    PatientSampleResponse toPatientSampleResponse(Patient patient);
}