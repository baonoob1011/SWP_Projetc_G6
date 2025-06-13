package swp.project.adn_backend.service.slot;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.request.slot.*;
//import swp.project.adn_backend.dto.response.SlotReponse;
import swp.project.adn_backend.dto.response.slot.GetFullSlotResponse;
import swp.project.adn_backend.dto.response.slot.RoomSlotResponse;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.dto.response.slot.StaffSlotResponse;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.RoomRepository;
import swp.project.adn_backend.repository.SlotRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotService {
    SlotMapper slotMapper;
    SlotRepository slotRepository;
    UserRepository userRepository;
    StaffRepository staffRepository;
    EntityManager entityManager;
    RoomRepository roomRepository;

    @Autowired
    public SlotService(SlotMapper slotMapper, SlotRepository slotRepository, UserRepository userRepository, StaffRepository staffRepository, EntityManager entityManager, RoomRepository roomRepository) {
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.entityManager = entityManager;
        this.roomRepository = roomRepository;
    }


    //    public Slot createSlot(SlotRequest slotRequest, long roomId, long staffId) {
//        LocalDate slotDate = slotRequest.getSlotDate();
//        //so sánh time trong slot
//        Time startTime = Time.valueOf(slotRequest.getStartTime());
//        Time endTime = Time.valueOf(slotRequest.getEndTime());
//        //so sanh time trong room
//        LocalTime start = startTime.toLocalTime();
//        LocalTime end = endTime.toLocalTime();
//
//        Integer overlapResult = slotRepository.isSlotOverlappingNative(roomId, slotDate, startTime, endTime);
//        boolean isOverlapping = overlapResult != null && overlapResult == 1;
//
//        if (isOverlapping) {
//            throw new AppException(ErrorCodeUser.TIME_EXISTED);
//        }
//
//
//        Room room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));
//
//        Staff staff = staffRepository.findById(staffId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
//
//        if (start.isBefore(room.getOpenTime()) || end.isAfter(room.getCloseTime())) {
//            throw new AppException(ErrorCodeUser.ROOM_TIME_INVALID);
//        }
//
//        Slot slot = new Slot();
//        slot.setSlotDate(slotDate);
//        slot.setStartTime(startTime);
//        slot.setEndTime(endTime);
//        slot.setSlotStatus(SlotStatus.AVAILABLE);
//        room.setRoomStatus(RoomStatus.BOOKED);
//        slot.setRoom(room);
//        slot.setStaff(staff);
//
//        return slotRepository.save(slot);
//    }
    public Slot createSlot(SlotRequest slotRequest, long roomId, long staffId) {
        LocalDate slotDate = slotRequest.getSlotDate();
        Time startTime = Time.valueOf(slotRequest.getStartTime());
        Time endTime = Time.valueOf(slotRequest.getEndTime());

        LocalTime start = startTime.toLocalTime();
        LocalTime end = endTime.toLocalTime();

        Integer overlapResult = slotRepository.isSlotOverlappingNative(roomId, slotDate, startTime, endTime);
        if (overlapResult != null && overlapResult == 1) {
            throw new AppException(ErrorCodeUser.TIME_EXISTED);
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        if (start.isBefore(room.getOpenTime()) || end.isAfter(room.getCloseTime())) {
            throw new AppException(ErrorCodeUser.ROOM_TIME_INVALID);
        }

        Slot slot = new Slot();
        slot.setSlotDate(slotDate);
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setSlotStatus(SlotStatus.AVAILABLE);
        slot.setRoom(room);
        slot.setStaff(staff);

        Slot savedSlot = slotRepository.save(slot);

        // Cập nhật room status ngay sau khi tạo
        LocalDate today = LocalDate.now();
        Time nowTime = Time.valueOf(LocalTime.now());

        List<Slot> upcomingSlots = slotRepository.findUpcomingSlotsNative(roomId, today, nowTime);
        if (upcomingSlots.isEmpty()) {
            room.setRoomStatus(RoomStatus.AVAILABLE);
        } else {
            room.setRoomStatus(RoomStatus.BOOKED);
        }

        roomRepository.save(room);
        return savedSlot;
    }


    public List<SlotInfoDTO> getALlSlotForUser() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO(" +
                "s.slotId, s.slotDate, s.startTime, s.endTime, s.slotStatus) " +
                "FROM Slot s WHERE s.slotDate > CURRENT_DATE And s.slotStatus=:slotStatus";

        TypedQuery<SlotInfoDTO> query = entityManager.createQuery(jpql, SlotInfoDTO.class);
        query.setParameter("slotStatus", SlotStatus.BOOKED);
        return query.getResultList();
    }

    public List<GetFullSlotResponse> getAllSlot() {
        List<GetFullSlotResponse> fullSlotResponses = new ArrayList<>();
        List<Slot> slotList = slotRepository.findAll();
        GetFullSlotResponse getAllServiceResponse = null;
        for (Slot slot : slotList) {
            if(slot.getRoom().getRoomStatus().equals(RoomStatus.BOOKED)){

                SlotResponse slotResponse = slotMapper.toSlotResponse(slot);

                //lay room
                RoomSlotResponse roomSlotResponse = new RoomSlotResponse();
                roomSlotResponse.setRoomId(slot.getRoom().getRoomId());
                roomSlotResponse.setRoomName(slot.getRoom().getRoomName());
                roomSlotResponse.setOpenTime(slot.getRoom().getOpenTime());
                roomSlotResponse.setCloseTime(slot.getRoom().getCloseTime());
                roomSlotResponse.setRoomStatus(slot.getRoom().getRoomStatus());

                //lay staff
                StaffSlotResponse staffSlotResponse = new StaffSlotResponse();
                staffSlotResponse.setStaffId(slot.getStaff().getStaffId());
                staffSlotResponse.setFullName(slot.getStaff().getFullName());


                GetFullSlotResponse getFullSlotResponse = new GetFullSlotResponse();
                getFullSlotResponse.setSlotResponse(slotResponse);
                getFullSlotResponse.setStaffSlotResponse(staffSlotResponse);
                getFullSlotResponse.setRoomSlotResponse(roomSlotResponse);


                //lay full response
                fullSlotResponses.add(getFullSlotResponse);
            }
        }
        return fullSlotResponses;
    }

    public void deleteSlot(long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        slotRepository.delete(slot);
    }

    public List<SlotInfoDTO> getSlotByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");

        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO(" +
                "s.slotId, s.slotDate, s.startTime, s.endTime, s.room, s.slotStatus) " +
                "FROM Slot s WHERE s.staff.staffId = :staffId AND s.slotDate > CURRENT_DATE";

        TypedQuery<SlotInfoDTO> query = entityManager.createQuery(jpql, SlotInfoDTO.class);
        query.setParameter("staffId", staffId);

        return query.getResultList();
    }

}
