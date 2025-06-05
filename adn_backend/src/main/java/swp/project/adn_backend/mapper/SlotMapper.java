package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.serviceRequest.AppointmentRequest;
import swp.project.adn_backend.dto.request.serviceRequest.SlotRequest;
import swp.project.adn_backend.dto.response.SlotReponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.Slot;

@Mapper(componentModel = "spring")
public interface SlotMapper {
    Slot toSlot(SlotRequest appointmentRequest);

    SlotReponse toSlotResponse(Slot slot);
}
