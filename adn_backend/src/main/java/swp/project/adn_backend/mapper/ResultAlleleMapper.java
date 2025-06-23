package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.ResultAllele;

@Mapper(componentModel = "spring")
public interface ResultAlleleMapper {
    ResultAllele toResultAllele(ResultAlleleRequest resultAlleleRequest);
    ResultAlleleResponse toResultAlleleResponse(ResultAllele resultAllele);
}