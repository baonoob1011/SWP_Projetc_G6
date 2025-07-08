package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
//import swp.project.adn_backend.dto.response.SlotReponse;
import swp.project.adn_backend.entity.Slot;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SlotMapper {
//    Slot toSlot(SlotRequest appointmentRequest);
    SlotResponse toSlotResponse(Slot slot);
    List<SlotResponse> toSlotResponses(List<Slot> slot);
    Slot toSlot(SlotRequest slotRequest);
    SlotInfoDTO toSlotInfoDto(Slot slot);
}
