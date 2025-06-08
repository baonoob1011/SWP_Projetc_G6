package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.entity.Blog;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    Blog toBlog(BlogRequest blogRequest);
}