package swp.project.adn_backend.service.slot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.slot.RoomRequest;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.RoomMapper;
import swp.project.adn_backend.repository.RoomRepository;

import java.sql.Time;
import java.util.List;

@Service
public class RoomService {
    private RoomRepository roomRepository;
    private RoomMapper roomMapper;

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
    }


    public Room createRoom(RoomRequest roomRequest){
        Time open = Time.valueOf(roomRequest.getOpenTime());
        Time close = Time.valueOf(roomRequest.getCloseTime());

        Integer overlap = roomRepository.isRoomTimeOverlapping(-1L, open, close); // -1 vì là phòng mới

        if (overlap != null && overlap == 1) {
            throw new AppException(ErrorCodeUser.ROOM_TIME_OVERLAP);
        }
        Room room=roomMapper.toRoom(roomRequest);
        room.setRoomStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }
    public List<Room> getAllRoom(){
        return roomRepository.findAll();
    }
}
