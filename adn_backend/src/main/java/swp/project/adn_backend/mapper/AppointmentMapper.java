package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    Appointment toAppointment(AppointmentRequest appointmentRequest);
    AppointmentResponse toAppointmentResponse(Appointment appointment);

    KitAppointmentResponse toKitAppointmentResponse(Kit kit);
    ShowAppointmentResponse toShowAppointmentResponse(Appointment appointment);
    List<PatientAppointmentResponse> toPatientAppointmentService(List<Patient> patient);
    ServiceAppointmentResponse toServiceAppointmentResponse(ServiceTest serviceTest);
    SlotAppointmentResponse toSlotAppointmentResponse(Slot slot);
    StaffAppointmentResponse toStaffAppointmentResponse(Staff staff);
    UserAppointmentResponse toUserAppointmentResponse(Users users);
    LocationAppointmentResponse toLocationAppointmentResponse(Location location);
    RoomAppointmentResponse toRoomAppointmentResponse(Room room);
    PriceAppointmentResponse toPriceAppointmentResponse(PriceList priceList);
}
