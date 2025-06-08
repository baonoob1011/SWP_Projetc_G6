package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.serviceRequest.AddPriceListRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.PriceList;

@Mapper(componentModel = "spring")
public interface AddPriceListMapper {
    PriceList toAddPriceList(AddPriceListRequest addPriceListRequest);
}