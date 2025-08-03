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
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoForManagerDTO;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.AllAppointmentResult;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.ServiceType;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    AppointmentService appointmentService;
    ServiceTestRepository serviceTestRepository;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, ServiceTestRepository serviceTestRepository) {
        this.appointmentService = appointmentService;
        this.serviceTestRepository = serviceTestRepository;
    }

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


    @PostMapping("/book-appointment-at-home/{serviceId}")
    public AllAppointmentAtHomeResponse bookAppointmentAtHome(@RequestBody BookAppointmentRequest request,
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


    @GetMapping("/get-appointment-by-slot/{slotId}")
    public ResponseEntity<List<AllAppointmentAtCenterResponse>> getAppointmentBySlot(@PathVariable("slotId") long slotId,
                                                                                     Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentBySlot(slotId, authentication));
    }


    //lab lấy mẫu ra dể ghi kết quả
    @GetMapping("/get-appointment-at-home-to-get-sample")
    public ResponseEntity<List<AllAppointmentAtCenterResponse>> getAppointmentAtHomeToGetSample(Authentication authentication,
                                                                                                @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentAtHomeToRecordResult(authentication, appointmentId));
    }

    @GetMapping("/get-appointment-at-home-by-staff")
    public ResponseEntity<List<AllAppointmentAtHomeResponse>> getAppointmentAtHome(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentAtHome(authentication));
    }


    @GetMapping("/get-all-result")
    public ResponseEntity<List<AllAppointmentResult>> getAllAppointmentsResult(Authentication authentication,
                                                                               @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsResult(authentication, appointmentId));
    }

    // manager lấy kết quả ra xem rồi xác nhận
    @GetMapping("/get-all-result-by-manager")
    public ResponseEntity<List<AllAppointmentResult>> getAllAppointmentsResultForManager(Authentication authentication,
                                                                                         @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsResultForManager(authentication, appointmentId));
    }
    @GetMapping("/get-all-history-result-by-phone")
    public ResponseEntity<List<AllAppointmentResult>> getAllAppointmentsResultByPhone(Authentication authentication,
                                                                                         @RequestParam String phone) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsResultByPhone(authentication, phone));
    }

    //staff lay ra de in giay cung
    @GetMapping("/get-all-result-by-staff")
    public ResponseEntity<List<AllAppointmentResult>> getAllAppointmentsResultForStaffToSendHardCopy(Authentication authentication,
                                                                                                     @RequestParam long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsResultForStaffToSendHardCopy(authentication, appointmentId));
    }

    // manager get to view result
    @GetMapping("/get-all-appointment-by-manager")
    public ResponseEntity<List<AppointmentInfoForManagerDTO>> getAppointmentToViewResult() {
        return ResponseEntity.ok(appointmentService.getAppointmentToViewResult());
    }

    @GetMapping("/get-all-appointment-by-manager-to-refund")
    public ResponseEntity<List<AppointmentInfoForManagerDTO>> getAppointmentToRefund() {
        return ResponseEntity.ok(appointmentService.getAppointmentToRefund());
    }

    @GetMapping("/get-all-appointment-by-staff-to-send-hard-copy")
    public ResponseEntity<List<AppointmentInfoForManagerDTO>> getAppointmentToSendHardCopy() {
        return ResponseEntity.ok(appointmentService.getAppointmentToSendHardCopy());
    }

    //thêm staff vào appointment at home
    @PutMapping("/update-staff-to-appointment-at-home")
    public ResponseEntity<String> addStaffToAppointment(@RequestParam long staffId,
                                                        @RequestParam long appointmentId) {
        appointmentService.addStaffToAppointment(staffId, appointmentId);
        return ResponseEntity.ok("add staff to appointment successful");
    }

    @GetMapping("/get-appointment-by-phone")
    public ResponseEntity<AllAppointmentResponse> getAppointmentByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(appointmentService.getAppointmentByPhone(phone));
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

    //manager update xác nhận kết quả
    @PutMapping("/update-complete-appointment-by-manager")
    public ResponseEntity<String> updateAppointmentStatusByManager(@RequestParam long appointmentId) {
        appointmentService.updateAppointmentStatusByManager(appointmentId);
        return ResponseEntity.ok("update thanh cong");
    }

    //
    @PutMapping("/appointment-refund")
    public ResponseEntity<String> appointmentRefund(@RequestParam long appointmentId) {
        appointmentService.appointmentRefund(appointmentId);
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

    private void validatePatientRequests(List<PatientRequest> list) {
        if (list == null || list.isEmpty()) {
            throw new RuntimeException("Danh sách bệnh nhân không được trống");
        }

        for (PatientRequest pr : list) {
            if (pr.getFullName() == null || pr.getFullName().isBlank()) {
                throw new RuntimeException("Tên bệnh nhân không được để trống");
            }

            if (pr.getDateOfBirth() == null || pr.getDateOfBirth().isAfter(LocalDate.now())) {
                throw new RuntimeException("Ngày sinh không hợp lệ");
            }

            int age = Period.between(pr.getDateOfBirth(), LocalDate.now()).getYears();

            // ✅ Nếu dưới 14 tuổi → yêu cầu giấy khai sinh
            if (age < 14) {
                if (pr.getBirthCertificate() == null || pr.getBirthCertificate().isBlank()) {
                    throw new RuntimeException("Trẻ dưới 14 tuổi bắt buộc phải có giấy khai sinh");
                }
            }

            // ✅ Nếu từ 16 tuổi trở lên → yêu cầu CCCD
            if (age >= 16) {
                if (pr.getIdentityNumber() == null || pr.getIdentityNumber().isBlank()) {
                    throw new RuntimeException("Người từ 16 tuổi trở lên bắt buộc phải có số CCCD");
                }
            }
        }
    }


}
