package swp.project.adn_backend.controller.Location;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.service.Location.LocationService;

@RestController
@RequestMapping("/api/location")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @PostMapping("/create-location")
    public ResponseEntity<Location> creteLocation(LocationRequest locationRequest) {
        return ResponseEntity.ok(locationService.createLocation(locationRequest));
    }
}
