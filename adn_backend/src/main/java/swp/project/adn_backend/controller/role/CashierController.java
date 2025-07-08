package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.roleRequest.UserPhoneRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterUserResponse;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.roleService.StaffService;
import swp.project.adn_backend.service.slot.SlotService;

import java.util.List;

@RestController
@RequestMapping("/api/cashier")
public class CashierController {

    private StaffService staffService;
    private SlotService slotService;
    private AppointmentService appointmentService;

    @Autowired
    public CashierController(StaffService staffService, SlotService slotService, AppointmentService appointmentService) {
        this.staffService = staffService;
        this.slotService = slotService;
        this.appointmentService = appointmentService;
    }

    @PutMapping("/get-payment-at-center")
    public ResponseEntity<String> getAppointmentOfUser(@RequestParam long paymentId,
                                                       @RequestParam long appointmentId) {
        appointmentService.payAppointment(paymentId, appointmentId);
        return ResponseEntity.ok("thanh toán bằng tiền mặt thành công");
    }

    @PostMapping("/get-appointment-of-user-by-phone")
    public ResponseEntity<List<AllAppointmentAtCenterUserResponse>> getAppointmentOfUser(@RequestBody UserPhoneRequest userRequest,
                                                                                         Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentOfUser(authentication, userRequest));
    }


}
