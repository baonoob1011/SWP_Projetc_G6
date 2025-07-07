package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.*;
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentResponse;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.roleService.StaffService;
import swp.project.adn_backend.service.slot.SlotService;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private StaffService staffService;
    private SlotService slotService;
    private AppointmentService appointmentService;

    @Autowired
    public StaffController(StaffService staffService, SlotService slotService, AppointmentService appointmentService) {
        this.staffService = staffService;
        this.slotService = slotService;
        this.appointmentService = appointmentService;
    }

    //get
    @GetMapping("/get-user-phone")
    public ResponseEntity<UserInfoDTO> getUserByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(staffService.findUserByPhone(phone));
    }

    @GetMapping("/get-all-staff")
    public ResponseEntity<List<StaffBasicInfo>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaffBasicInfo());
    }

    @GetMapping("/get-all-cashier")
    public ResponseEntity<List<StaffBasicInfo>> getAllCashier() {
        return ResponseEntity.ok(staffService.getAllCashierAccount());
    }

    @GetMapping("/get-all-staff-collector")
    public ResponseEntity<List<StaffBasicInfo>> getAllStaffCollector() {
        return ResponseEntity.ok(staffService.getAllStaffCollectorBasicInfo());
    }

    @GetMapping("/get-all-staff-at-home")
    public ResponseEntity<List<StaffBasicInfo>> getAllStaffAtHomeBasicInfo() {
        return ResponseEntity.ok(staffService.getAllStaffAtHomeBasicInfo());
    }

    @GetMapping("/get-all-lab-technician")
    public ResponseEntity<List<StaffBasicInfo>> getAllLabTechnicianBasicInfo() {
        return ResponseEntity.ok(staffService.getAllLabTechnicianBasicInfo());
    }
    @GetMapping("/get-all-consultant")
    public ResponseEntity<List<StaffBasicInfo>> getAllLConsultantBasicInfo() {
        return ResponseEntity.ok(staffService.getAllLConsultantBasicInfo());
    }

    //thanh
    @GetMapping("/get-appointment-by-staff")
    public ResponseEntity<AllAppointmentResponse> getAppointmentByStaffId(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentByStaffId(authentication));
    }

    @GetMapping("/get-appointment-at-home-by-staff")
    public ResponseEntity<AllAppointmentResponse> getAppointmentAtHomeByStaffId(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentAtHomeByStaffId(authentication));
    }


    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateStaffById(@RequestBody @Valid UpdateStaffAndManagerRequest staffRequest, Authentication authentication) {
        return ResponseEntity.ok(staffService.updateStaff(authentication, staffRequest));
    }


}
