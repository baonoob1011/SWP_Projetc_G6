package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.DeliveryStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.roleService.PatientService;

import java.time.LocalDate;
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
    EmailService emailService;
    PatientService patientService;
    PriceListRepository priceListRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository, LocationRepository locationRepository, EmailService emailService, PatientService patientService, PriceListRepository priceListRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.userRepository = userRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
        this.locationRepository = locationRepository;
        this.emailService = emailService;
        this.patientService = patientService;
        this.priceListRepository = priceListRepository;
    }

    public AppointmentResponse bookAppointmentAtCenter(AppointmentRequest appointmentRequest,
                                                       Authentication authentication,
                                                       List<PatientRequest> patientRequestList,
                                                       long slotId,
                                                       long locationId,
                                                       long serviceId) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCATION_NOT_EXISTS));

        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }
        patientService.registerServiceTest(patientRequestList, userBookAppointment, serviceTest);

        appointment.setSlot(slot);
        appointment.setAppointmentDate(slot.getSlotDate());
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setStaff(slot.getStaff());
        appointment.setServices(serviceTest);
        appointment.setLocation(location);
        appointment.setUsers(userBookAppointment);

        userBookAppointment.setAppointments(List.of(appointment));

        Appointment saved = appointmentRepository.save(appointment);

        // Update slot status to BOOKED
        slot.setSlotStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(saved);

        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(slot.getStaff());
        SlotAppointmentResponse slotAppointmentResponse = appointmentMapper.toSlotAppointmentResponse(slot);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(userBookAppointment.getPatients());
        LocationAppointmentResponse locationAppointmentResponse = appointmentMapper.toLocationAppointmentResponse(location);
        RoomAppointmentResponse roomAppointmentResponse = appointmentMapper.toRoomAppointmentResponse(slot.getRoom());


        AllAppointmentAtCenterResponse emailResponse = new AllAppointmentAtCenterResponse();
        emailResponse.setShowAppointmentResponse(showAppointmentResponse);
        emailResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        emailResponse.setStaffAppointmentResponse(List.of(staffAppointmentResponse));
        emailResponse.setSlotAppointmentResponse(List.of(slotAppointmentResponse));
        emailResponse.setRoomAppointmentResponse(roomAppointmentResponse);
        emailResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        emailResponse.setPatientAppointmentResponse(patientAppointmentResponses);
        emailResponse.setLocationAppointmentResponses(List.of(locationAppointmentResponse));

        // Send email
        emailService.sendAppointmentAtCenterDetailsEmail(userBookAppointment.getEmail(), emailResponse);

        return appointmentMapper.toAppointmentResponse(saved);
    }

    public AppointmentResponse bookAppointmentAtHome(AppointmentRequest appointmentRequest,
                                                     Authentication authentication,
                                                     List<PatientRequest> patientRequestList,
                                                     long serviceId,
                                                     long priceId) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        PriceList priceList=priceListRepository.findById(priceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PRICE_NOT_EXISTS));


        if(userBookAppointment.getAddress()==null){
            throw new RuntimeException("update your address first");
        }
        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }
        patientService.registerServiceTest(patientRequestList, userBookAppointment, serviceTest);

        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setServices(serviceTest);
        appointment.setUsers(userBookAppointment);
        //user set appointment
        userBookAppointment.setAppointments(List.of(appointment));
        //set status send kit
        serviceTest.getKit().setKitStatus(DeliveryStatus.PENDING);
        serviceTest.getKit().setDeliveryDate(LocalDate.now());

        //tinh price
        double totalPrice=(priceList.getPrice())+(serviceTest.getKit().getPrice());

        Appointment saved = appointmentRepository.save(appointment);


        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(saved);
        KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(serviceTest.getKit());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(userBookAppointment.getPatients());
        //tinh price
        PriceAppointmentResponse priceAppointmentResponses=new PriceAppointmentResponse();
        priceAppointmentResponses.setTime(priceList.getTime());
        priceAppointmentResponses.setPrice(totalPrice);

        AllAppointmentAtHomeResponse emailResponse = new AllAppointmentAtHomeResponse();
        emailResponse.setShowAppointmentResponse(showAppointmentResponse);
        emailResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        emailResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        emailResponse.setPatientAppointmentResponse(patientAppointmentResponses);
        emailResponse.setKitAppointmentResponse(kitAppointmentResponse);
        emailResponse.setPriceAppointmentResponse(priceAppointmentResponses);

        // Send email
        emailService.sendAppointmentHomeDetailsEmail(userBookAppointment.getEmail(), emailResponse);

        return appointmentMapper.toAppointmentResponse(saved);
    }


    public List<AppointmentInfoDTO> getAppointmentByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO(" +
                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note) " +
                "FROM Appointment s WHERE s.staff.staffId = :staffId AND s.appointmentDate > CURRENT_DATE";

        TypedQuery<AppointmentInfoDTO> query = entityManager.createQuery(jpql, AppointmentInfoDTO.class);
        query.setParameter("staffId", staffId);
        return query.getResultList();
    }

    public List<AllAppointmentAtCenterResponse> getAppointmentForUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
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

                RoomAppointmentResponse roomAppointmentResponse = new RoomAppointmentResponse();
                roomAppointmentResponse.setRoomName(appointment.getSlot().getRoom().getRoomName());

                AllAppointmentAtCenterResponse allAppointmentResponse = new AllAppointmentAtCenterResponse();
                allAppointmentResponse.setStaffAppointmentResponse(staffAppointmentResponseList);
                allAppointmentResponse.setShowAppointmentResponse(showAppointmentResponse);
                allAppointmentResponse.setPatientAppointmentResponse(patientAppointmentResponse);
                allAppointmentResponse.setUserAppointmentResponse(userAppointmentResponseList);
                allAppointmentResponse.setSlotAppointmentResponse(slotAppointmentResponseArrayList);
                allAppointmentResponse.setServiceAppointmentResponses(serviceAppointmentResponseList);
                allAppointmentResponse.setLocationAppointmentResponses(locationAppointmentResponseList);
                allAppointmentResponse.setRoomAppointmentResponse(roomAppointmentResponse);

                responses.add(allAppointmentResponse);
            }
        }
        return responses;
    }

    public void cancelledAppointment(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
    }
}
