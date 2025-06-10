package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.response.appointment.*;
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
    LocationRepository locationRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository, LocationRepository locationRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.userRepository = userRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
        this.locationRepository = locationRepository;
    }

    public AppointmentResponse bookAppointment(AppointmentRequest appointmentRequest,
                                               Authentication authentication,
                                               ServiceRequest serviceRequest,
                                               StaffRequest staffRequest,
                                               SlotRequest slotRequest,
                                               LocationRequest locationRequest) {

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

        Location location = locationRepository.findById(locationRequest.getLocationId())
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
        appointment.setLocation(location);

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
        List<Appointment> appointmentList = new ArrayList<>();
        appointmentList.add(appointment);
        userBookAppointment.setAppointments(appointmentList);

        //nguoi dang ki slot do
//        slot.setUsers(userBookAppointment);
        // Save appointment
        Appointment saved = appointmentRepository.save(appointment);

        return appointmentMapper.toAppointmentResponse(saved);
    }

//    public List<Appointment> getAppointmentByStaffId(Authentication authentication) {
//        Jwt jwt = (Jwt) authentication.getPrincipal();
//        Long staffId = jwt.getClaim("id");
//        Staff staff = staffRepository.findById(staffId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
//        List<Appointment> appointmentList = appointmentRepository.findByStaff_StaffId(staffId);
//        List<AllAppointmentResponse> responses = new ArrayList<>();
//        for (Appointment appointment : appointmentList){
//
//        }
//
//    }

    public List<AllAppointmentResponse> getAppointmentForUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        List<AllAppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointmentList) {
            ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment);

            List<UserAppointmentResponse> userAppointmentResponseList = new ArrayList<>();
            UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(appointment.getUsers());
            userAppointmentResponseList.add(userAppointmentResponse);

            List<StaffAppointmentResponse> staffAppointmentResponseList = new ArrayList<>();
            StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(appointment.getStaff());
            staffAppointmentResponseList.add(staffAppointmentResponse);

            List<SlotAppointmentResponse> slotAppointmentResponseArrayList = new ArrayList<>();
            SlotAppointmentResponse slotAppointmentResponse = appointmentMapper.toSlotAppointmentResponse(appointment.getSlot());
            slotAppointmentResponseArrayList.add(slotAppointmentResponse);

            List<ServiceAppointmentResponse> serviceAppointmentResponseList = new ArrayList<>();
            ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(appointment.getServices());
            serviceAppointmentResponseList.add(serviceAppointmentResponse);

            List<PatientAppointmentResponse> patientAppointmentResponse = appointmentMapper.toPatientAppointmentService(userRegister.getPatients());

            List<LocationAppointmentResponse> locationAppointmentResponseList = new ArrayList<>();
            LocationAppointmentResponse locationAppointmentResponse = appointmentMapper.toLocationAppointmentResponse(appointment.getLocation());
            locationAppointmentResponseList.add(locationAppointmentResponse);


            AllAppointmentResponse allAppointmentResponse = new AllAppointmentResponse();
            allAppointmentResponse.setStaffAppointmentResponse(staffAppointmentResponseList);
            allAppointmentResponse.setShowAppointmentResponse(showAppointmentResponse);
            allAppointmentResponse.setPatientAppointmentResponse(patientAppointmentResponse);
            allAppointmentResponse.setUserAppointmentResponse(userAppointmentResponseList);
            allAppointmentResponse.setSlotAppointmentResponse(slotAppointmentResponseArrayList);
            allAppointmentResponse.setServiceAppointmentResponses(serviceAppointmentResponseList);
            allAppointmentResponse.setLocationAppointmentResponses(locationAppointmentResponseList);

            responses.add(allAppointmentResponse);
        }
        return responses;
    }
}
