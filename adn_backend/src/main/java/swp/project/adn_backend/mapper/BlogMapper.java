package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Blogs.BlogRequest;
import swp.project.adn_backend.dto.request.serviceRequest.CivilServiceRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.CivilService;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    Blog toBlog(BlogRequest blogRequest);
}