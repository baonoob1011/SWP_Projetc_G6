package swp.project.adn_backend.service.Location;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.LocationInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.Location.LocationResponse;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.LocationMapper;
import swp.project.adn_backend.repository.LocationRepository;

import java.util.List;

@Service
public class LocationService {
    private LocationRepository locationRepository;
    private LocationMapper locationMapper;
    private EntityManager entityManager;

    @Autowired
    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper, EntityManager entityManager) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
        this.entityManager = entityManager;
    }



    public Location createLocation(LocationRequest locationRequest) {
        Location location = locationMapper.toLocation(locationRequest);
        return locationRepository.save(location);
    }

    public List<LocationResponse> getAllLocation() {
        List<Location> locationList = locationRepository.findAll();
        List<LocationResponse> locationResponses = locationMapper.toLocationResponse(locationList);
        return locationResponses;

    }
//

    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCATION_NOT_EXISTS));
        locationRepository.delete(location);
    }
}
