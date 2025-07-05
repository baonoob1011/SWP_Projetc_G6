package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.ResultAllele;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResultAlleleMapper {
    ResultAllele toResultAllele(ResultAlleleRequest resultAlleleRequest);
    ResultAlleleResponse toResultAlleleResponse(ResultAllele resultAllele);
    List<ResultAlleleResponse> toResultAlleleResponses(List<ResultAllele> resultAllele);
}