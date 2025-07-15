package swp.project.adn_backend.controller.Location;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.LocationInfoDTO;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.Location.LocationResponse;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.service.Location.LocationService;

import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @PostMapping("/create-location")
    public ResponseEntity<Location> creteLocation(@RequestBody @Valid LocationRequest locationRequest) {
        return ResponseEntity.ok(locationService.createLocation(locationRequest));
    }

    @GetMapping("/get-all-location")
    public ResponseEntity<List<LocationResponse>> getAllLocation() {
        return ResponseEntity.ok(locationService.getAllLocation());
    }


    @DeleteMapping("/delete-location/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok("Xóa location với id=" + id + " thành công");
    }
}
