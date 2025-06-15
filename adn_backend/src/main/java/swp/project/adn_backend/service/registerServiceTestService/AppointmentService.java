package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
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
    PaymentRepository paymentRepository;
    KitRepository kitRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository, LocationRepository locationRepository, EmailService emailService, PatientService patientService, PriceListRepository priceListRepository, PaymentRepository paymentRepository, KitRepository kitRepository) {
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
        this.paymentRepository = paymentRepository;
        this.kitRepository = kitRepository;
    }

    public AllAppointmentAtCenterResponse bookAppointmentAtCenter(AppointmentRequest appointmentRequest,
                                                                  Authentication authentication,
                                                                  List<PatientRequest> patientRequestList,
                                                                  PaymentRequest paymentRequest,
                                                                  long slotId,
                                                                  long locationId,
                                                                  long serviceId,
                                                                  long priceId) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");


        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));

        PriceList priceList = priceListRepository.findById(priceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PRICE_NOT_EXISTS));

        if (slot.getSlotStatus().equals(SlotStatus.BOOKED)) {
            throw new RuntimeException("Slot is Booked, try book other slot");
        }

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCATION_NOT_EXISTS));

        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }
        patientService.registerServiceTest(patientRequestList, userBookAppointment, serviceTest);

        appointment.setSlot(slot);
        System.out.println("Slot room: " + slot.getRoom()); // ← kiểm tra xem có null không
        appointment.setAppointmentDate(slot.getSlotDate());
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        appointment.setStaff(slot.getStaff());
        appointment.setServices(serviceTest);
        appointment.setLocation(location);
        appointment.setUsers(userBookAppointment);

        //tao payment
        Payment payment = new Payment();
        payment.setAmount(priceList.getPrice());
        payment.setAppointment(appointment);
        payment.setUsers(userBookAppointment);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        paymentRepository.save(payment);

        //nguoi dat hen
        userBookAppointment.setAppointments(new ArrayList<>(List.of(appointment)));

        Appointment saved = appointmentRepository.save(appointment);

        // Update slot status to BOOKED
        slot.setSlotStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(saved);
        List<PriceAppointmentResponse> priceAppointmentResponse = appointmentMapper.toPriceAppointmentResponse(serviceTest.getPriceLists());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(slot.getStaff());
        SlotAppointmentResponse slotAppointmentResponse = appointmentMapper.toSlotAppointmentResponse(slot);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(userBookAppointment.getPatients());
        LocationAppointmentResponse locationAppointmentResponse = appointmentMapper.toLocationAppointmentResponse(location);
        RoomAppointmentResponse roomAppointmentResponse = appointmentMapper.toRoomAppointmentResponse(slot.getRoom());


        AllAppointmentAtCenterResponse allAppointmentAtCenterResponse = new AllAppointmentAtCenterResponse();
        allAppointmentAtCenterResponse.setShowAppointmentResponse(showAppointmentResponse);
        allAppointmentAtCenterResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        allAppointmentAtCenterResponse.setStaffAppointmentResponse(List.of(staffAppointmentResponse));
        allAppointmentAtCenterResponse.setSlotAppointmentResponse(List.of(slotAppointmentResponse));
        allAppointmentAtCenterResponse.setRoomAppointmentResponse(roomAppointmentResponse);
        allAppointmentAtCenterResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        allAppointmentAtCenterResponse.setPatientAppointmentResponse(patientAppointmentResponses);
        allAppointmentAtCenterResponse.setLocationAppointmentResponses(List.of(locationAppointmentResponse));
        allAppointmentAtCenterResponse.setPriceAppointmentResponse(priceAppointmentResponse);

        appointmentMapper.toAppointmentResponse(saved);
        return allAppointmentAtCenterResponse;
    }

    @Transactional
    public UpdateAppointmentStatusResponse ConfirmAppointmentAtCenter(long appointmentId,
                                                                      long userId,
                                                                      long slotId,
                                                                      long serviceId,
                                                                      long locationId) {
        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCATION_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setNote("Bạn vui lòng đến đúng giờ để tránh ảnh hưởng đến quy trình xét nghiệm. Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.");
        appointmentRepository.save(appointment);
        UpdateAppointmentStatusResponse statusResponse = appointmentMapper.toUpdateAppointmentStatusResponse(appointment);

        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment);
        //  List<PriceAppointmentResponse> priceAppointmentResponse = appointmentMapper.toPriceAppointmentResponse(serviceTest.getPriceLists());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(slot.getStaff());
        SlotAppointmentResponse slotAppointmentResponse = appointmentMapper.toSlotAppointmentResponse(slot);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        //  List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(userBookAppointment.getPatients());
        LocationAppointmentResponse locationAppointmentResponse = appointmentMapper.toLocationAppointmentResponse(location);
        RoomAppointmentResponse roomAppointmentResponse = appointmentMapper.toRoomAppointmentResponse(slot.getRoom());


        AllAppointmentAtCenterResponse emailResponse = new AllAppointmentAtCenterResponse();
        emailResponse.setShowAppointmentResponse(showAppointmentResponse);
        emailResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        emailResponse.setStaffAppointmentResponse(List.of(staffAppointmentResponse));
        emailResponse.setSlotAppointmentResponse(List.of(slotAppointmentResponse));
        emailResponse.setRoomAppointmentResponse(roomAppointmentResponse);
        emailResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        emailResponse.setLocationAppointmentResponses(List.of(locationAppointmentResponse));

        emailService.sendAppointmentAtCenterDetailsEmail(userBookAppointment.getEmail(), emailResponse);


        return statusResponse;
    }

    public AllAppointmentAtHomeResponse bookAppointmentAtHome(AppointmentRequest appointmentRequest,
                                                              Authentication authentication,
                                                              List<PatientRequest> patientRequestList,
                                                              PaymentRequest paymentRequest,
                                                              long serviceId,
                                                              long priceId) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        PriceList priceList = priceListRepository.findById(priceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PRICE_NOT_EXISTS));

        if (userBookAppointment.getAddress() == null) {
            throw new RuntimeException("update your address first");
        }
        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }
        patientService.registerServiceTest(patientRequestList, userBookAppointment, serviceTest);

        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        appointment.setServices(serviceTest);
        appointment.setUsers(userBookAppointment);
        //user set appointment
        //set status send kit
        serviceTest.getKit().setKitStatus(DeliveryStatus.IN_PROGRESS);
        serviceTest.getKit().setDeliveryDate(LocalDate.now());
        //tinh price
        double totalPrice = (priceList.getPrice()) + (serviceTest.getKit().getPrice());
        //set payment
        Payment payment = new Payment();
        payment.setAmount(totalPrice);
        payment.setAppointment(appointment);
        payment.setUsers(userBookAppointment);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        paymentRepository.save(payment);

        Appointment saved = appointmentRepository.save(appointment);


        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(saved);
        KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(serviceTest.getKit());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(userBookAppointment.getPatients());
        //tinh price
        PriceAppointmentResponse priceAppointmentResponses = new PriceAppointmentResponse();
        priceAppointmentResponses.setTime(priceList.getTime());
        priceAppointmentResponses.setPrice(totalPrice);
        List<PriceAppointmentResponse> priceAppointmentResponsesList = new ArrayList<>();
        priceAppointmentResponsesList.add(priceAppointmentResponses);

        AllAppointmentAtHomeResponse emailResponse = new AllAppointmentAtHomeResponse();
        emailResponse.setShowAppointmentResponse(showAppointmentResponse);
        emailResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        emailResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        emailResponse.setPatientAppointmentResponse(patientAppointmentResponses);
        emailResponse.setKitAppointmentResponse(kitAppointmentResponse);
        emailResponse.setPriceAppointmentResponse(priceAppointmentResponsesList);

        appointmentMapper.toAppointmentResponse(saved);
        return emailResponse;
    }

    @Transactional
    public UpdateAppointmentStatusResponse ConfirmAppointmentAtHome(long appointmentId,
                                                                    long userId,
                                                                    long serviceId,
                                                                    long kitId) {
        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.KIT_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setNote("Kit sẽ được gửi trong thời gian nhanh nhất! Cảm ơn quý khách đã tin tưởng.");
        appointmentRepository.save(appointment);
        kit.setKitStatus(DeliveryStatus.PENDING);
        kit.setDeliveryDate(LocalDate.now());
        UpdateAppointmentStatusResponse statusResponse = appointmentMapper.toUpdateAppointmentStatusResponse(appointment);

        // Build email content
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment);
        KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(serviceTest.getKit());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);


        AllAppointmentAtHomeResponse emailResponse = new AllAppointmentAtHomeResponse();
        emailResponse.setShowAppointmentResponse(showAppointmentResponse);
        emailResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        emailResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        emailResponse.setKitAppointmentResponse(kitAppointmentResponse);

        emailService.sendAppointmentHomeDetailsEmail(userBookAppointment.getEmail(), emailResponse);


        return statusResponse;
    }

    public List<AppointmentInfoDTO> getAppointmentByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO(" +
                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note, s.users.userId, s.slot.slotId, s.services.serviceId, s.location.locationId) " +
                "FROM Appointment s WHERE s.staff.staffId = :staffId AND s.appointmentDate >= CURRENT_DATE AND s.appointmentStatus=:appointmentStatus";

        TypedQuery<AppointmentInfoDTO> query = entityManager.createQuery(jpql, AppointmentInfoDTO.class);
        query.setParameter("staffId", staffId);
        query.setParameter("appointmentStatus", AppointmentStatus.PENDING);
        return query.getResultList();
    }

//    public AllAppointmentAtCenterResponse getAppointmentBySlot(long slotId) {
//        Slot slot = slotRepository.findById(slotId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
//
//        List<Appointment> appointmentList = slot.getAppointment();
//        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();
//        for (Appointment appointment : appointmentList){
//            List<PatientAppointmentResponse> users = List.of(appointmentMapper.toPatientAppointmentService(appointment.getUsers()));
//
//        }
//    }

    public List<AllAppointmentAtCenterResponse> getAppointmentAtCenter(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {

                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                List<StaffAppointmentResponse> staff = List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
                List<SlotAppointmentResponse> slot = List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot()));
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                List<LocationAppointmentResponse> locations = List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation()));
                List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());

                RoomAppointmentResponse room = new RoomAppointmentResponse();
                room.setRoomName(appointment.getSlot().getRoom().getRoomName());

                AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
                centerResponse.setShowAppointmentResponse(show);
                centerResponse.setStaffAppointmentResponse(staff);
                centerResponse.setSlotAppointmentResponse(slot);
                centerResponse.setServiceAppointmentResponses(services);
                centerResponse.setLocationAppointmentResponses(locations);
                centerResponse.setRoomAppointmentResponse(room);
                centerResponse.setPaymentAppointmentResponse(payments);

                centerList.add(centerResponse);
            }
        }

        return centerList;
    }

    public List<AllAppointmentAtHomeResponse> getAppointmentAtHome(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED) &&
                    appointment.getServices().getServiceType().equals(ServiceType.CIVIL)) {

                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                KitAppointmentResponse kit = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
                List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());

                AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                homeResponse.setShowAppointmentResponse(show);
                homeResponse.setServiceAppointmentResponses(services);
                homeResponse.setKitAppointmentResponse(kit);
                homeResponse.setPaymentAppointmentResponses(payments);

                homeList.add(homeResponse);
            }
        }

        return homeList;
    }


    public AllAppointmentResponse getHistoryAppointmentUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);

        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED) &&
                    appointment.getServices().getServiceType().equals(ServiceType.ADMINISTRATIVE)) {

                List<UserAppointmentResponse> users = List.of(appointmentMapper.toUserAppointmentResponse(appointment.getUsers()));
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));

                PriceList firstPrice = appointment.getServices().getPriceLists().get(0);
                List<PriceAppointmentResponse> priceAppointmentResponse =
                        appointmentMapper.toPriceAppointmentResponse(List.of(firstPrice));

                AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
                centerResponse.setUserAppointmentResponse(users);
                centerResponse.setServiceAppointmentResponses(services);
                centerResponse.setPriceAppointmentResponse(priceAppointmentResponse);

                centerList.add(centerResponse);

            } else if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED) &&
                    appointment.getServices().getServiceType().equals(ServiceType.CIVIL)) {

                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);

                List<UserAppointmentResponse> users = List.of(appointmentMapper.toUserAppointmentResponse(appointment.getUsers()));
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                PriceList firstPrice = appointment.getServices().getPriceLists().get(0);
                List<PriceAppointmentResponse> priceAppointmentResponse =
                        appointmentMapper.toPriceAppointmentResponse(List.of(firstPrice));

                AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                homeResponse.setUserAppointmentResponse(users);
                homeResponse.setServiceAppointmentResponses(services);
                homeResponse.setPriceAppointmentResponse(priceAppointmentResponse);
                homeList.add(homeResponse);
            }
        }

        AllAppointmentResponse finalResponse = new AllAppointmentResponse();
        finalResponse.setAllAppointmentAtCenterResponse(centerList);
        finalResponse.setAllAppointmentAtHomeResponse(homeList);
        return finalResponse;
    }

    @Transactional
    public void cancelledAppointment(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
    }
}
