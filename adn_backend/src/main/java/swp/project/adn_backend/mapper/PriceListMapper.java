package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.serviceRequest.PriceListRequest;
import swp.project.adn_backend.dto.response.serviceResponse.PriceListResponse;
import swp.project.adn_backend.entity.PriceList;

@Mapper(componentModel = "spring")
public interface PriceListMapper {
    PriceList toPriceList(PriceListRequest priceListRequest);
    PriceListResponse toPriceListResponse(PriceList priceList);
}