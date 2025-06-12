package swp.project.adn_backend.controller.serviceController;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.GlobalRequest.BookAppointmentRequest;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/book-appointment/{serviceId}")
    public AppointmentResponse bookAppointmentAtCenter(@RequestBody BookAppointmentRequest request,
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
    public AppointmentResponse bookAppointmentAtHome(@RequestBody BookAppointmentRequest request,
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
    public ResponseEntity<List<AllAppointmentAtCenterResponse>> getAppointment(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentForUser(authentication));
    }

    @PostMapping("/cancel-appointment/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable("appointmentId") long appointmentId) {
        appointmentService.cancelledAppointment(appointmentId);
        return ResponseEntity.ok("cancel successful");
    }

}
