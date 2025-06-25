package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.discount.DiscountRequest;
import swp.project.adn_backend.dto.response.discount.DiscountResponse;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.Discount;

@Mapper(componentModel = "spring")
public interface DiscountMapper {
    Discount toDiscount(DiscountRequest discountRequest);
    DiscountResponse toDiscountResponse(Discount discount);
}