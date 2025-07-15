package swp.project.adn_backend;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO;
import swp.project.adn_backend.dto.request.slot.RoomRequest;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.RoomMapper;
import swp.project.adn_backend.repository.LocationRepository;
import swp.project.adn_backend.repository.RoomRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import swp.project.adn_backend.service.slot.RoomService;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoomServiceTest {

    @InjectMocks
    private RoomService roomService;

    @Mock
    private RoomRepository roomRepository;
    @Mock
    private RoomMapper roomMapper;
    @Mock
    private EntityManager entityManager;
    @Mock
    private LocationRepository locationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        roomService = new RoomService(roomRepository, roomMapper, entityManager, locationRepository);
    }

    @Test
    void testCreateRoom_success() {
        RoomRequest request = new RoomRequest();
        Location location = new Location();
        Room room = new Room();

        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(roomMapper.toRoom(request)).thenReturn(room);
        when(roomRepository.save(room)).thenReturn(room);

        Room result = roomService.createRoom(request, 1L);
        assertEquals(RoomStatus.AVAILABLE, result.getRoomStatus());
        verify(roomRepository).save(room);
    }

    @Test
    void testCreateRoom_locationNotFound_shouldThrow() {
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());
        RoomRequest request = new RoomRequest();

        AppException ex = assertThrows(AppException.class, () -> roomService.createRoom(request, 1L));
        assertEquals(ErrorCodeUser.LOCATION_NOT_EXISTS, ex.getErrorCode());
    }

//    @Test
//    void testGetAllRoom_success() {
//        TypedQuery<RoomInfoDTO> mockQuery = mock(TypedQuery.class);
//        when(entityManager.createQuery(anyString(), eq(RoomInfoDTO.class))).thenReturn(mockQuery);
//        when(mockQuery.setParameter(eq("roomStatus"), eq(RoomStatus.AVAILABLE))).thenReturn(mockQuery);
//        when(mockQuery.getResultList()).thenReturn(List.of(new RoomInfoDTO()));
//
//        List<RoomInfoDTO> results = roomService.getAllRoom();
//        assertEquals(1, results.size());
//    }

    @Test
    void testGetAllRoomActive_success() {
        TypedQuery<RoomInfoDTO> mockQuery = mock(TypedQuery.class);
        when(entityManager.createQuery(anyString(), eq(RoomInfoDTO.class))).thenReturn(mockQuery);
        when(mockQuery.setParameter(eq("roomStatus"), eq(RoomStatus.ACTIVE))).thenReturn(mockQuery);
        when(mockQuery.getResultList()).thenReturn(List.of(new RoomInfoDTO()));

        List<RoomInfoDTO> results = roomService.getAllRoomActive();
        assertEquals(1, results.size());
    }

    @Test
    void testUpdateRoom_success() {
        Room room = new Room();
        room.setRoomId(1L);
        room.setRoomName("Old Name");

        RoomRequest request = new RoomRequest();
        request.setRoomName("New Room");
        request.setOpenTime(LocalTime.of(8, 0));
        request.setCloseTime(LocalTime.of(17, 0));

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(roomRepository.isRoomTimeOverlapping(eq(1L), any(), any())).thenReturn(0);
        when(roomRepository.save(room)).thenReturn(room);

        Room updatedRoom = roomService.updateRoom(1L, request);

        assertEquals("New Room", updatedRoom.getRoomName());
    }

    @Test
    void testUpdateRoom_overlap_shouldThrow() {
        Room room = new Room();
        RoomRequest request = new RoomRequest();
        request.setOpenTime(LocalTime.of(8, 0));
        request.setCloseTime(LocalTime.of(17, 0));

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(roomRepository.isRoomTimeOverlapping(anyLong(), any(), any())).thenReturn(1);

        AppException ex = assertThrows(AppException.class, () -> roomService.updateRoom(1L, request));
        assertEquals(ErrorCodeUser.ROOM_TIME_OVERLAP, ex.getErrorCode());
    }

    @Test
    void testDeleteRoom_success() {
        Room room = new Room();
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        assertDoesNotThrow(() -> roomService.deleteRoom(1L));
        verify(roomRepository).delete(room);
    }

    @Test
    void testDeleteRoom_notFound_shouldThrow() {
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> roomService.deleteRoom(1L));
        assertEquals(ErrorCodeUser.ROOM_NOT_FOUND, ex.getErrorCode());
    }
}
