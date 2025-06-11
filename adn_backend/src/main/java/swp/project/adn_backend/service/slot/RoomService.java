package swp.project.adn_backend.service.slot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.slot.RoomRequest;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.enums.RoomStatus;
import swp.project.adn_backend.mapper.RoomMapper;
import swp.project.adn_backend.repository.RoomRepository;

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
        Room room=roomMapper.toRoom(roomRequest);
        room.setRoomStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }
    public List<Room> getAllRoom(){
        return roomRepository.findAll();
    }
}
