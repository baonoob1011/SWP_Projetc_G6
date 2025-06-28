package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateServiceTestRequest;
import swp.project.adn_backend.dto.response.discount.DiscountResponse;
import swp.project.adn_backend.dto.response.serviceResponse.GetAllServiceResponse;
import swp.project.adn_backend.dto.response.serviceResponse.ServiceResponse;
import swp.project.adn_backend.dto.response.serviceResponse.ServiceTestResponse;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.List;


@Mapper(componentModel = "spring")
public interface ServiceTestMapper {
    ServiceTest toServiceTest(ServiceRequest serviceRequest);
    ServiceTest toUpdateServiceTest(UpdateServiceTestRequest updateServiceTest);
    List<ServiceResponse> toServiceList(List<ServiceTest> serviceTests);
//    ServiceTestResponse toServiceResponse(ServiceTest serviceTest);
    ServiceTestResponse toServiceTestResponse(ServiceTest serviceTest);
    GetAllServiceResponse toGetAllServiceTestResponse(ServiceTest serviceTest);
    // Method cập nhật entity đã có từ DTO (update)
    List<DiscountResponse> toDiscountResponses(List<Discount> discountList);
    void updateServiceTestFromDto(UpdateServiceTestRequest dto, @MappingTarget ServiceTest entity);
}
