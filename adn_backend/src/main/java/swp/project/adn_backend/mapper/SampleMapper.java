package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.SampleResponse;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Sample;

@Mapper(componentModel = "spring")
public interface SampleMapper {
    Sample toSample(SampleRequest sampleRequest);

    SampleResponse toSampleResponse(Sample sample);
}