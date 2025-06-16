//package swp.project.adn_backend.service.slot;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import swp.project.adn_backend.entity.Room;
//import swp.project.adn_backend.enums.RoomStatus;
//import swp.project.adn_backend.repository.RoomRepository;
//
//import java.time.LocalTime;
//import java.util.List;
//
//@Service
//public class RoomScheduler {
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//    // ⏱ Chạy mỗi 1 phút
//    @Scheduled(fixedRate = 60_000)
//    public void updateRoomStatusAfterCloseTime() {
//        LocalTime now = LocalTime.now();  // Lấy thời gian hiện tại
//        System.out.println("⏱ Running RoomScheduler at " + now);  // ✅ Log khi hàm bắt đầu chạy
//
//        List<Room> rooms = roomRepository.findAll();
//
//        for (Room room : rooms) {
//            if (room.getRoomStatus() != RoomStatus.AVAILABLE && now.isAfter(room.getCloseTime())) {
//                room.setRoomStatus(RoomStatus.AVAILABLE);
//                roomRepository.save(room);
//
//                // ✅ Log khi cập nhật trạng thái phòng
//                System.out.println("✅ Updated Room: " + room.getRoomName() + " to AVAILABLE");
//            }
//        }
//    }
//}
