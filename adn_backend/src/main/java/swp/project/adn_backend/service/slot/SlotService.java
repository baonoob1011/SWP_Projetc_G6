package swp.project.adn_backend.service.slot;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.slot.StaffSlotRequest;
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
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.RoomRepository;
import swp.project.adn_backend.repository.SlotRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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


//    public Slot createSlot(SlotRequest slotRequest, long roomId, long staffId) {
//        LocalDate slotDate = slotRequest.getSlotDate();
//
//        Integer overlapResult = slotRepository.isSlotOverlappingNative(roomId, slotDate, slotRequest.getStartTime(), slotRequest.getEndTime());
//        if (overlapResult != null && overlapResult == 1) {
//            throw new AppException(ErrorCodeUser.TIME_EXISTED);
//        }
//
//        Room room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));
//        Staff staff = staffRepository.findById(staffId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
//        // ✅ Kiểm tra thời gian slot có nằm trong khoảng hoạt động của phòng không
//
//        if (slotRequest.getStartTime().isBefore(room.getOpenTime()) || slotRequest.getEndTime().isAfter(room.getCloseTime())) {
//            throw new AppException(ErrorCodeUser.SLOT_OUTSIDE_ROOM_TIME);
//        }
//        Slot slot = new Slot();
//        slot.setSlotDate(slotDate);
//        slot.setStartTime(slotRequest.getStartTime());
//        slot.setEndTime(slotRequest.getEndTime());
//        slot.setSlotStatus(SlotStatus.AVAILABLE);
//        slot.setRoom(room);

    ////        slot.setStaff(staff);
//        Slot savedSlot = slotRepository.save(slot);
//
//        roomRepository.save(room);
//        return savedSlot;
//    }
    public List<SlotResponse> createSlot(SlotRequest slotRequest, long roomId, List<StaffSlotRequest> staffSlotRequests) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));

        List<Slot> createdSlots = new ArrayList<>();
        LocalDate currentDate = slotRequest.getSlotDate();
        LocalDate endDate = currentDate.plusDays(29); // 30 ngày bao gồm ngày bắt đầu

        while (!currentDate.isAfter(endDate)) {
            DayOfWeek day = currentDate.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // Kiểm tra trùng slot trong cùng room
            Integer roomOverlap = slotRepository.isSlotOverlappingNative(
                    roomId, currentDate, slotRequest.getStartTime(), slotRequest.getEndTime());
            if (roomOverlap != null && roomOverlap == 1) {
                System.out.println("⚠️ Slot bị trùng trong phòng ngày " + currentDate + ", bỏ qua.");
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // Kiểm tra giờ hoạt động của phòng
            if (slotRequest.getStartTime().isBefore(room.getOpenTime()) ||
                    slotRequest.getEndTime().isAfter(room.getCloseTime())) {
                System.out.println("❌ Slot ngoài giờ hoạt động ngày " + currentDate + ", bỏ qua.");
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // Danh sách nhân viên hợp lệ
            List<Staff> staffList = new ArrayList<>();
            boolean conflictFound = false;

            for (StaffSlotRequest staffSlotRequest : staffSlotRequests) {
                Staff staff = staffRepository.findById(staffSlotRequest.getStaffId())
                        .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

                Integer staffOverlap = slotRepository.isStaffOverlappingSlot(
                        staff.getStaffId(), currentDate, slotRequest.getStartTime(), slotRequest.getEndTime());
                if (staffOverlap != null && staffOverlap > 0) {
                    System.out.println("⛔ Staff " + staff.getStaffId() + " đã có lịch ngày " + currentDate + ", bỏ qua slot.");
                    conflictFound = true;
                    break; // Không tạo slot nếu có bất kỳ nhân viên nào bị trùng
                }

                staffList.add(staff);
            }

            if (conflictFound) {
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // Tạo slot mới
            Slot slot = slotMapper.toSlot(slotRequest);
            slot.setSlotStatus(SlotStatus.AVAILABLE);
            slot.setSlotDate(currentDate);
            slot.setRoom(room);
            slot.setStaff(staffList); // Danh sách staff

            createdSlots.add(slotRepository.save(slot));
            currentDate = currentDate.plusDays(1);
        }

        return slotMapper.toSlotResponses(createdSlots);
    }


//    @Scheduled(cron = "0 0 0 * * MON") // chạy mỗi Thứ Hai lúc 00:00
//    @Transactional
//    public void autoCreateSlotsForNextWeek() {
//        LocalDate today = LocalDate.now();
//        List<Slot> todaySlots = slotRepository.findAllBySlotDate(today);
//
//        if (todaySlots.isEmpty()) {
//            System.out.println("❌ Không có slot nào hôm nay để nhân bản.");
//            return;
//        }
//
//        for (int i = 1; i <= 6; i++) { // 6 ngày tiếp theo (Thứ Ba → Chủ Nhật)
//            LocalDate nextDate = today.plusDays(i);
//            for (Slot slot : todaySlots) {
//                if (slot.getSlotStatus() == SlotStatus.CANCELLED) continue;
//
//                Slot newSlot = new Slot();
//                newSlot.setSlotDate(nextDate);
//                newSlot.setStartTime(slot.getStartTime());
//                newSlot.setEndTime(slot.getEndTime());
//                newSlot.setSlotStatus(SlotStatus.AVAILABLE);
//                newSlot.setRoom(slot.getRoom());
//                newSlot.setStaff(slot.getStaff());
//
//                slotRepository.save(newSlot);
//            }
//            System.out.println("✅ Slot đã được tạo cho ngày " + nextDate);
//        }
//    }


    public List<SlotInfoDTO> getAllUpcomingSlotsForUser() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO(" +
                "s.slotId, s.slotDate, s.startTime, s.endTime, s.slotStatus) " +
                "FROM Slot s " +
                "WHERE s.slotStatus = :slotStatus " +
                "AND s.slotDate >= CURRENT_DATE";

        TypedQuery<SlotInfoDTO> query = entityManager.createQuery(jpql, SlotInfoDTO.class);
        query.setParameter("slotStatus", SlotStatus.AVAILABLE);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<SlotInfoDTO> result;
        try {
            result = query.getResultList().stream()
                    .filter(slot -> {
                        if (slot.getSlotDate().isEqual(today)) {
                            return slot.getEndTime().isAfter(now);
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        } catch (UnsupportedOperationException e) {
            System.out.println("🔥 Immutable result list detected - wrapping in ArrayList");
            e.printStackTrace();
            result = new ArrayList<>(query.getResultList()); // fallback without filtering
        }

        return new ArrayList<>(result);
    }


    public List<GetFullSlotResponse> getAllSlot() {
        List<GetFullSlotResponse> fullSlotResponses = new ArrayList<>();
        List<Slot> slotList = slotRepository.findAll();
        GetFullSlotResponse getAllServiceResponse = null;
        for (Slot slot : slotList) {
            if (slot.getSlotStatus().equals(SlotStatus.AVAILABLE)) {

                SlotResponse slotResponse = slotMapper.toSlotResponse(slot);

                //lay room
                RoomSlotResponse roomSlotResponse = new RoomSlotResponse();
                roomSlotResponse.setRoomId(slot.getRoom().getRoomId());
                roomSlotResponse.setRoomName(slot.getRoom().getRoomName());
                roomSlotResponse.setOpenTime(slot.getRoom().getOpenTime());
                roomSlotResponse.setCloseTime(slot.getRoom().getCloseTime());

//                //lay staff
//                StaffSlotResponse staffSlotResponse = new StaffSlotResponse();
//                staffSlotResponse.setStaffId(slot.getStaff().getFirst().getStaffId());
//                staffSlotResponse.setFullName(slot.getStaff().getFirst().getFullName());

                List<StaffSlotResponse> staffSlotResponses = new ArrayList<>();
                for (Staff staff : slot.getStaff()) {
                    StaffSlotResponse staffSlotResponse = new StaffSlotResponse();
                    staffSlotResponse.setStaffId(staff.getStaffId());
                    staffSlotResponse.setFullName(staff.getFullName());
                    staffSlotResponses.add(staffSlotResponse);
                }
                GetFullSlotResponse getFullSlotResponse = new GetFullSlotResponse();
                getFullSlotResponse.setSlotResponse(slotResponse);
                getFullSlotResponse.setStaffSlotResponses(staffSlotResponses);
                getFullSlotResponse.setRoomSlotResponse(roomSlotResponse);


                //lay full response
                fullSlotResponses.add(getFullSlotResponse);

            }
        }
        return fullSlotResponses;
    }

    public List<GetFullSlotResponse> getAllSlotOfStaff(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        List<GetFullSlotResponse> fullSlotResponses = new ArrayList<>();
        List<Slot> slotList = staff.getSlots();
        GetFullSlotResponse getAllServiceResponse = null;
        for (Slot slot : slotList) {
//            if (slot.getSlotStatus().equals(SlotStatus.BOOKED)) {
                SlotResponse slotResponse = slotMapper.toSlotResponse(slot);

                //lay room
                RoomSlotResponse roomSlotResponse = new RoomSlotResponse();
                roomSlotResponse.setRoomId(slot.getRoom().getRoomId());
                roomSlotResponse.setRoomName(slot.getRoom().getRoomName());
                roomSlotResponse.setOpenTime(slot.getRoom().getOpenTime());
                roomSlotResponse.setCloseTime(slot.getRoom().getCloseTime());


                GetFullSlotResponse getFullSlotResponse = new GetFullSlotResponse();
                getFullSlotResponse.setSlotResponse(slotResponse);
                getFullSlotResponse.setRoomSlotResponse(roomSlotResponse);


                //lay full response
                fullSlotResponses.add(getFullSlotResponse);


//            }
        }
        return fullSlotResponses;
    }

    public void deleteSlot(long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        slotRepository.delete(slot);
    }

    @Transactional
    public void updateStaffToSlot(long staffId1, long staffId2, long slotId) {
        Staff staff1 = staffRepository.findById(staffId1)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        Staff staff2 = staffRepository.findById(staffId2)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        List<Staff> staffList = slot.getStaff();
        for (int i = 0; i < staffList.size(); i++) {
            if (staffList.get(i) == staff1) {
                staffList.set(i, staff2);
                break;
            }
        }
    }

    @Transactional
    public SlotResponse updateSlot(SlotRequest slotRequest,
                                   long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        slot.setSlotDate(slotRequest.getSlotDate());
        slot.setStartTime(slotRequest.getStartTime());
        slot.setEndTime(slotRequest.getEndTime());
        SlotResponse slotResponse = slotMapper.toSlotResponse(slot);
        return slotResponse;
    }


}