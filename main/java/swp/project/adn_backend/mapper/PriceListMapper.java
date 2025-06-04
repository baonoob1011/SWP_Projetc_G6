package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.PriceListRequest;
import swp.project.adn_backend.dto.request.ServiceRequest;
import swp.project.adn_backend.entity.PriceList;
import swp.project.adn_backend.entity.ServiceTest;

@Mapper(componentModel = "spring")
public interface PriceListMapper {
    PriceList toPriceList(PriceListRequest priceListRequest);
}