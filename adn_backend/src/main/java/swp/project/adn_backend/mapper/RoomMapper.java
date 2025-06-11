package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.slot.RoomRequest;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.entity.Slot;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
   Room toRoom(RoomRequest roomRequest);
}
