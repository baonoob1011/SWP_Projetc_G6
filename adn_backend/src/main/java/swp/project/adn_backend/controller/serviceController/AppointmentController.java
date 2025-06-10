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
                                               @PathVariable("serviceId")long serviceId) {
        return appointmentService.bookAppointment(
                request.getAppointmentRequest(),
                authentication,
//                request.getServiceRequest(),
                request.getStaffRequest(),
                request.getSlotRequest(),
                request.getLocationRequest(),
                serviceId
        );
    }

}
