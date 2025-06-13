package swp.project.adn_backend.service.slot;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.repository.RoomRepository;
import swp.project.adn_backend.repository.SlotRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.repository.RoomRepository;
import swp.project.adn_backend.repository.SlotRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class RoomStatusScheduler {

    private final RoomRepository roomRepository;
    private final SlotRepository slotRepository;

    @Autowired
    public RoomStatusScheduler(RoomRepository roomRepository, SlotRepository slotRepository) {
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
    }

    // Chạy mỗi 5 phút
    @Scheduled(fixedRate = 300_000)
    public void updateRoomStatuses() {
        LocalDate today = LocalDate.now();
        Time nowTime = Time.valueOf(LocalTime.now());

        List<Room> allRooms = roomRepository.findAll();
        for (Room room : allRooms) {
            List<Slot> upcomingSlots = slotRepository.findUpcomingSlotsNative(
                    room.getRoomId(), today, nowTime
            );

            if (upcomingSlots.isEmpty() && room.getRoomStatus() != RoomStatus.AVAILABLE) {
                room.setRoomStatus(RoomStatus.AVAILABLE);
                roomRepository.save(room);
            }
        }
    }
}
