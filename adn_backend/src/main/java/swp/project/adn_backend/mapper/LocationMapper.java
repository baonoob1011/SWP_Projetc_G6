package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.Location.LocationResponse;
import swp.project.adn_backend.entity.Location;

import java.util.List;


@Mapper(componentModel = "spring")
public interface LocationMapper {
    Location toLocation(LocationRequest locationRequest);
    List<LocationResponse> toLocationResponse(List<Location> location);
}