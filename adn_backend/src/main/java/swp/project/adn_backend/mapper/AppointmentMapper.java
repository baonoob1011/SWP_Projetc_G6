package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.ResultAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.ResultDetailAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.ResultLocusAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.SampleAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.dto.response.result.PatientAlleleResponse;
import swp.project.adn_backend.dto.response.result.SampleAlleleResponse;
import swp.project.adn_backend.dto.response.sample.AppointmentSampleResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    Appointment toAppointment(AppointmentRequest appointmentRequest);
    AppointmentResponse toAppointmentResponse(Appointment appointment);
    UpdateAppointmentStatusResponse toUpdateAppointmentStatusResponse(Appointment appointment);
    AppointmentSampleResponse toAppointmentSampleResponse(Appointment appointment);
    KitAppointmentResponse toKitAppointmentResponse(Kit kit);
    ShowAppointmentResponse toShowAppointmentResponse(Appointment appointment);
    List<PatientAppointmentResponse> toPatientAppointmentService(List<Patient> patient);
    PatientAppointmentResponse toPatientAppointment(Patient patient);
    List<PatientAppointmentFullInfoResponse> toPatientAppointmentFullInfoResponses(List<Patient> patient);
    ServiceAppointmentResponse toServiceAppointmentResponse(ServiceTest serviceTest);
    SlotAppointmentResponse toSlotAppointmentResponse(Slot slot);
    StaffAppointmentResponse toStaffAppointmentResponse(Staff staff);
    UserAppointmentResponse toUserAppointmentResponse(Users users);
    LocationAppointmentResponse toLocationAppointmentResponse(Location location);
    RoomAppointmentResponse toRoomAppointmentResponse(Room room);
    List<PaymentAppointmentResponse> toPaymentAppointmentResponse(List<Payment> payment);
    List<PriceAppointmentResponse> toPriceAppointmentResponse(List<PriceList> priceList);
    ResultAppointmentResponse toResultAppointmentResponse(Result result);
    ResultLocusAppointmentResponse toResultLocusAppointmentResponse(ResultLocus resultLocus);
    ResultDetailAppointmentResponse toResultDetailAppointmentResponse(ResultDetail resultDetail);
    List<SampleAppointmentResponse> toSampleAppointmentResponse(List<Sample> sample);
    List<UserAppointmentResponse> toUserAppointmentResponseList(List<Users> users);
    PatientAlleleResponse toPatientAppointmentResponse(Patient patient);
    List<SampleAlleleResponse> toSampleAlleleResponses(List<Sample> sample);
    LocusResponse toLocusResponses(Locus loci);
}
