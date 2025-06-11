package swp.project.adn_backend.controller.serviceController;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.GlobalRequest.BookAppointmentRequest;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/book-appointment/{serviceId}")
    public AppointmentResponse bookAppointment(@RequestBody BookAppointmentRequest request,
                                               Authentication authentication,
                                               @PathVariable long serviceId,
                                               @RequestParam("slotId")long slotId,
                                               @RequestParam("locationId")long locationId) {
        return appointmentService.bookAppointment(
                request.getAppointmentRequest(),
                authentication,
                slotId,
                locationId,
                serviceId
        );
    }

}
