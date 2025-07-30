package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.AppointmentAtHomeInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoForManagerDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
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
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentService {
    WalletRepository walletRepository;
    WalletTransactionRepository walletTransactionRepository;
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
    public AppointmentService(WalletRepository walletRepository, WalletTransactionRepository walletTransactionRepository, AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository, EntityManager entityManager, StaffRepository staffRepository, SlotMapper slotMapper, SlotRepository slotRepository, LocationRepository locationRepository, EmailService emailService, PatientService patientService, PriceListRepository priceListRepository, PaymentRepository paymentRepository, KitRepository kitRepository, PatientRepository patientRepository, KitDeliveryStatusRepository kitDeliveryStatusRepository, InvoiceRepository invoiceRepository, StaffAssignmentTracker staffAssignmentTracker, NotificationRepository notificationRepository) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
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
        appointment.setNote("Đơn đăng ký đã được xác nhận");
        if (slot.getStaff() != null) {
            for (Staff staff : slot.getStaff()) {
                if ("SAMPLE_COLLECTOR".equals(staff.getRole())) {
                    appointment.setStaff(staff);
                    break;
                }
            }
        }

        appointment.setServices(serviceTest);
        appointment.setCreatedAt(LocalDateTime.now());
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
        payment.setGetPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        paymentRepository.save(payment);

        if (payment.getPaymentMethod().equals(PaymentMethod.CASH)) {
            appointment.setNote("Vui lòng đến quầy thu ngân để thanh toán dịch vụ. " +
                    "Bạn chỉ cần cung cấp số điện thoại đã đăng ký để nhân viên hỗ trợ thanh toán nhanh chóng.");
        }
        if (payment.getPaymentMethod().equals(PaymentMethod.CASH)) {
            appointment.setNote("Bạn hãy kiểm tra số dư trước khi thanh toán");
        }
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

        allAppointmentAtCenterResponse.setUserAppointmentResponse(
                userAppointmentResponse != null ? List.of(userAppointmentResponse) : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setStaffAppointmentResponse(
                staffAppointmentResponses != null ? staffAppointmentResponses : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setSlotAppointmentResponse(
                slotAppointmentResponse != null ? List.of(slotAppointmentResponse) : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setRoomAppointmentResponse(
                roomAppointmentResponse != null ? roomAppointmentResponse : new RoomAppointmentResponse()
        );

        allAppointmentAtCenterResponse.setServiceAppointmentResponses(
                serviceAppointmentResponse != null ? List.of(serviceAppointmentResponse) : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setPatientAppointmentResponse(
                patientAppointmentResponses != null ? patientAppointmentResponses : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setLocationAppointmentResponses(
                locationAppointmentResponse != null ? List.of(locationAppointmentResponse) : Collections.emptyList()
        );

        allAppointmentAtCenterResponse.setPriceAppointmentResponse(
                priceAppointmentResponse != null ? priceAppointmentResponse : Collections.emptyList()
        );

        emailService.sendAppointmentAtCenterDetailsEmail(userBookAppointment.getEmail(), allAppointmentAtCenterResponse);


        appointmentMapper.toAppointmentResponse(saved);
        return allAppointmentAtCenterResponse;
    }


    @Scheduled(fixedRate = 300000) // Kiểm tra mỗi 5 phút (300000 ms)
    @Transactional
    public void cancelUnpaidAppointmentsAfter24Hours() {
        LocalDateTime now = LocalDateTime.now();
        List<Appointment> unpaidAppointments = appointmentRepository
                .findByAppointmentStatusAndGetPaymentStatus(AppointmentStatus.CONFIRMED, PaymentStatus.PENDING);

        for (Appointment appointment : unpaidAppointments) {
            LocalDateTime createdTime = appointment.getCreatedAt();

            if (createdTime != null && Duration.between(createdTime, now).toHours() >= 24) {
                for (Payment payment : appointment.getPayments()) {
                    if (!payment.getPaymentMethod().equals(PaymentMethod.CASH)) {
                        payment.setGetPaymentStatus(PaymentStatus.EXPIRED);
                        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
                        appointment.setNote("Hệ thống đã tự động hủy cuộc hẹn do quá thời gian thanh toán quy định (24 giờ).");
                    }
                }

                appointmentRepository.save(appointment);
            }
        }
    }




    @Transactional
    public void increaseStaffNotification(Staff staff) {
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
        appointment.setNote("Đang đợi xác nhận");
        appointment.setCreatedAt(LocalDateTime.now());

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
        deliveryStatus.setStaff(selectedStaff);
        kitDeliveryStatusRepository.save(deliveryStatus);

        double totalPrice = priceList.getPrice();
        // Tạo payment
        Payment payment = new Payment();
        payment.setAmount(amountAsDouble); // dùng tổng giá
        payment.setAppointment(appointment);
        payment.setUsers(userBookAppointment);
        payment.setGetPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        paymentRepository.save(payment);
        if (payment.getPaymentMethod().equals(PaymentMethod.CASH)) {
            appointment.setNote("Bạn hãy kiểm tra số dư trước khi thanh toán");
        }
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
        emailResponse.setUserAppointmentResponse(
                userAppointmentResponse != null ? List.of(userAppointmentResponse) : Collections.emptyList()
        );
        emailResponse.setServiceAppointmentResponses(
                serviceAppointmentResponse != null ? List.of(serviceAppointmentResponse) : Collections.emptyList()
        );
        emailResponse.setPatientAppointmentResponse(
                patientAppointmentResponses != null ? patientAppointmentResponses : Collections.emptyList()
        );
        emailResponse.setKitAppointmentResponse(kitAppointmentResponse);
        emailResponse.setPriceAppointmentResponse(
                priceAppointmentResponsesList != null ? priceAppointmentResponsesList : Collections.emptyList()
        );

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
        if (serviceTest.getKit().getQuantity() == 0) {
            throw new RuntimeException("Cơ sở đã hết số lượng kit");
        }
        if (serviceTest.getKit().getQuantity() > 0) {
            serviceTest.getKit().setQuantity(serviceTest.getKit().getQuantity() - 1);
        }
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
    public AllAppointmentResponse getAppointmentByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if (!staff.getRole().equals("LAB_TECHNICIAN")) {
            throw new RuntimeException("Bạn không phải là nhân viên phòng lab");
        }
        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : staff.getAppointments()) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
                if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    RoomAppointmentResponse room = new RoomAppointmentResponse();
                    room.setRoomName(appointment.getSlot().getRoom().getRoomName());
                    // Lọc bệnh nhân có trạng thái REGISTERED
                    List<Patient> registeredPatients = appointment.getPatients();
//                            stream()
//                            .filter(p -> p.getPatientStatus() == PatientStatus.SAMPLE_COLLECTED)
//                            .collect(Collectors.toList());

                    // Map các thông tin liên quan
                    List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                            .map(appointmentMapper::toPatientAppointment)
                            .collect(Collectors.toList());
                    KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
                    AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
                    centerResponse.setShowAppointmentResponse(show);
                    centerResponse.setServiceAppointmentResponses(services);
                    centerResponse.setPatientAppointmentResponse(patientResponses);
                    centerResponse.setKitAppointmentResponse(kitAppointmentResponse);
                    centerList.add(centerResponse);

                } else if (
                        appointment.getAppointmentType() == AppointmentType.HOME &&
                                appointment.getServices().getServiceType() == ServiceType.CIVIL) {

                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    List<Patient> registeredPatients = appointment.getPatients();
//                           '' stream()
//                            .filter(p -> p.getPatientStatus() == PatientStatus.SAMPLE_COLLECTED)
//                            .collect(Collectors.toList());

                    // Map các thông tin liên quan
                    List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                            .map(appointmentMapper::toPatientAppointment)
                            .collect(Collectors.toList());
                    KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
                    AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                    homeResponse.setShowAppointmentResponse(show);
                    homeResponse.setServiceAppointmentResponses(services);
                    homeResponse.setPatientAppointmentResponse(patientResponses);
                    homeResponse.setKitAppointmentResponse(kitAppointmentResponse);
                    homeList.add(homeResponse);
                }
            }
        }
        return new AllAppointmentResponse(centerList, homeList);
    } //staff lấy appointment đó để xác nhận

    public AllAppointmentResponse getAppointmentAtHomeByStaffId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if (!staff.getRole().equals("STAFF_AT_HOME")) {
            throw new RuntimeException("Bạn không phải là nhân viên vận chuyển");
        }
        List<AllAppointmentAtCenterResponse> centerList = new ArrayList<>();
        List<AllAppointmentAtHomeResponse> homeList = new ArrayList<>();

        for (Appointment appointment : staff.getAppointments()) {
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {
                if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    RoomAppointmentResponse room = new RoomAppointmentResponse();
                    room.setRoomName(appointment.getSlot().getRoom().getRoomName());
                    // Lọc bệnh nhân có trạng thái REGISTERED
                    List<Patient> registeredPatients = appointment.getPatients().
                            stream()
                            .filter(p -> p.getPatientStatus() == PatientStatus.SAMPLE_COLLECTED)
                            .collect(Collectors.toList());

                    // Map các thông tin liên quan
                    List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                            .map(appointmentMapper::toPatientAppointment)
                            .collect(Collectors.toList());

                    AllAppointmentAtCenterResponse centerResponse = new AllAppointmentAtCenterResponse();
                    centerResponse.setShowAppointmentResponse(show);
                    centerResponse.setServiceAppointmentResponses(services);
                    centerResponse.setPatientAppointmentResponse(patientResponses);
                    centerList.add(centerResponse);

                } else if (
                        appointment.getAppointmentType() == AppointmentType.HOME &&
                                appointment.getServices().getServiceType() == ServiceType.CIVIL) {

                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    List<Patient> registeredPatients = appointment.getPatients().
                            stream()
                            .filter(p -> p.getPatientStatus() == PatientStatus.SAMPLE_COLLECTED)
                            .collect(Collectors.toList());

                    // Map các thông tin liên quan
                    List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                            .map(appointmentMapper::toPatientAppointment)
                            .collect(Collectors.toList());
                    AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                    homeResponse.setShowAppointmentResponse(show);
                    homeResponse.setServiceAppointmentResponses(services);
                    homeResponse.setPatientAppointmentResponse(patientResponses);
                    homeList.add(homeResponse);
                }
            }
        }
        return new AllAppointmentResponse(centerList, homeList);
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

    @Transactional
    public void updateNote(AppointmentRequest appointmentRequest, long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setNote(appointmentRequest.getNote());
    }

    //staff xem ds cuar slot ddos va lay mau
    // thiếu update
    public List<AllAppointmentAtCenterResponse> getAppointmentBySlot(long slotId, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        if (slot.getSlotStatus() == null) {
            throw new RuntimeException("Không có slot nào được booked");
        }
        Staff currentStaff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        boolean isAssigned = slot.getStaff().stream()
                .anyMatch(s -> s.getStaffId() == currentStaff.getStaffId() &&
                        s.getRole().equals("SAMPLE_COLLECTOR"));

        if (!isAssigned) {
            throw new RuntimeException("Bạn Không Có Quyền Truy Cập Trang Này");
        }
        List<Appointment> appointmentList = slot.getAppointment();
        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();

        for (Appointment appointment : appointmentList) {
            boolean isPaidOrRefunded = appointment.getPayments().stream()
                    .anyMatch(payment ->
                            payment.getGetPaymentStatus() == PaymentStatus.PAID ||
                                    payment.getGetPaymentStatus() == PaymentStatus.REFUNDED
                    );

            if (!isPaidOrRefunded) {
                continue; // bỏ qua đơn chưa thanh toán
            }

            // Tiếp tục xử lý appointment này...
            List<Patient> registeredPatients = appointment.getPatients();

            List<PatientAppointmentResponse> patientResponses = registeredPatients.stream()
                    .map(appointmentMapper::toPatientAppointment)
                    .collect(Collectors.toList());

            AllAppointmentAtCenterResponse response = new AllAppointmentAtCenterResponse();
            response.setKitAppointmentResponse(
                    appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit()));
            response.setShowAppointmentResponse(
                    appointmentMapper.toShowAppointmentResponse(appointment));
            response.setUserAppointmentResponse(
                    List.of(appointmentMapper.toUserAppointmentResponse(appointment.getUsers())));
            response.setStaffAppointmentResponse(
                    List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff())));
            response.setSlotAppointmentResponse(
                    List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot())));
            response.setServiceAppointmentResponses(
                    List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices())));
            response.setRoomAppointmentResponse(
                    appointmentMapper.toRoomAppointmentResponse(appointment.getSlot().getRoom()));
            response.setPatientAppointmentResponse(patientResponses);

            if (appointment.getLocation() != null) {
                response.setLocationAppointmentResponses(
                        List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation())));
            }

            if (appointment.getServices() != null && appointment.getServices().getPriceLists() != null) {
                response.setPriceAppointmentResponse(
                        appointmentMapper.toPriceAppointmentResponse(appointment.getServices().getPriceLists()));
            }

            responses.add(response);
        }

//        }

        return responses;
    }  //staff xem ds cuar slot ddos va lay mau

    public void updatePatientStatus(long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));
    }

    //staff lấy đơn dang kis tai nha nhap mau
    public List<AllAppointmentAtCenterResponse> getAppointmentAtHomeToRecordResult(Authentication authentication,
                                                                                   long appointmentId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Staff staff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        if (!staff.getRole().equals("STAFF_AT_HOME")) {
            throw new RuntimeException("Chỉ có nhân viên thu mẫu tại nhà mới có thể lấy");
        }
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        List<AllAppointmentAtCenterResponse> responses = new ArrayList<>();


        if (appointment.getAppointmentStatus().equals(AppointmentStatus.CONFIRMED)) {

            // Lọc bệnh nhân có trạng thái REGISTERED
            List<Patient> registeredPatients = appointment.getPatients();
//                        stream()
//                        .filter(p -> p.getPatientStatus() == PatientStatus.REGISTERED)
//                        .collect(Collectors.toList());

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

        List<Appointment> appointmentList = new ArrayList<>(appointmentRepository.findByUsers_UserId(userId));
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
                    appointment.getAppointmentStatus().equals(AppointmentStatus.COMPLETED)
            ) {
                if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<StaffAppointmentResponse> staff = List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
                    List<SlotAppointmentResponse> slot = List.of(appointmentMapper.toSlotAppointmentResponse(appointment.getSlot()));
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    List<LocationAppointmentResponse> locations = List.of(appointmentMapper.toLocationAppointmentResponse(appointment.getLocation()));
                    List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());
                    System.out.println("Payments raw (entities): " + appointment.getPayments());
                    System.out.println("Payments mapped (DTOs): " + payments);




                    RoomAppointmentResponse room = new RoomAppointmentResponse();
                    if (appointment.getSlot() != null && appointment.getSlot().getRoom() != null) {
                        room.setRoomName(appointment.getSlot().getRoom().getRoomName());
                    } else {
                        room.setRoomName("Unknown Room"); // hoặc giữ null tùy yêu cầu
                    }

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
                    List<StaffAppointmentResponse> staff = List.of(appointmentMapper.toStaffAppointmentResponse(appointment.getStaff()));
                    ShowAppointmentResponse show = appointmentMapper.toShowAppointmentResponse(appointment);
                    List<ServiceAppointmentResponse> services = List.of(appointmentMapper.toServiceAppointmentResponse(appointment.getServices()));
                    KitAppointmentResponse kit = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
                    List<PaymentAppointmentResponse> payments = appointmentMapper.toPaymentAppointmentResponse(appointment.getPayments());

                    AllAppointmentAtHomeResponse homeResponse = new AllAppointmentAtHomeResponse();
                    homeResponse.setStaffAppointmentResponse(staff);
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
            if(appointment.getAppointmentStatus().equals(AppointmentStatus.COMPLETED) ||
            appointment.getAppointmentStatus().equals(AppointmentStatus.REFUND) ||
            appointment.getAppointmentStatus().equals(AppointmentStatus.CANCELLED)){
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

    // manager lay ra de xac nhan
    @Transactional
    public List<AllAppointmentResult> getAllAppointmentsResultForManager(Authentication authentication, long appointmentId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));        Users Manager = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (!Manager.getRoles().contains(Roles.MANAGER.name())) {
            throw new RuntimeException("Chỉ Có Manager mới có quyền xem");
        }


        List<AllAppointmentResult> results = new ArrayList<>();
            if (appointment.getAppointmentStatus().equals(AppointmentStatus.WAITING_MANAGER_APPROVAL)) {
                List<PatientAppointmentResponse> patientAppointmentResponse = appointmentMapper.toPatientAppointmentService(appointment.getPatients());
                ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(appointment.getServices());
                ShowAppointmentResponse appointmentResponse = appointmentMapper.toShowAppointmentResponse(appointment);
                StaffAppointmentResponse staffAppointmentResponse = appointmentMapper.toStaffAppointmentResponse(appointment.getStaff());
                UserAppointmentResponse userAppointmentResponse = appointmentMapper.toUserAppointmentResponse(appointment.getUsers());
                List<SampleAppointmentResponse> sampleAppointmentResponse = appointmentMapper.toSampleAppointmentResponse(appointment.getSampleList());
                List<ResultAppointmentResponse> resultResponses = new ArrayList<>();
                List<ResultDetailAppointmentResponse> resultDetailAppointmentResponses = new ArrayList<>();
                List<ResultLocusAppointmentResponse> resultLocusAppointmentResponses = new ArrayList<>();

                for (Result result : appointment.getResults()) {
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

    @Transactional
    public void updateAppointmentStatusByManager(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setAppointmentStatus(AppointmentStatus.COMPLETED);
        appointment.setNote("Đã có kết quả xét nghiệm");
    }

    @Transactional
    public void cancelledAppointment(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        if (appointment.getAppointmentType().equals(AppointmentType.HOME)) {
            for (Patient patient : appointment.getPatients()) {
                patient.setPatientStatus(PatientStatus.CANCELLED);
            }
            appointment.setNote("Đơn đăng ký đã được hủy");
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
            appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.FAILED);
        }
        if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
            for (Patient patient : appointment.getPatients()) {
                patient.setPatientStatus(PatientStatus.CANCELLED);
            }
            appointment.setNote("Đơn đăng ký đã được hủy");
            appointment.getSlot().setSlotStatus(SlotStatus.AVAILABLE);
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        }

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

    // Lab chứ bấm nút này
    @Transactional
    public void appointmentRefund(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setNote("Lịch hẹn không thể thực hiện do bệnh nhân vắng mặt. Khoản thanh toán sẽ được hoàn lại.");
        if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
            appointment.getSlot().setSlotStatus(SlotStatus.COMPLETED);
        }
        appointment.setAppointmentStatus(AppointmentStatus.WAITING_MANAGER_APPROVAL_REFUND);
    }

    @Transactional
    public void updateAppointmentToGetSampleAgain(long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setNote("Mẫu của bạn bị hỏng trong quá trình xử lý. bạn vui lòng đến cơ sở để lấy lại mẫu");
        appointment.getSlot().setSlotStatus(SlotStatus.COMPLETED);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setAppointmentType(AppointmentType.CENTER);
        // ✅ Tìm slot vào ngày mai
        LocalDate tomorrow = appointment.getAppointmentDate().plusDays(1);
        List<Slot> slotsTomorrow = slotRepository.findBySlotDateAndSlotStatus(
                tomorrow, SlotStatus.AVAILABLE);
        if (!slotsTomorrow.isEmpty()) {
            Slot chosenSlot = slotsTomorrow.get(0);
            appointment.setLocation(chosenSlot.getRoom().getLocation());// Lấy slot đầu tiên ngày mai
            appointment.setSlot(chosenSlot);
            appointment.setAppointmentDate(chosenSlot.getSlotDate());
            chosenSlot.setSlotStatus(SlotStatus.BOOKED);
        } else {
            throw new RuntimeException("Không có slot nào");
        }
    }

    @Transactional
    public void patientCheckIn(long patientId, long appointmentId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        if (appointment.getAppointmentStatus().equals(AppointmentStatus.COMPLETED)) {
            throw new RuntimeException("Đơn này đã hoàn thành, bạn không thể check-in bệnh nhân.");
        }

        // Cập nhật status trực tiếp trong danh sách patients của appointment
        for (Patient p : appointment.getPatients()) {
            if (p.getPatientId() == patientId) {
                p.setPatientStatus(PatientStatus.NO_SHOW);
                break;
            }
        }

        // Nếu đã hoàn tiền rồi thì không làm gì nữa
        if (appointment.getAppointmentStatus().equals(AppointmentStatus.REFUND)) {
            return;
        }

        // Debug: In trạng thái tất cả bệnh nhân
        System.out.println(">>> Patient status list:");
        appointment.getPatients().forEach(p ->
                System.out.println("Patient ID: " + p.getPatientId() + " | Status: " + p.getPatientStatus())
        );

        // Kiểm tra nếu tất cả bệnh nhân đều NO_SHOW
        boolean allNoShow = appointment.getPatients().stream()
                .allMatch(p -> p.getPatientStatus().equals(PatientStatus.NO_SHOW));

        System.out.println(">>> allNoShow = " + allNoShow);

        if (allNoShow) {
            System.out.println(">>> All patients NO_SHOW → Proceeding refund...");

            for (Payment payment : appointment.getPayments()) {
                System.out.println("Payment ID: " + payment.getPaymentId() + " | Status: " + payment.getGetPaymentStatus());

                if (payment.getGetPaymentStatus().equals(PaymentStatus.PAID)) {
                    System.out.println(">>> Refunding payment ID: " + payment.getPaymentId());
                    appointmentRefund(appointmentId);
                }
            }
        }
    }


    @Transactional
    public void payAppointment(long paymentId, long appointmentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        appointment.setNote("Đã thanh toán");
        payment.setGetPaymentStatus(PaymentStatus.PAID);
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

    @Transactional
    public CreatePaymentRequest createPaymentByWallet(long paymentId,
                                                      long serviceId,
                                                      long appointmentId,
                                                      Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.WALLET_INFO_NOT_EXISTS));


        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        if (wallet.getBalance() < payment.getAmount()) {
            throw new RuntimeException("Số dư trong tài khoản không đủ để thanh toán");
        }

        // ✅ Tạo mã giao dịch duy nhất
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20); // max 20 ký tự

        // ✅ Trừ số dư ví trước
        wallet.setBalance(wallet.getBalance() - (long) payment.getAmount());
        wallet.setUpdatedAt(LocalDate.now());

        // ✅ Tạo hóa đơn (invoice)
        Invoice invoice = new Invoice();
        invoice.setTxnRef(txnRef);
        invoice.setBankCode(generateRandomBankCode());
        invoice.setAmount((long) payment.getAmount());
        invoice.setOrderInfo(serviceTest.getServiceName());
        invoice.setTransactionStatus(TransactionStatus.SUCCESS);
        invoice.setCreatedDate(LocalDateTime.now());
        invoice.setPayDate(LocalDateTime.now());
        invoice.setResponseCode("00");
        invoice.setPayment(payment);
        invoice.setServiceTest(serviceTest);
        if (payment.getAppointment() != null) {
            invoice.setAppointment(payment.getAppointment());
        }

        invoiceRepository.save(invoice);

        // ✅ Cập nhật trạng thái appointment & payment
        if (appointment.getAppointmentType().equals(AppointmentType.CENTER)) {
            appointment.setNote("Quý khách vui lòng kiểm tra kỹ ngày, giờ và thứ trong lịch hẹn để đến đúng giờ lấy mẫu. Xin cảm ơn!");

        } else {
            appointment.setNote("Đơn đăng ký đang đợi xác nhận");

        }
        payment.setGetPaymentStatus(PaymentStatus.PAID);
        payment.setTransitionDate(LocalDate.now());

        // ✅ Ghi lại giao dịch trong ví
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setWallet(wallet);
        walletTransaction.setType(TransactionType.PAYMENT);
        walletTransaction.setAmount((long) payment.getAmount());
        walletTransaction.setTimestamp(LocalDateTime.now());
        walletTransaction.setBankCode(generateRandomBankCode());
        walletTransaction.setTransactionStatus(TransactionStatus.SUCCESS);
        walletTransaction.setTxnRef(txnRef);
        walletTransactionRepository.save(walletTransaction);

        // ✅ Trả kết quả cho client
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest();
        createPaymentRequest.setAmount(payment.getAmount());
        createPaymentRequest.setOrderInfo(serviceTest.getServiceName());
        createPaymentRequest.setTxnRef(txnRef);
        createPaymentRequest.setReturnUrlBase("http://localhost:5173/vnpay-payment");

        return createPaymentRequest;
    }

    public List<AppointmentInfoForManagerDTO> getAppointmentToViewResult() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentInfoForManagerDTO(" +
                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note) " +
                "FROM Appointment s " +
                "WHERE s.appointmentStatus = :status";

        TypedQuery<AppointmentInfoForManagerDTO> query = entityManager
                .createQuery(jpql, AppointmentInfoForManagerDTO.class);

        query.setParameter("status", AppointmentStatus.WAITING_MANAGER_APPROVAL);

        return query.getResultList();
    }

    public List<AppointmentInfoForManagerDTO> getAppointmentToRefund() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.AppointmentInfoForManagerDTO(" +
                "s.appointmentId, s.appointmentDate, s.appointmentStatus, s.note) " +
                "FROM Appointment s " +
                "WHERE s.appointmentStatus = :status";

        TypedQuery<AppointmentInfoForManagerDTO> query = entityManager
                .createQuery(jpql, AppointmentInfoForManagerDTO.class);

        query.setParameter("status", AppointmentStatus.WAITING_MANAGER_APPROVAL_REFUND);

        return query.getResultList();
    }

    public static String generateRandomBankCode() {
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
