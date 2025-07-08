package swp.project.adn_backend.service.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AllSampleResponseMapper;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SampleMapper;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.slot.StaffAssignmentTracker;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SampleService {
    SampleRepository sampleRepository;
    SampleMapper sampleMapper;
    PatientRepository patientRepository;
    StaffRepository staffRepository;
    ServiceTestRepository serviceTestRepository;
    AppointmentRepository appointmentRepository;
    StaffMapper staffMapper;
    AllSampleResponseMapper allSampleResponseMapper;
    AppointmentMapper appointmentMapper;
    private StaffAssignmentTracker staffAssignmentTracker;
    AppointmentService appointmentService;
    SlotRepository slotRepository;

    @Autowired
    public SampleService(SampleRepository sampleRepository, SampleMapper sampleMapper, PatientRepository patientRepository, StaffRepository staffRepository, ServiceTestRepository serviceTestRepository, AppointmentRepository appointmentRepository, StaffMapper staffMapper, AllSampleResponseMapper allSampleResponseMapper, AppointmentMapper appointmentMapper, StaffAssignmentTracker staffAssignmentTracker, AppointmentService appointmentService, SlotRepository slotRepository) {
        this.sampleRepository = sampleRepository;
        this.sampleMapper = sampleMapper;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
        this.staffMapper = staffMapper;
        this.allSampleResponseMapper = allSampleResponseMapper;
        this.appointmentMapper = appointmentMapper;
        this.staffAssignmentTracker = staffAssignmentTracker;
        this.appointmentService = appointmentService;
        this.slotRepository = slotRepository;
    }

    @Transactional
    public SampleResponse collectSample(long patientId,
                                        long serviceId,
                                        long appointmentId,
                                        SampleRequest sampleRequest,
                                        Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        List<Staff> labTechnician = staffRepository.findAll();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));
        if (serviceTest.getKit().getQuantity() == 0) {
            throw new RuntimeException("Cơ sở đã hết số lượng kit");
        }
        Sample sample = sampleMapper.toSample(sampleRequest);
        sample.setSampleStatus(SampleStatus.COLLECTED);
        sample.setCollectionDate(LocalDate.now());
        sample.setSampleCode(generateSampleCode());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        patient.setPatientStatus(PatientStatus.SAMPLE_COLLECTED);
        if (serviceTest.getKit().getQuantity() > 0) {
            serviceTest.getKit().setQuantity(serviceTest.getKit().getQuantity() - 1);
        }
//        List<Staff> labTechnician1 = labTechnician.stream()
//                .filter(lab -> "LAB_TECHNICIAN".equals(lab.getRole()))
//                .collect(Collectors.toList());
//
//        if (labTechnician1.isEmpty()) {
//            throw new RuntimeException("Không có nhân viên phòng lab");
//        }

// Đảm bảo index luôn nằm trong giới hạn danh sách
//        int selectedIndex = staffAssignmentTracker.getNextIndex(labTechnician1.size());
//        selectedIndex = selectedIndex % labTechnician1.size(); // fix an toàn
//        Staff selectedStaff = labTechnician1.get(selectedIndex);
//        appointmentService.increaseStaffNotification(selectedStaff);
//        appointment.setStaff(selectedStaff);
        appointment.setNote("Đã lấy mẫu thành công");
        SampleResponse response = sampleMapper.toSampleResponse(sampleRepository.save(sample));
        return response;
    }

    @Transactional
    public SampleResponse collectSampleAtHome(long patientId,
                                              long serviceId,
                                              long appointmentId,
                                              SampleRequest sampleRequest,
                                              Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        List<Staff> labTechnician = staffRepository.findAll();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Sample sample = sampleMapper.toSample(sampleRequest);
        sample.setSampleStatus(SampleStatus.COLLECTED);
        sample.setCollectionDate(LocalDate.now());
        sample.setSampleCode(generateSampleCode());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        patient.setPatientStatus(PatientStatus.SAMPLE_COLLECTED);


        appointment.setNote("Đã lấy mẫu thành công");
        SampleResponse response = sampleMapper.toSampleResponse(sampleRepository.save(sample));
        return response;
    }


    public String generateSampleCode() {
        char firstChar = (char) ('A' + new Random().nextInt(26));
        int numberPart = new Random().nextInt(10000);
        char lastChar = (char) ('A' + new Random().nextInt(26));
        return String.format("%c%04d%c", firstChar, numberPart, lastChar);
    }

    public List<AllSampleResponse> getAllSampleOfPatient(Authentication authentication,
                                                         long appointmentId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        List<Sample> sampleList = appointment.getSampleList();
        List<AllSampleResponse> allSampleResponseList = new ArrayList<>();
        for (Sample sample : sampleList) {

            SampleResponse sampleResponse = sampleMapper.toSampleResponse(sample);
            StaffSampleResponse staffSampleResponse = allSampleResponseMapper.toStaffSampleResponse(sample.getStaff());
            PatientSampleResponse patientSampleResponse = allSampleResponseMapper.toPatientSampleResponse(sample.getPatient());
            AppointmentSampleResponse appointmentSampleResponse = appointmentMapper.toAppointmentSampleResponse(appointment);
            AllSampleResponse allSampleResponse = new AllSampleResponse();
            allSampleResponse.setAppointmentSampleResponse(appointmentSampleResponse);
            allSampleResponse.setSampleResponse(sampleResponse);
            allSampleResponse.setStaffSampleResponse(staffSampleResponse);
            allSampleResponse.setPatientSampleResponse(patientSampleResponse);
            allSampleResponseList.add(allSampleResponse);
        }
        return allSampleResponseList;
    }

    //check sample có hợp lệ không nếu không chuyển trạng thái
    @Transactional
    public void updateSampleStatus(long sampleId,
                                   long appointmentId,
                                   SampleRequest sampleRequest) {
        List<Staff> labTechnician = staffRepository.findAll();

        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        sample.setSampleStatus(sampleRequest.getSampleStatus());
        if (sampleRequest.getSampleStatus().equals(SampleStatus.DAMAGED)) {
            appointment.setNote("Mẫu của bạn bị hỏng trong quá trình xử lý. bạn vui lòng đến cơ sở để lấy lại mẫu");
//            appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.PENDING);
            appointment.getSlot().setSlotStatus(SlotStatus.COMPLETED);
            appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
            appointment.setAppointmentType(AppointmentType.CENTER);
//            appointment.setLocation(appointment.getLocation());
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
//        if (sampleRequest.getSampleStatus().equals(SampleStatus.REJECTED)) {
//            appointment.setNote("Mẫu của bạn không đạt yêu cầu trong quá trình xử lý. Chúng tôi sẽ gửi lại bộ kit đến địa chỉ của bạn để tiến hành thu mẫu lại trong thời gian sớm nhất.");
//            appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.PENDING);
//        }
        if (sampleRequest.getSampleStatus().equals(SampleStatus.RECEIVED)) {
            for (Patient patient : appointment.getPatients()) {
                patient.setPatientStatus(PatientStatus.IN_ANALYSIS);
            }
            appointment.setNote("Phòng xét nghiệm đã nhận mẫu");
            List<Staff> labTechnician1 = labTechnician.stream()
                    .filter(lab -> "LAB_TECHNICIAN".equals(lab.getRole()))
                    .collect(Collectors.toList());

            if (labTechnician1.isEmpty()) {
                throw new RuntimeException("Không có nhân viên phòng lab");
            }

// Đảm bảo index luôn nằm trong giới hạn danh sách
            int selectedIndex = staffAssignmentTracker.getNextIndex(labTechnician1.size());
            selectedIndex = selectedIndex % labTechnician1.size(); // fix an toàn
            Staff selectedStaff = labTechnician1.get(selectedIndex);
//        appointmentService.increaseStaffNotification(selectedStaff);
            appointment.setStaff(selectedStaff);
        }

        switch (sampleRequest.getSampleStatus()) {
            case IN_TRANSIT:
                appointment.setNote("Đang vận chuyển đến phòng xét nghiệm");
                break;
            case TESTING:
                appointment.setNote("Mẫu đang được xét nghiệm");
                break;
            case COMPLETED:
                appointment.setNote("Đã xét nghiệm xong");
                break;
            case REJECTED:
                appointment.setNote("Mẫu bị từ chối");
                break;
        }

    }

    @Transactional
    public void deleteSample(long sampleId) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        sampleRepository.findById(sampleId);
    }
}
