package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.request.slot.SlotResponse;
//import swp.project.adn_backend.dto.response.SlotReponse;
import swp.project.adn_backend.entity.Slot;

@Mapper(componentModel = "spring")
public interface SlotMapper {
    Slot toSlot(SlotRequest appointmentRequest);
    SlotResponse toSlotResponse(Slot slot);
}
