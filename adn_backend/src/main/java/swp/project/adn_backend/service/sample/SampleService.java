package swp.project.adn_backend.service.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.KitAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.ServiceAppointmentResponse;
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
        sample.setCollectionDate(LocalDate.now());
        sample.setSampleCode(generateSampleCode());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        sample.setSampleStatus(SampleStatus.COLLECTED);
        patient.setPatientStatus(PatientStatus.SAMPLE_COLLECTED);
        if (serviceTest.getKit().getQuantity() > 0) {
            serviceTest.getKit().setQuantity(serviceTest.getKit().getQuantity() - 1);
        }
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
        sample.setCollectionDate(LocalDate.now());
        sample.setSampleCode(generateSampleCode());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        patient.setPatientStatus(PatientStatus.SAMPLE_COLLECTED);


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
        Staff staff=staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        List<Sample> sampleList = appointment.getSampleList();
        List<AllSampleResponse> allSampleResponseList = new ArrayList<>();
        for (Sample sample : sampleList) {
            if (!sample.getSampleStatus().equals(SampleStatus.REJECTED)) {
                if (staff.getRole().equals("LAB_TECHNICIAN")) {
                    // ✅ Lab chỉ xem sample đã nhận
                    if (sample.getSampleStatus().equals(SampleStatus.RECEIVED)) {
                        allSampleResponseList.add(buildSampleResponse(sample, appointment));
                    }
                } else {
                    // ✅ Các vai trò khác thấy tất cả (trừ sample bị từ chối)
                    allSampleResponseList.add(buildSampleResponse(sample, appointment));
                }
            }
        }
        return allSampleResponseList;
    }
    private AllSampleResponse buildSampleResponse(Sample sample, Appointment appointment) {
        SampleResponse sampleResponse = sampleMapper.toSampleResponse(sample);
        StaffSampleResponse staffSampleResponse = allSampleResponseMapper.toStaffSampleResponse(sample.getStaff());
        PatientSampleResponse patientSampleResponse = allSampleResponseMapper.toPatientSampleResponse(sample.getPatient());
        AppointmentSampleResponse appointmentSampleResponse = appointmentMapper.toAppointmentSampleResponse(appointment);
        KitAppointmentResponse kitAppointmentResponse = appointmentMapper.toKitAppointmentResponse(appointment.getServices().getKit());
        ServiceAppointmentResponse serviceAppointmentResponse = appointmentMapper.toServiceAppointmentResponse(appointment.getServices());

        AllSampleResponse allSampleResponse = new AllSampleResponse();
        allSampleResponse.setSampleResponse(sampleResponse);
        allSampleResponse.setStaffSampleResponse(staffSampleResponse);
        allSampleResponse.setPatientSampleResponse(patientSampleResponse);
        allSampleResponse.setAppointmentSampleResponse(appointmentSampleResponse);
        allSampleResponse.setKitAppointmentResponse(kitAppointmentResponse);
        allSampleResponse.setServiceAppointmentResponse(serviceAppointmentResponse);
        return allSampleResponse;
    }

    //check sample có hợp lệ không nếu không chuyển trạng thái
    @Transactional
    public void updateSampleStatus(long sampleId,
                                   long appointmentId,
                                   SampleRequest sampleRequest) {
        List<Staff> labTechnicians = staffRepository.findAll();

        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        SampleStatus current = sample.getSampleStatus();
        SampleStatus next = sampleRequest.getSampleStatus();

        // ✅ Gán trạng thái mới — bắt buộc để trigger dirty checking
        sample.setSampleStatus(next);

        // Ràng buộc: chỉ cho phép chuyển tiếp trong COLLECTED → IN_TRANSIT → RECEIVED
        List<SampleStatus> strictFlow = List.of(
                SampleStatus.COLLECTED,
                SampleStatus.IN_TRANSIT,
                SampleStatus.RECEIVED
        );

        int currentIndex = strictFlow.indexOf(current);
        int nextIndex = strictFlow.indexOf(next);

        // ❌ Không cho lùi trạng thái nếu đang trong flow nghiêm ngặt
        if (currentIndex != -1 && nextIndex != -1 && nextIndex < currentIndex) {
            throw new AppException(ErrorCodeUser.INVALID_SAMPLE_STATUS_TRANSITION);
        }

        if (next == SampleStatus.RECEIVED) {
            // ✅ Cập nhật trạng thái bệnh nhân
            for (Patient patient : appointment.getPatients()) {
                patient.setPatientStatus(PatientStatus.IN_ANALYSIS);

            }

            appointment.setNote("Phòng xét nghiệm đã nhận mẫu");

            // ✅ Lọc nhân viên lab
            List<Staff> labOnly = labTechnicians.stream()
                    .filter(lab -> "LAB_TECHNICIAN".equalsIgnoreCase(lab.getRole()))
                    .collect(Collectors.toList());

            if (labOnly.isEmpty()) {
                throw new RuntimeException("Không có nhân viên phòng lab");
            }

            // ✅ Phân công nhân viên phòng lab
            int selectedIndex = staffAssignmentTracker.getNextIndex(labOnly.size()) % labOnly.size();
            Staff selectedStaff = labOnly.get(selectedIndex);
            appointment.setStaff(selectedStaff);
        }

        // ✅ Ghi chú theo trạng thái
        switch (next) {
            case COLLECTED:
                appointment.setNote("Đã lấy mẫu thành công");
                break;
            case IN_TRANSIT:
                Patient inTransitPatient = sample.getPatient();
                if (inTransitPatient != null) {
                    appointment.setNote("Mẫu của " + inTransitPatient.getFullName() + " đang vận chuyển đến phòng xét nghiệm");
                }
                break;
            case TESTING:
                Patient testingPatient = sample.getPatient();
                if (testingPatient != null) {
                    appointment.setNote("Mẫu của " + testingPatient.getFullName() + " đang được xét nghiệm");
                }
                break;
            case COMPLETED:
                appointment.setNote("Đã xét nghiệm xong");
                break;
            case REJECTED:
                Patient rejectedPatient = sample.getPatient();
                if (rejectedPatient != null) {
                    appointment.setNote("Mẫu của " + rejectedPatient.getFullName() + " đã bị từ chối");
                }
                break;
        }

    }

    @Transactional
    public void deleteSample(long sampleId) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        sample.setSampleStatus(SampleStatus.REJECTED);
    }

}
