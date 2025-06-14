package swp.project.adn_backend.service.slot;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
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
    private EntityManager entityManager;

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper, EntityManager entityManager) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
        this.entityManager = entityManager;
    }

    public Room createRoom(RoomRequest roomRequest) {
        Room room = roomMapper.toRoom(roomRequest);
        room.setRoomStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }

    public List<RoomInfoDTO> getAllRoom() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.RoomInfoDTO(" +
                "s.roomId, s.roomName, s.roomStatus, s.openTime, s.closeTime) " +
                "FROM Room s WHERE s.roomStatus = :roomStatus";

        TypedQuery<RoomInfoDTO> query = entityManager.createQuery(jpql, RoomInfoDTO.class);
        query.setParameter("roomStatus", RoomStatus.AVAILABLE);
        return query.getResultList();
    }
    public Room updateRoom(Long roomId, RoomRequest roomRequest) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));

        Time open = Time.valueOf(roomRequest.getOpenTime());
        Time close = Time.valueOf(roomRequest.getCloseTime());
        Integer overlap = roomRepository.isRoomTimeOverlapping(roomId, open, close);
        if (overlap != null && overlap == 1) {
            throw new AppException(ErrorCodeUser.ROOM_TIME_OVERLAP);
        }

        room.setRoomName(roomRequest.getRoomName());
        room.setOpenTime(roomRequest.getOpenTime());
        room.setCloseTime(roomRequest.getCloseTime());
        room.setRoomStatus(roomRequest.getRoomStatus());

        return roomRepository.save(room);
    }

    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.ROOM_NOT_FOUND));
        roomRepository.delete(room);
    }
}
