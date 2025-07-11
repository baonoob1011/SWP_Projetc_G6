package swp.project.adn_backend;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.Location.LocationResponse;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.LocationMapper;
import swp.project.adn_backend.repository.LocationRepository;
import swp.project.adn_backend.service.Location.LocationService;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LocationServiceTest {

    @InjectMocks
    private LocationService locationService;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private LocationMapper locationMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        locationService = new LocationService(locationRepository, locationMapper);
    }

    @Test
    void testCreateLocation_success() {
        LocationRequest request = new LocationRequest();
        Location location = new Location();

        when(locationMapper.toLocation(request)).thenReturn(location);
        when(locationRepository.save(location)).thenReturn(location);

        Location result = locationService.createLocation(request);
        assertEquals(location, result);
        verify(locationRepository, times(1)).save(location);
    }

    @Test
    void testGetAllLocation_success() {
        List<Location> locations = List.of(new Location(), new Location());
        List<LocationResponse> responses = List.of(new LocationResponse(), new LocationResponse());

        when(locationRepository.findAll()).thenReturn(locations);
        when(locationMapper.toLocationResponse(locations)).thenReturn(responses);

        List<LocationResponse> result = locationService.getAllLocation();
        assertEquals(2, result.size());
        verify(locationRepository, times(1)).findAll();
        verify(locationMapper, times(1)).toLocationResponse(locations);
    }

    @Test
    void testDeleteLocation_success() {
        Location location = new Location();
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));

        assertDoesNotThrow(() -> locationService.deleteLocation(1L));
        verify(locationRepository, times(1)).delete(location);
    }

    @Test
    void testDeleteLocation_notFound_shouldThrow() {
        when(locationRepository.findById(999L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> locationService.deleteLocation(999L));
        assertEquals(ErrorCodeUser.LOCATION_NOT_EXISTS, ex.getErrorCode());
    }
}
