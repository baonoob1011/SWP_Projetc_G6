package swp.project.adn_backend.service.registerServiceTestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.appointment.AllAppointmentResponse;
import swp.project.adn_backend.entity.Appointment;

@Service
public class EmailService {


    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentDetailsEmail(String toEmail, AllAppointmentResponse response) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("📅 Appointment Details Confirmation");

        String body = buildEmailBody(response);
        message.setText(body);

        mailSender.send(message);
    }

    private String buildEmailBody(AllAppointmentResponse response) {
        StringBuilder sb = new StringBuilder();

        sb.append("✅ Appointment Confirmation\n\n");

        // Appointment basic info
        sb.append("📌 Appointment Date: ").append(response.getShowAppointmentResponse().getAppointmentDate()).append("\n");
        sb.append("📌 Status: ").append(response.getShowAppointmentResponse().getAppointmentStatus()).append("\n\n");

        // Service
        response.getServiceAppointmentResponses().forEach(service -> {
            sb.append("🧪 Service: ").append(service.getServiceName()).append("\n");
            sb.append("Type: ").append(service.getServiceType()).append("\n");
            sb.append("Description: ").append(service.getDescription()).append("\n\n");
        });

        // Slot
        response.getSlotAppointmentResponse().forEach(slot -> {
            sb.append("🕒 Time: ").append(slot.getStartTime()).append(" - ").append(slot.getEndTime()).append("\n");
            sb.append("Date: ").append(slot.getSlotDate()).append("\n\n");
        });

        // Location
        response.getLocationAppointmentResponses().forEach(loc -> {
            sb.append("📍 Location: ").append(loc.getAddressLine())
                    .append(", ").append(loc.getDistrict())
                    .append(", ").append(loc.getCity()).append("\n\n");
        });

        // Patient
        sb.append("👤 Patients:\n");
        response.getPatientAppointmentResponse().forEach(p -> {
            sb.append("- ").append(p.getFullName()).append(" (").append(p.getRelationship()).append("), DOB: ")
                    .append(p.getDateOfBirth()).append(", Gender: ").append(p.getGender()).append("\n");
        });

        sb.append("\n");

        // Staff
        sb.append("👨‍⚕️ Staff in Charge:\n");
        response.getStaffAppointmentResponse().forEach(s -> {
            sb.append("- ").append(s.getFullName()).append(", Phone: ")
                    .append(s.getPhone()).append(", Email: ").append(s.getEmail()).append("\n");
        });

        sb.append("\n");

        // User info
        sb.append("📱 Booked by:\n");
        response.getUserAppointmentResponse().forEach(u -> {
            sb.append("- ").append(u.getFullName()).append(", Phone: ")
                    .append(u.getPhone()).append(", Email: ").append(u.getEmail()).append("\n");
        });

        return sb.toString();
    }
}



