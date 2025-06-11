package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.Kit;

@Mapper(componentModel = "spring")
public interface KitMapper {
    Kit toKit(KitRequest kitRequest);
}