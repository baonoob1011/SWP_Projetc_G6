package swp.project.adn_backend.controller.serviceController;

import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.GlobalRequest.BookAppointmentRequest;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.InfoDTO.AppointmentAtHomeInfoDTO;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.AllAppointmentResult;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/book-appointment/{serviceId}")
    public AllAppointmentAtCenterResponse bookAppointmentAtCenter(@RequestBody @Valid BookAppointmentRequest request,
                                                                  Authentication authentication,
                                                                  @PathVariable("serviceId") long serviceId,
                                                                  @RequestParam long slotId,
                                                                  @RequestParam long locationId,
                                                                  @RequestParam long priceId) {
        return appointmentService.bookAppointmentAtCenter(
                request.getAppointmentRequest(),
                authentication,
                request.getPatientRequestList(),
                request.getPaymentRequest(),
                slotId,
                locationId,
                serviceId,
                priceId
        );
    }

    @PostMapping("/book-appointment-at-home/{serviceId}")
    public AllAppointmentAtHomeResponse bookAppointmentAtHome(@RequestBody @Valid BookAppointmentRequest request,
                                                              Authentication authentication,
                                                              @PathVariable("serviceId") long serviceId,
                                                              @RequestParam long priceId) {
        return appointmentService.bookAppointmentAtHome(
                request.getAppointmentRequest(),
                authentication,
                request.getPatientRequestList(),
                request.getPaymentRequest(),
                serviceId,
                priceId
        );
    }
    // đánh vắng patient
    @PutMapping("/check-in-patient")
    public ResponseEntity<String> checkInPatient(@RequestParam long patientId,
                                                 @RequestParam long appointmentId) {
        appointmentService.patientCheckIn(patientId, appointmentId);
        return ResponseEntity.ok("Bệnh nhân vắng mặt");
    }

    @GetMapping("/get-appointment")
    public ResponseEntity<AllAppointmentResponse> getAppointmentForUserAtCenter(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(authentication));
    }

    @GetMapping("/get-history")
    public ResponseEntity<AllAppointmentResponse> getUserHistory(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getHistory(authentication));
    }

//    @GetMapping("/get-appointment-at-home")
//    public ResponseEntity<List<AllAppointmentAtHomeResponse>> getAppointmentForUserAtHome(Authentication authentication) {
//        return ResponseEntity.ok(appointmentService.getAppointmentAtHome(authentication));
//    }

//    @GetMapping("/get-appointment-history-user")
//    public ResponseEntity<AllAppointmentResponse> getHistoryAppointmentUser(Authentication authentication) {
//        return ResponseEntity.ok(appointmentService.getHistoryAppointmentUser(authentication));
//    }

    @GetMapping("/get-appointment-by-slot/{slotId}")
    public ResponseEntity<List<AllAppointmentAtCenterResponse>> getAppointmentBySlot(@PathVariable("slotId") long slotId,
                                                                                     Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentBySlot(slotId,authentication));
    }


    //lab lấy mẫu ra dể ghi kết quả
    @GetMapping("/get-appointment-at-home-to-get-sample")
    public ResponseEntity<List<AllAppointmentAtCenterResponse>> getAppointmentAtHomeToGetSample(Authentication authentication,
                                                                                                @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentAtHomeToRecordResult(authentication,appointmentId));
    }
//    //staff lay appoint de thanh toan tien mat
//    @GetMapping("/get-appointment-of-user-by-phone")
//    public ResponseEntity<List<AllAppointmentAtCenterUserResponse>> getAppointmentOfUser(@RequestBody UserRequest userRequest,
//                                                                                         Authentication authentication) {
//        return ResponseEntity.ok(appointmentService.getAppointmentOfUser(authentication,userRequest));
//    }

    //thanh toán tiền tại cơ sở
//    @PutMapping("/get-payment-at-center")
//    public ResponseEntity<String> getAppointmentOfUser(@RequestParam long paymentId,
//                                                       @RequestParam long appointmentId) {
//        appointmentService.payAppointment(paymentId,appointmentId);
//        return ResponseEntity.ok("thanh toán bằng tiền mặt thành công");
//    }

    @GetMapping("/get-appointment-at-home-by-staff")
    public ResponseEntity<List<AllAppointmentAtHomeResponse>> getAppointmentAtHome(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentAtHome(authentication));
    }


    @GetMapping("/get-all-result")
    public ResponseEntity<List<AllAppointmentResult>> getAllAppointmentsResult(Authentication authentication,
                                                                               @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsResult(authentication, appointmentId));
    }

    //thêm staff vào appointment at home
    @PutMapping("/update-staff-to-appointment-at-home")
    public ResponseEntity<String> addStaffToAppointment(@RequestParam long staffId,
                                                        @RequestParam long appointmentId) {
        appointmentService.addStaffToAppointment(staffId, appointmentId);
        return ResponseEntity.ok("add staff to appointment successful");
    }

    //thong bao sample bi loi
    @PutMapping("/update-note")
    public ResponseEntity<String> updateNote(@RequestBody AppointmentRequest appointmentRequest,
                                             @RequestParam long appointmentId) {
        appointmentService.updateNote(appointmentRequest, appointmentId);
        return ResponseEntity.ok("update note appointment successful");
    }

    @PostMapping("/cancel-appointment/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable("appointmentId") long appointmentId) {
        appointmentService.cancelledAppointment(appointmentId);
        return ResponseEntity.ok("cancel successful");
    }

    @PutMapping("/confirm-appointment-at-center")
    public ResponseEntity<UpdateAppointmentStatusResponse> updateAppointmentStatusAtCenter(@RequestParam long appointmentId,
                                                                                           @RequestParam long userId,
                                                                                           @RequestParam long slotId,
                                                                                           @RequestParam long serviceId,
                                                                                           @RequestParam long locationId) {
        return ResponseEntity.ok(appointmentService.ConfirmAppointmentAtCenter(appointmentId,
                userId,
                slotId,
                serviceId,
                locationId));
    }

    @PutMapping("/confirm-appointment-at-home")
    public ResponseEntity<UpdateAppointmentStatusResponse> updateAppointmentStatusAtHome(@RequestParam long appointmentId,
                                                                                         @RequestParam long userId,
                                                                                         @RequestParam long serviceId) {
        return ResponseEntity.ok(appointmentService.ConfirmAppointmentAtHome(appointmentId,
                userId,
                serviceId));
    }

    @PutMapping("/book-appointment-again")
    public ResponseEntity<String> updateAppointmentToGetSampleAgain(@RequestParam long appointmentId) {
        appointmentService.updateAppointmentToGetSampleAgain(appointmentId);
        return ResponseEntity.ok("update thanh cong");
    }

    // tạo nút update appointment
    @PutMapping("/update-appointment-status")
    public ResponseEntity<String> updateAppointmentStatus(@RequestParam long slotId,
                                                          @RequestParam long patientId,
                                                          AppointmentRequest appointmentRequest,
                                                          PatientRequest patientRequest) {
        appointmentService.updateAppointmentStatus(slotId, patientId, appointmentRequest, patientRequest);
        return ResponseEntity.ok("Update Successful");
    }
}
