package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.ServiceRequest;
import swp.project.adn_backend.dto.response.serviceResponse.GetAllServiceResponse;
import swp.project.adn_backend.dto.response.serviceResponse.ServiceResponse;
import swp.project.adn_backend.dto.response.serviceResponse.ServiceTestResponse;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.List;


@Mapper(componentModel = "spring")
public interface ServiceTestMapper {
    ServiceTest toServiceTest(ServiceRequest serviceRequest);
    List<ServiceResponse> toServiceList(List<ServiceTest> serviceTests);
//    ServiceTestResponse toServiceResponse(ServiceTest serviceTest);
    ServiceTestResponse toServiceTestResponse(ServiceTest serviceTest);
    GetAllServiceResponse toGetAllServiceTestResponse(ServiceTest serviceTest);
}
