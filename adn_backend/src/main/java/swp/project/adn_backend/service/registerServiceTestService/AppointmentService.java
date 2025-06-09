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
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.*;

import java.util.ArrayList;
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
    SlotRepository slotRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.userRepository = userRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
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

        Slot slot = slotRepository.findById(slotRequest.getSlotId())
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));

        Staff staffCollectSample = staffRepository.findById(staffRequest.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }
        appointment.setSlot(slot);
        appointment.setAppointmentDate(slot.getSlotDate());
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        appointment.setStaff(slot.getStaff());
        appointment.setServices(serviceTest);

//        //người đăng kí dịch vụ
//        List<Users> users = new ArrayList<>();
//        users.add(userBookAppointment);
//        serviceTest.setUsers(users);

//        //những dịch vụ mà người này đăng kí
//        List<ServiceTest> serviceTests = new ArrayList<>();
//        serviceTests.add(serviceTest);
//        userBookAppointment.setServices(serviceTests);

        // Associate user <-> appointment bidirectionally
        appointment.setUsers(userBookAppointment);
        userBookAppointment.setAppointments(appointment);

        //nguoi dang ki slot do
        slot.setUsers(userBookAppointment);
        // Save appointment
        Appointment saved = appointmentRepository.save(appointment);

        return appointmentMapper.toAppointmentResponse(saved);
    }

}
