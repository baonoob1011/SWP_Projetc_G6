package swp.project.adn_backend.service.Location;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.mapper.LocationMapper;
import swp.project.adn_backend.repository.LocationRepository;

@Service
public class LocationService {
    private LocationRepository locationRepository;
    private LocationMapper locationMapper;

    @Autowired
    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public Location createLocation(LocationRequest locationRequest) {
        Location location = locationMapper.toLocation(locationRequest);
        return locationRepository.save(location);
    }
}
