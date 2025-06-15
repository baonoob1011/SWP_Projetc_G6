package swp.project.adn_backend.controller.serviceController;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.GlobalRequest.BookAppointmentRequest;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtHomeResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentResponse;
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
    public AllAppointmentAtCenterResponse bookAppointmentAtCenter(@RequestBody BookAppointmentRequest request,
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

    @PostMapping("/book-appointment-at_home/{serviceId}")
    public AllAppointmentAtHomeResponse bookAppointmentAtHome(@RequestBody BookAppointmentRequest request,
                                                              Authentication authentication,
                                                              @PathVariable long serviceId,
                                                              @RequestParam("priceId") long priceId) {
        return appointmentService.bookAppointmentAtHome(
                request.getAppointmentRequest(),
                authentication,
                request.getPatientRequestList(),
                request.getPaymentRequest(),
                serviceId,
                priceId
        );
    }

    @GetMapping("/get-appointment")
    public ResponseEntity<AllAppointmentResponse> getAppointmentForUserAtCenter(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointment(authentication));
    }

    @GetMapping("/get-appointment-history-user")
    public ResponseEntity<AllAppointmentResponse> getHistoryAppointmentUser(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getHistoryAppointmentUser(authentication));
    }


    @PostMapping("/cancel-appointment/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable("appointmentId") long appointmentId) {
        appointmentService.cancelledAppointment(appointmentId);
        return ResponseEntity.ok("cancel successful");
    }

    @PutMapping("/update-status-appointment-at-center")
    public ResponseEntity<UpdateAppointmentStatusResponse> updateAppointmentStatusAtCenter(@RequestParam long appointmentId,
                                                                                           @RequestParam long userId,
                                                                                           @RequestParam long slotId,
                                                                                           @RequestParam long serviceId,
                                                                                           @RequestParam long locationId,
                                                                                           @RequestBody AppointmentRequest appointmentRequest) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatusAtCenter(appointmentId,
                userId,
                slotId,
                serviceId,
                locationId,
                appointmentRequest));
    }

    @PutMapping("/update-status-appointment-at-home")
    public ResponseEntity<UpdateAppointmentStatusResponse> updateAppointmentStatusAtHome(@RequestParam long appointmentId,
                                                                                         @RequestParam long userId,
                                                                                         @RequestParam long serviceId,
                                                                                         @RequestParam long kitId) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatusAtHome(appointmentId,
                userId,
                serviceId,
                kitId));
    }

}
