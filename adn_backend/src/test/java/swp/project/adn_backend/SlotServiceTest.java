package swp.project.adn_backend;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.request.slot.StaffSlotRequest;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.slot.SlotService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SlotServiceTest {

    @InjectMocks
    private SlotService slotService;

    @Mock
    private SlotMapper slotMapper;
    @Mock
    private SlotRepository slotRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private StaffRepository staffRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private LocationRepository locationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        slotService = new SlotService(slotMapper, slotRepository, userRepository,
                staffRepository, null, roomRepository, notificationRepository, locationRepository);
    }

    @Test
    void testAddMoreStaffToSlot_success() {
        long slotId = 1L;
        long staffId = 2L;

        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setStaff(new ArrayList<>());

        Staff staff = new Staff();
        staff.setStaffId(staffId);

        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(staffRepository.findById(staffId)).thenReturn(Optional.of(staff));

        slotService.addMoreStaffToSlot(slotId, staffId);

        assertTrue(slot.getStaff().contains(staff));
    }

    @Test
    void testAddMoreStaffToSlot_alreadyInSlot_shouldThrow() {
        long slotId = 1L;
        long staffId = 2L;

        Staff staff = new Staff();
        staff.setStaffId(staffId);

        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setStaff(new ArrayList<>(List.of(staff)));

        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(staffRepository.findById(staffId)).thenReturn(Optional.of(staff));

        assertThrows(RuntimeException.class, () -> {
            slotService.addMoreStaffToSlot(slotId, staffId);
        });
    }

    @Test
    void testDeleteSlot_success() {
        long slotId = 1L;
        Slot slot = new Slot();
        slot.setSlotId(slotId);

        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));

        slotService.deleteSlot(slotId);

        verify(slotRepository).delete(slot);
    }

    @Test
    void testUpdateSlot_success() {
        long slotId = 1L;

        Slot slot = new Slot();
        slot.setSlotId(slotId);

        SlotRequest request = new SlotRequest();
        request.setSlotDate(LocalDate.of(2025, 1, 1));
        request.setStartTime(LocalTime.of(8, 0));
        request.setEndTime(LocalTime.of(10, 0));

        SlotResponse expectedResponse = new SlotResponse();

        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(slotMapper.toSlotResponse(slot)).thenReturn(expectedResponse);

        SlotResponse result = slotService.updateSlot(request, slotId);

        assertEquals(expectedResponse, result);
    }

    @Test
    void testUpdateStaffToSlot_success() {
        long staffId1 = 1L;
        long staffId2 = 2L;
        long slotId = 10L;

        Staff staff1 = new Staff();
        staff1.setStaffId(staffId1);
        staff1.setRole("STAFF");

        Staff staff2 = new Staff();
        staff2.setStaffId(staffId2);
        staff2.setRole("STAFF");

        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setStaff(new ArrayList<>(List.of(staff1)));

        when(staffRepository.findById(staffId1)).thenReturn(Optional.of(staff1));
        when(staffRepository.findById(staffId2)).thenReturn(Optional.of(staff2));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));

        slotService.updateStaffToSlot(staffId1, staffId2, slotId);

        assertTrue(slot.getStaff().contains(staff2));
        assertFalse(slot.getStaff().contains(staff1));
    }

    @Test
    void testUpdateStaffToSlot_differentRole_shouldThrow() {
        long staffId1 = 1L;
        long staffId2 = 2L;
        long slotId = 10L;

        Staff staff1 = new Staff();
        staff1.setStaffId(staffId1);
        staff1.setRole("STAFF");

        Staff staff2 = new Staff();
        staff2.setStaffId(staffId2);
        staff2.setRole("ADMIN");

        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setStaff(new ArrayList<>(List.of(staff1)));

        when(staffRepository.findById(staffId1)).thenReturn(Optional.of(staff1));
        when(staffRepository.findById(staffId2)).thenReturn(Optional.of(staff2));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));

        assertThrows(RuntimeException.class, () -> {
            slotService.updateStaffToSlot(staffId1, staffId2, slotId);
        });
    }
}
