package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.serviceRequest.AppointmentRequest;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.AppointmentRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentService {
    AppointmentRepository appointmentRepository;
    AppointmentMapper appointmentMapper;
    UserRepository userRepository;
    ServiceTestRepository serviceTestRepository;
    EntityManager entityManager;
    StaffRepository staffRepository;
    SlotMapper slotMapper;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.userRepository = userRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
        this.slotMapper = slotMapper;
    }

    public AppointmentResponse bookAppointment(AppointmentRequest appointmentRequest,
                                               Authentication authentication,
                                               ServiceRequest serviceRequest,
                                               StaffRequest staffRequest,
                                               SlotRequest slotRequest) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceRequest.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTED));

        Staff staffCollectSample = staffRepository.findById(staffRequest.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }

        appointment.setNote(appointmentRequest.getNote());
        appointment.setStaff(staffCollectSample);
        appointment.setServices(List.of(serviceTest));

        // Set slot
        Slot slot = slotMapper.toSlot(slotRequest);
        appointment.setSlot(slot);

        // Associate user <-> appointment bidirectionally
        appointment.setUsers(List.of(userBookAppointment));
        userBookAppointment.getAppointments().add(appointment);

        // Save appointment
        Appointment saved = appointmentRepository.save(appointment);

        return appointmentMapper.toAppointmentResponse(saved);
    }

}
