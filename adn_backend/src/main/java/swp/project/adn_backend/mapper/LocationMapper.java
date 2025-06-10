package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.serviceRequest.FeedbackRequest;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.Location;


@Mapper(componentModel = "spring")
public interface LocationMapper {
    Location toLocation(LocationRequest locationRequest);
}