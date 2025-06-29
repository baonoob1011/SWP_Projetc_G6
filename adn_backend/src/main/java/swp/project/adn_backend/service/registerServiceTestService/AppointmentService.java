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
import swp.project.adn_backend.dto.InfoDTO.AppointmentAtHomeInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserPhoneRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.*;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.dto.response.serviceResponse.AppointmentResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.roleService.PatientService;
import swp.project.adn_backend.service.slot.StaffAssignmentTracker;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    PatientRepository patientRepository;
    KitDeliveryStatusRepository kitDeliveryStatusRepository;
    InvoiceRepository invoiceRepository;
    StaffAssignmentTracker staffAssignmentTracker;
    NotificationRepository notificationRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository, LocationRepository locationRepository, EmailService emailService, PatientService patientService, PriceListRepository priceListRepository, PaymentRepository paymentRepository, KitRepository kitRepository, PatientRepository patientRepository, KitDeliveryStatusRepository kitDeliveryStatusRepository, InvoiceRepository invoiceRepository, StaffAssignmentTracker staffAssignmentTracker, NotificationRepository notificationRepository) {
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
        this.patientRepository = patientRepository;
        this.kitDeliveryStatusRepository = kitDeliveryStatusRepository;
        this.invoiceRepository = invoiceRepository;
        this.staffAssignmentTracker = staffAssignmentTracker;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
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
//        patientService.registerServiceTest(patientRequestList, userBookAppointment, serviceTest);

        List<Patient> registeredPatients = patientService.registerServiceTest(
                patientRequestList, userBookAppointment, serviceTest);

        List<Patient> patientSnapshot = new ArrayList<>(registeredPatients);

        appointment.setPatients(patientSnapshot);
        for (Patient patient : patientSnapshot) {
            patient.setAppointment(appointment);
        }

        appointment.setSlot(slot);
        appointment.setAppointmentDate(slot.getSlotDate());
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setAppointmentType(AppointmentType.CENTER);
        appointment.setNote("Vui lòng đến quầy thu ngân để thanh toán dịch vụ. " +
                "Bạn chỉ cần cung cấp số điện thoại đã đăng ký để nhân viên hỗ trợ thanh toán nhanh chóng.");
        for (Staff staff : slot.getStaff()) {
            if (staff.getRole().equals("SAMPLE_COLLECTOR")) {
                appointment.setStaff(staff);
                break;
            }
        }
        appointment.setServices(serviceTest);
        appointment.setLocation(location);
        appointment.setUsers(userBookAppointment);

// Tính giá sau khi giảm (nếu có)

        BigDecimal originalPrice = BigDecimal.valueOf(priceList.getPrice());

        double discountPercent = 0.0;
        LocalDate today = LocalDate.now();

        for (Discount discount : serviceTest.getDiscounts()) {
            if (discount.isActive() &&
                    (today.isEqual(discount.getStartDate()) || today.isAfter(discount.getStartDate())) &&
                    (today.isBefore(discount.getEndDate()) || today.isEqual(discount.getEndDate()))) {
                discountPercent = discount.getDiscountValue(); // kiểu double
                break;
            }
        }

        // Tính finalAmount = originalPrice * (1 - discount/100)
        double amountAsDouble = originalPrice.doubleValue() * (1 - discountPercent / 100);

        // Làm tròn về 2 chữ số sau dấu phẩy nếu muốn
        amountAsDouble = Math.round(amountAsDouble * 100.0) / 100.0;

        // Tạo payment
        Payment payment = new Payment();
        payment.setAmount(amountAsDouble); // dùng double
        payment.setAppointment(appointment);
        payment.setUsers(userBookAppointment);
        payment.setPaymentStatus(PaymentStatus.PENDING);
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
        List<StaffAppointmentResponse> staffAppointmentResponses = new ArrayList<>();
        for (Staff staff : slot.getStaff()) {
            if (staff.getRole().equals("SAMPLE_COLLECTOR")) {
                StaffAppointmentResponse response = appointmentMapper.toStaffAppointmentResponse(staff);
                staffAppointmentResponses.add(response);
            }
        }
        increaseStaffNotification(appointment.getStaff());
        SlotAppointmentResponse slotAppointmentResponse = appointmentMapper.toSlotAppointmentResponse(slot);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses = appointmentMapper.toPatientAppointmentService(appointment.getPatients());
        LocationAppointmentResponse locationAppointmentResponse = appointmentMapper.toLocationAppointmentResponse(location);
        RoomAppointmentResponse roomAppointmentResponse = appointmentMapper.toRoomAppointmentResponse(slot.getRoom());


        AllAppointmentAtCenterResponse allAppointmentAtCenterResponse = new AllAppointmentAtCenterResponse();
        allAppointmentAtCenterResponse.setShowAppointmentResponse(showAppointmentResponse);
        allAppointmentAtCenterResponse.setUserAppointmentResponse(List.of(userAppointmentResponse));
        allAppointmentAtCenterResponse.setStaffAppointmentResponse(staffAppointmentResponses);
        allAppointmentAtCenterResponse.setSlotAppointmentResponse(List.of(slotAppointmentResponse));
        allAppointmentAtCenterResponse.setRoomAppointmentResponse(roomAppointmentResponse);
        allAppointmentAtCenterResponse.setServiceAppointmentResponses(List.of(serviceAppointmentResponse));
        allAppointmentAtCenterResponse.setPatientAppointmentResponse(patientAppointmentResponses);
        allAppointmentAtCenterResponse.setLocationAppointmentResponses(List.of(locationAppointmentResponse));
        allAppointmentAtCenterResponse.setPriceAppointmentResponse(priceAppointmentResponse);

        emailService.sendAppointmentAtCenterDetailsEmail(userBookAppointment.getEmail(), allAppointmentAtCenterResponse);


        appointmentMapper.toAppointmentResponse(saved);
        return allAppointmentAtCenterResponse;
    }
    @Transactional
    private void increaseStaffNotification(Staff staff) {
        Notification notification = staff.getNotification();
        if (notification == null) {
            notification = new Notification();
            notification.setStaff(staff);
            notification.setNumOfNotification(1);
            staff.setNotification(notification);
            notificationRepository.save(notification);
        } else {
            notification.setNumOfNotification(notification.getNumOfNotification() + 1);
        }
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
        StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(slot.getStaff().getFirst());
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

    @Transactional
    public AllAppointmentAtHomeResponse bookAppointmentAtHome(AppointmentRequest appointmentRequest,
                                                              Authentication authentication,
                                                              List<PatientRequest> patientRequestList,
                                                              PaymentRequest paymentRequest,
                                                              long serviceId,
                                                              long priceId) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        List<Staff> staffList = staffRepository.findAll();
        boolean found = false;

        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        PriceList priceList = priceListRepository.findById(priceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PRICE_NOT_EXISTS));

        if (userBookAppointment.getAddress() == null) {
            throw new RuntimeException("Please update your address before booking.");
        }

        Appointment appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointment == null) {
            throw new RuntimeException("Mapper returned null appointment!");
        }

        // Đăng ký bệnh nhân và nhận danh sách đã đăng ký
        List<Patient> registeredPatients = patientService.registerServiceTest(
                patientRequestList, userBookAppointment, serviceTest);

        // Gắn danh sách bệnh nhân vào appointment
        appointment.setPatients(registeredPatients);

        // Thiết lập liên kết ngược lại: mỗi patient trỏ về appointment
        for (Patient patient : registeredPatients) {
            patient.setAppointment(appointment);
        }

//        for (Staff staff : staffList) {
//            if ("STAFF_AT_HOME".equals(staff.getRole())) {
//                appointment.setStaff(staff);
//                found = true;
//                break;
//            }
//        }
// Lọc ra danh sách nhân viên tại nhà còn hoạt động
        List<Staff> homeStaff = staffList.stream()
                .filter(staff -> "STAFF_AT_HOME".equals(staff.getRole()))
                .collect(Collectors.toList());

        if (homeStaff.isEmpty()) {
            throw new RuntimeException("Không có nhân viên tại nhà khả dụng");
        }

// Chọn nhân viên tiếp theo theo round-robin
        int selectedIndex = staffAssignmentTracker.getNextIndex(homeStaff.size());
        Staff selectedStaff = homeStaff.get(selectedIndex);


// Gán vào appointment
        appointment.setStaff(selectedStaff);

//        if (!found) {
//            throw new RuntimeException("Không có nhân viên trực tại nhà");
//        }
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        appointment.setServices(serviceTest);
        appointment.setAppointmentType(AppointmentType.HOME);
        appointment.setUsers(userBookAppointment);
        appointment.setAppointmentDate(LocalDate.now());

        // Tính giá sau khi giảm (nếu có)

        BigDecimal originalPrice = BigDecimal.valueOf(priceList.getPrice());

        double discountPercent = 0.0;
        LocalDate today = LocalDate.now();

        for (Discount discount : serviceTest.getDiscounts()) {
            if (discount.isActive() &&
                    (today.isEqual(discount.getStartDate()) || today.isAfter(discount.getStartDate())) &&
                    (today.isBefore(discount.getEndDate()) || today.isEqual(discount.getEndDate()))) {
                discountPercent = discount.getDiscountValue(); // kiểu double
                break;
            }
        }

        // Tính finalAmount = originalPrice * (1 - discount/100)
        double amountAsDouble = originalPrice.doubleValue() * (1 - discountPercent / 100);

        // Làm tròn về 2 chữ số sau dấu phẩy nếu muốn
        amountAsDouble = Math.round(amountAsDouble * 100.0) / 100.0;

        // Tạo payment

        KitDeliveryStatus deliveryStatus = new KitDeliveryStatus();
        deliveryStatus.setAppointment(appointment);
        deliveryStatus.setKit(serviceTest.getKit());
        deliveryStatus.setCreateOrderDate(LocalDate.now());
        deliveryStatus.setDeliveryStatus(DeliveryStatus.IN_PROGRESS);
        deliveryStatus.setUsers(userBookAppointment);
        kitDeliveryStatusRepository.save(deliveryStatus);

        double totalPrice = priceList.getPrice();
        // Tạo payment
        Payment payment = new Payment();
        payment.setAmount(totalPrice); // dùng tổng giá
        payment.setAppointment(appointment);
        payment.setUsers(userBookAppointment);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        paymentRepository.save(payment);

        // Lưu appointment
        Appointment saved = appointmentRepository.save(appointment);

        // Chuẩn bị dữ liệu trả về
        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(saved);
        KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(serviceTest.getKit());
        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(userBookAppointment);
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(serviceTest);
        List<PatientAppointmentResponse> patientAppointmentResponses =
                appointmentMapper.toPatientAppointmentService(registeredPatients);

        PriceAppointmentResponse priceAppointmentResponses = new PriceAppointmentResponse();
        priceAppointmentResponses.setPriceId(priceList.getPriceId());
        priceAppointmentResponses.setTime(priceList.getTime());
        priceAppointmentResponses.setPrice(totalPrice);
        List<PriceAppointmentResponse> priceAppointmentResponsesList = List.of(priceAppointmentResponses);

        // Gộp kết quả
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
                                                                    long serviceId) {
        Users userBookAppointment = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));


        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.PENDING);
        appointment.setNote("Cảm ơn quý khách đã tin tưởng dịch vụ của chúng tôi. " +
                "Bộ kit sẽ được gửi trong thời gian sớm nhất");

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

    //staff lấy appointment đó để xác nhận
    public List<AllAppointmentAtCenterResponse> getAppointmentByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();

        for (Appointment appointment : staff.getAppointments()) {
            // ✅ CHỈ lấy lịch tại trung tâm CÓ NGÀY TRONG TƯƠNG LAI
            if (appointment.getAppointmentType() == AppointmentType.CENTER &&
                    appointment.getSlot().getSlotDate().isAfter(LocalDate.now())) {

                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                List<StaffAppointmentResponse> staffs = List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
                List<SlotAppointmentResponse> slot = List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot()));
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                List<LocationAppointmentResponse> locations = List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation()));
                List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());
                UserAppointmentResponse user = appointmentMapper.toUserAppointmentResponse(appointment.getUsers());
                RoomAppointmentResponse room = new RoomAppointmentResponse();
                room.setRoomName(appointment.getSlot().getRoom().getRoomName());

                AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
                centerResponse.setShowAppointmentResponse(show);
                centerResponse.setStaffAppointmentResponse(staffs);
                centerResponse.setSlotAppointmentResponse(slot);
                centerResponse.setServiceAppointmentResponses(services);
                centerResponse.setLocationAppointmentResponses(locations);
                centerResponse.setRoomAppointmentResponse(room);
                centerResponse.setPaymentAppointmentResponse(payments);
                centerResponse.setUserAppointmentResponses(user);

                centerList.add(centerResponse);

            }
        }

        return centerList;
    }


    // shipper lay ra de xac nhan dk tai home
    public List<AllAppointmentAtHomeResponse> getAppointmentAtHome(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : staff.getAppointments()) {
            if (appointment.getAppointmentType() == AppointmentType.HOME &&
                    appointment.getServices().getServiceType() == ServiceType.CIVIL &&
                    appointment.getAppointmentStatus().equals(AppointmentStatus.PENDING)) {

                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                KitAppointmentResponse kit = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
                List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());
                UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(appointment.getUsers());
                AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                homeResponse.setShowAppointmentResponse(show);
                homeResponse.setServiceAppointmentResponses(services);
                homeResponse.setKitAppointmentResponse(kit);
//                homeResponse.setPaymentAppointmentResponses(payments);
                homeResponse.setUserAppointmentResponses(userAppointmentResponse);
                homeList.add(homeResponse);
            }
        }

        return homeList;
    }


    @Transactional
    public void addStaffToAppointment(long staffId, long appointmentId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        if (!staff.getRole().equals("STAFF_AT_HOME")) {
            throw new RuntimeException("Staff at home not exist");
        }
        appointment.setStaff(staff);
    }

    //staff xem ds cuar slot ddos va lay mau
    // thiếu update
    public List<AllAppointmentAtCenterResponse> getAppointmentBySlot(long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        if (slot.getSlotStatus() == null) {
            throw new RuntimeException("Không có slot nào được booked");
        }
        List<Appointment> appointmentList = slot.getAppointment();
        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)
                    && appointment.getSlot().getSlotStatus().equals(SlotStatus.BOOKED)) {

                // Lọc bệnh nhân có trạng thái REGISTERED
                List<Patient> registeredPatients = appointment.getPatients().stream()
                        .filter(p -> p.getPatientStatus() == PatientStatus.REGISTERED)
                        .collect(Collectors.toList());

                // Map các thông tin liên quan
                List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                        .map(appointmentMapper::toPatientAppointment)
                        .collect(Collectors.toList());

                AllAppointmentAtCenterResponse response = new AllAppointmentAtCenterResponse();
                response.setShowAppointmentResponse(appointmentMapper.toShowAppointmentResponse(appointment));
                response.setUserAppointmentResponse(
                        List.of(appointmentMapper.toUserAppointmentResponse(appointment.getUsers()))
                );
                response.setStaffAppointmentResponse(
                        List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()))
                );
                response.setSlotAppointmentResponse(
                        List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot()))
                );
                response.setServiceAppointmentResponses(
                        List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()))
                );
                response.setRoomAppointmentResponse(
                        appointmentMapper.toRoomAppointmentResponse(appointment.getSlot().getRoom())
                );
                response.setPatientAppointmentResponse(patientResponses);

                // Nếu bạn muốn thêm location/price:
                if (appointment.getLocation() != null) {
                    response.setLocationAppointmentResponses(
                            List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation()))
                    );
                }
                if (appointment.getServices() != null && appointment.getServices().getPriceLists() != null) {
                    response.setPriceAppointmentResponse(
                            appointmentMapper.toPriceAppointmentResponse(appointment.getServices().getPriceLists())
                    );
                }

                responses.add(response);
            }
        }

        return responses;
    }  //staff xem ds cuar slot ddos va lay mau

    public void updatePatientStatus(long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));
    }

    //staff lấy đơn dang kis tai nha nhap mau
    public List<AllAppointmentAtCenterResponse> getAppointmentAtHomeToGetSample(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if (!staff.getRole().equals("STAFF_AT_HOME")) {
            throw new RuntimeException("staff at home not exist");
        }

        List<Appointment> appointmentList = staff.getAppointments();
        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {

                // Lọc bệnh nhân có trạng thái REGISTERED
                List<Patient> registeredPatients = appointment.getPatients().stream()
                        .filter(p -> p.getPatientStatus() == PatientStatus.REGISTERED)
                        .collect(Collectors.toList());

                // Map các thông tin liên quan
                List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                        .map(appointmentMapper::toPatientAppointment)
                        .collect(Collectors.toList());

                AllAppointmentAtCenterResponse response = new AllAppointmentAtCenterResponse();
                response.setShowAppointmentResponse(appointmentMapper.toShowAppointmentResponse(appointment));
                response.setUserAppointmentResponse(
                        List.of(appointmentMapper.toUserAppointmentResponse(appointment.getUsers()))
                );
                response.setStaffAppointmentResponse(
                        List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()))
                );
                response.setServiceAppointmentResponses(
                        List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()))
                );
                response.setPatientAppointmentResponse(patientResponses);

                if (appointment.getServices() != null && appointment.getServices().getPriceLists() != null) {
                    response.setPriceAppointmentResponse(
                            appointmentMapper.toPriceAppointmentResponse(appointment.getServices().getPriceLists())
                    );
                }

                responses.add(response);
            }
        }

        return responses;
    }


    @Transactional
    public void updateAppointmentStatus(long slotId,
                                        long patientId,
                                        AppointmentRequest appointmentRequest,
                                        PatientRequest patientRequest) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

        List<Appointment> appointmentList = slot.getAppointment();
        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
                if (patientRequest.getPatientStatus() != null) {
                    patient.setPatientStatus(patientRequest.getPatientStatus());
                }
                if (appointmentRequest.getAppointmentStatus() != null) {
                    appointment.setAppointmentStatus(appointmentRequest.getAppointmentStatus());
                }
                if (appointment.getNote() != null) {
                    appointment.setNote(appointmentRequest.getNote());
                }
            }
        }

    }

    //user view appointment info
    public AllAppointmentResponse getAllAppointments(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        appointmentList.sort(Comparator.comparingInt(a -> {
            return switch (a.getAppointmentStatus()) {
                case PENDING -> 0;
                case CONFIRMED -> 1;
                case COMPLETED -> 2;
                default -> 3;
            };
        }));
        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.PENDING) ||
                    appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED) ||
                    appointment.getAppointmentStatus().equals(AppointmentStatus.COMPLETED)) {
                if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
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

                } else if (
                        appointment.getAppointmentType() == AppointmentType.HOME &&
                                appointment.getServices().getServiceType() == ServiceType.CIVIL) {

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
        }

        return new AllAppointmentResponse(centerList, homeList);
    }

    public AllAppointmentResponse getHistory(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);

        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
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

            } else if (
                    appointment.getAppointmentType() == AppointmentType.HOME &&
                            appointment.getServices().getServiceType() == ServiceType.CIVIL) {

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

        return new AllAppointmentResponse(centerList, homeList);
    }

    public List<AllAppointmentResult> getAllAppointmentsResult(Authentication authentication, long appointmentId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Appointment appointment1 = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
        List<AllAppointmentResult> results = new ArrayList<>();


        if (appointment1.getAppointmentStatus().equals(AppointmentStatus.COMPLETED)) {
            List<PatientAppointmentResponse> patientAppointmentResponse = appointmentMapper.toPatientAppointmentService(appointment1.getPatients());
            ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(appointment1.getServices());
            ShowAppointmentResponse appointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment1);
            StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(appointment1.getStaff());
            UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(appointment1.getUsers());
            List<SampleAppointmentResponse> sampleAppointmentResponse = appointmentMapper.toSampleAppointmentResponse(appointment1.getSampleList());
            List<ResultAppointmentResponse> resultResponses = new ArrayList<>();
            List<ResultDetailAppointmentResponse> resultDetailAppointmentResponses = new ArrayList<>();
            List<ResultLocusAppointmentResponse> resultLocusAppointmentResponses = new ArrayList<>();

            for (Result result : appointment1.getResults()) {
                if (!result.getResultStatus().equals(ResultStatus.COMPLETED)) {
                    throw new RuntimeException("Kết quả chưa có");
                }

                ResultAppointmentResponse resultAppointmentResponse = appointmentMapper.toResultAppointmentResponse(result);
                ResultDetailAppointmentResponse resultDetailAppointmentResponse = appointmentMapper.toResultDetailAppointmentResponse(result.getResultDetail());

                resultResponses.add(resultAppointmentResponse);
                resultDetailAppointmentResponses.add(resultDetailAppointmentResponse);

                for (ResultLocus resultLocus : result.getResultDetail().getResultLoci()) {
                    ResultLocusAppointmentResponse locusResponse = appointmentMapper.toResultLocusAppointmentResponse(resultLocus);
                    resultLocusAppointmentResponses.add(locusResponse);
                }
            }

            AllAppointmentResult result = new AllAppointmentResult();
            result.setShowAppointmentResponse(appointmentResponse);
            result.setStaffAppointmentResponse(staffAppointmentResponse);
            result.setServiceAppointmentResponses(serviceAppointmentResponse);
            result.setResultAppointmentResponse(resultResponses);
            result.setResultDetailAppointmentResponse(resultDetailAppointmentResponses);
            result.setResultLocusAppointmentResponse(resultLocusAppointmentResponses);
            result.setPatientAppointmentResponse(patientAppointmentResponse);
            result.setSampleAppointmentResponse(sampleAppointmentResponse);
            result.setUserAppointmentResponse(userAppointmentResponse);
            results.add(result);

        }

        return results;
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
        for (Patient patient : appointment.getPatients()) {
            patient.setPatientStatus(PatientStatus.CANCELLED);
        }
        appointment.getSlot().setSlotStatus(SlotStatus.AVAILABLE);
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
    }

    public List<AllAppointmentAtHomeManagerResponse> getAppointmentAtHomeForAdmin() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<AllAppointmentAtHomeManagerResponse> resultList = new ArrayList<>();

        for (Appointment appointment : appointments) {
            // Chỉ lấy những appointment tại nhà
            if (appointment.getAppointmentType() == AppointmentType.HOME) {
                AllAppointmentAtHomeManagerResponse response = new AllAppointmentAtHomeManagerResponse();
                response.setAppointmentResponse(appointmentMapper.toShowAppointmentResponse(appointment));
                response.setStaffAppointmentResponse(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
                resultList.add(response);
            }
        }

        return resultList;
    }

    //staff lay ra de thanh toan bang tien mat
    public List<AllAppointmentAtCenterUserResponse> getAppointmentOfUser(Authentication authentication, UserPhoneRequest userRequest) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if (!staff.getRole().equals("CASHIER")) {
            throw new RuntimeException("Bạn không phải là thu ngân");
        }
        Users userRegister = userRepository.findByPhone(userRequest.getPhone())
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_EXISTED));
        List<AllAppointmentAtCenterUserResponse> appointmentResponses = new ArrayList<>();
        for (Appointment appointment : userRegister.getAppointments()) {
            if (appointment.getAppointmentType().equals(AppointmentType.CENTER) &&
                    appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
                for (Payment payment : appointment.getPayments()) {
                    if (payment.getGetPaymentStatus().equals(PaymentStatus.PENDING)) {
                        ShowAppointmentResponse showAppointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment);
                        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(appointment.getServices());
                        UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(appointment.getUsers());
                        List<PriceAppointmentResponse> priceAppointmentResponse = appointmentMapper.toPriceAppointmentResponse(appointment.getServices().getPriceLists());
                        List<PaymentAppointmentResponse> paymentAppointmentResponse = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());

                        AllAppointmentAtCenterUserResponse allAppointmentAtCenterUserResponse = new AllAppointmentAtCenterUserResponse();
                        allAppointmentAtCenterUserResponse.setShowAppointmentResponse(showAppointmentResponse);
                        allAppointmentAtCenterUserResponse.setServiceAppointmentResponses(serviceAppointmentResponse);
                        allAppointmentAtCenterUserResponse.setUserAppointmentResponse(userAppointmentResponse);
                        allAppointmentAtCenterUserResponse.setPriceAppointmentResponse(priceAppointmentResponse);
                        allAppointmentAtCenterUserResponse.setPaymentAppointmentResponse(paymentAppointmentResponse);
                        appointmentResponses.add(allAppointmentAtCenterUserResponse);
                    }
                }
            }
        }
        return appointmentResponses;
    }

    @Transactional
    public void payAppointment(long paymentId, long appointmentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setNote("Đã thanh toán");
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setTransitionDate(LocalDate.now());
        createPayment(paymentId, appointment.getServices().getServiceId());

    }

    @Transactional
    public CreatePaymentRequest createPayment(long paymentId, long serviceId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));
        if (!payment.getPaymentMethod().equals(PaymentMethod.CASH)) {
            throw new RuntimeException("Vui lòng chọn phương pháp thanh toán là Cash");
        }
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        // ✅ Tạo mã giao dịch duy nhất (txnRef)
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20); // max 20 ký tự

        // ✅ Tạo Invoice
        Invoice invoice = new Invoice();
        invoice.setTxnRef(txnRef);
        invoice.setBankCode(generateRandomBankCode()); // sửa dòng này
        invoice.setAmount((long) payment.getAmount());
        invoice.setOrderInfo(serviceTest.getServiceName());
        invoice.setTransactionStatus(TransactionStatus.SUCCESS);
        invoice.setCreatedDate(LocalDateTime.now());
        invoice.setPayDate(LocalDateTime.now());
        invoice.setResponseCode("00");

        // Gán quan hệ trước
        invoice.setPayment(payment);
        invoice.setServiceTest(serviceTest);

        // ✅ Gán appointment từ payment (sau khi đã gán payment ở trên)
        if (payment.getAppointment() != null) {
            invoice.setAppointment(payment.getAppointment());
        }
        // ✅ Lưu hóa đơn
        invoiceRepository.save(invoice);

        // ✅ Tạo request để trả về cho client tạo URL thanh toán
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
        createPaymentRequest.setAmount(payment.getAmount());
        createPaymentRequest.setOrderInfo(serviceTest.getServiceName());
        createPaymentRequest.setTxnRef(txnRef); // rất quan trọng
        createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment");

        return createPaymentRequest;
    }

    private String generateRandomBankCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int length = 6;
        StringBuilder result = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            result.append(characters.charAt(random.nextInt(characters.length())));
        }
        return result.toString();
    }
}
//    public List<AppointmentAtHomeInfoDTO> getAppointmentAtHomeForAdmin() {
//        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentAtHomeInfoDTO(" +
//                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note, s.appointmentType, s.staff.staffId, s.services.serviceId, s.users.userId) " +
//                "FROM Appointment s WHERE " +
//                "s.appointmentDate >= CURRENT_DATE " +
//                "AND s.appointmentType=:appointmentType";
//
//        TypedQuery<AppointmentAtHomeInfoDTO> query = entityManager.createQuery(jpql, AppointmentAtHomeInfoDTO.class);
//        query.setParameter("appointmentType", AppointmentType.HOME);
//        return query.getResultList();
//    }

//    public AllAppointmentAtHomeResponse getAppointmentAtHomeForAdmin() {
//        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentAtHomeInfoDTO(" +
//                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note, s.appointmentType, s.staff.staffId, s.services.serviceId, s.users.userId) " +
//                "FROM Appointment s WHERE " +
//                "s.appointmentDate >= CURRENT_DATE " +
//                "AND s.appointmentType=:appointmentType";
//
//        TypedQuery<AppointmentAtHomeInfoDTO> query = entityManager.createQuery(jpql, AppointmentAtHomeInfoDTO.class);
//        query.setParameter("appointmentType", AppointmentType.HOME);
//        return query.getResultList();
//    }


//    public List<AllAppointmentAtCenterResponse> getAppointmentAtCenter(Authentication authentication) {
//        Jwt jwt = (Jwt) authentication.getPrincipal();
//        Long userId = jwt.getClaim("id");
//
//        Users userRegister = userRepository.findById(userId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
//
//        List<Appointment> appointmentList = appointmentRepository.findByUsers_UserId(userId);
//        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
//
//        for (Appointment appointment : appointmentList) {
//            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
//
//                ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
//                List<StaffAppointmentResponse> staff = List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
//                List<SlotAppointmentResponse> slot = List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot()));
//                List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
//                List<LocationAppointmentResponse> locations = List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation()));
//                List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());
//
//                RoomAppointmentResponse room = new RoomAppointmentResponse();
//                room.setRoomName(appointment.getSlot().getRoom().getRoomName());
//
//                AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
//                centerResponse.setShowAppointmentResponse(show);
//                centerResponse.setStaffAppointmentResponse(staff);
//                centerResponse.setSlotAppointmentResponse(slot);
//                centerResponse.setServiceAppointmentResponses(services);
//                centerResponse.setLocationAppointmentResponses(locations);
//                centerResponse.setRoomAppointmentResponse(room);
//                centerResponse.setPaymentAppointmentResponse(payments);
//
//                centerList.add(centerResponse);
//            }
//        }
//
//        return centerList;
//    }
//