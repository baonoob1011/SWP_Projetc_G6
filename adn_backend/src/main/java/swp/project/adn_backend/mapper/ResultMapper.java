package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.Result;
import swp.project.adn_backend.entity.ResultLocus;

@Mapper(componentModel = "spring")
public interface ResultMapper {
    Result toResult(ResultRequest resultRequest);

    ResultResponse toResultResponse(Result result);
}