package swp.project.adn_backend.service.registerServiceTestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtHomeResponse;

@Service
public class EmailService {


    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentAtCenterDetailsEmail(String toEmail, AllAppointmentAtCenterResponse response) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("📅 Appointment Details Confirmation");

        String body = buildEmailAtCenterBody(response);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendAppointmentHomeDetailsEmail(String toEmail, AllAppointmentAtHomeResponse response) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("📅 Appointment Details Confirmation");

        String body = buildEmailAtHomeBody(response);
        message.setText(body);

        mailSender.send(message);
    }

    private String buildEmailAtCenterBody(AllAppointmentAtCenterResponse response) {
        StringBuilder sb = new StringBuilder();

        sb.append("<html><body style='font-family:Arial,sans-serif; color:#333;'>");
        sb.append("<h2 style='color:green;'>✅ Appointment Confirmation (At Center)</h2>");

        // Appointment info
        sb.append("<p><strong>📌 Appointment Date:</strong> ")
                .append(response.getShowAppointmentResponse().getAppointmentDate()).append("<br>");
        sb.append("<strong>📌 Status:</strong> ")
                .append(response.getShowAppointmentResponse().getAppointmentStatus()).append("</p>");

        // Service
        sb.append("<h3>🧪 Services</h3>");
        response.getServiceAppointmentResponses().forEach(service -> {
            sb.append("<p><strong>").append(service.getServiceName()).append("</strong><br>")
                    .append("Type: ").append(service.getServiceType()).append("<br>")
                    .append("Description: ").append(service.getDescription()).append("</p>");
        });

        // Slot
        sb.append("<h3>🕒 Time Slots</h3>");
        response.getSlotAppointmentResponse().forEach(slot -> {
            sb.append("<p>")
                    .append(slot.getStartTime()).append(" - ").append(slot.getEndTime()).append("<br>")
                    .append("Date: ").append(slot.getSlotDate()).append("</p>");
        });
        // Room
        if (response.getRoomAppointmentResponse() != null) {
            sb.append("<h3>🏠 Room</h3>");
            sb.append("<p>")
                    .append("Room Name: ").append(response.getRoomAppointmentResponse().getRoomName()).append("<br>")
                    .append("</p>");
        }

        // Location
        sb.append("<h3>📍 Location</h3>");
        response.getLocationAppointmentResponses().forEach(loc -> {
            sb.append("<p>")
                    .append(loc.getAddressLine()).append(", ")
                    .append(loc.getDistrict()).append(", ")
                    .append(loc.getCity()).append("</p>");
        });

        // Patients
        sb.append("<h3>👤 Patients</h3><ul>");
        response.getPatientAppointmentResponse().forEach(p -> {
            sb.append("<li>").append(p.getFullName()).append(" (").append(p.getRelationship())
                    .append("), DOB: ").append(p.getDateOfBirth())
                    .append(", Gender: ").append(p.getGender()).append("</li>");
        });
        sb.append("</ul>");

        // Staff
        sb.append("<h3>👨‍⚕️ Staff in Charge</h3><ul>");
        response.getStaffAppointmentResponse().forEach(s -> {
            sb.append("<li>").append(s.getFullName())
                    .append(", Phone: ").append(s.getPhone())
                    .append(", Email: ").append(s.getEmail()).append("</li>");
        });
        sb.append("</ul>");

        // User
        sb.append("<h3>📱 Booked By</h3><ul>");
        response.getUserAppointmentResponse().forEach(u -> {
            sb.append("<li>").append(u.getFullName())
                    .append(", Phone: ").append(u.getPhone())
                    .append(", Email: ").append(u.getEmail()).append("</li>");
        });
        sb.append("</ul>");

        sb.append("</body></html>");

        return sb.toString();
    }

    private String buildEmailAtHomeBody(AllAppointmentAtHomeResponse response) {
        StringBuilder sb = new StringBuilder();

        sb.append("<html><body style='font-family:Arial,sans-serif; color:#333;'>");
        sb.append("<h2 style='color:green;'>✅ Appointment Confirmation (At Home)</h2>");

        // Appointment info
        sb.append("<p><strong>📌 Appointment Date:</strong> ")
                .append(response.getShowAppointmentResponse().getAppointmentDate()).append("<br>");
        sb.append("<strong>📌 Status:</strong> ")
                .append(response.getShowAppointmentResponse().getAppointmentStatus()).append("</p>");

        // Service
        sb.append("<h3>🧪 Services</h3>");
        response.getServiceAppointmentResponses().forEach(service -> {
            sb.append("<p><strong>").append(service.getServiceName()).append("</strong><br>")
                    .append("Type: ").append(service.getServiceType()).append("<br>")
                    .append("Description: ").append(service.getDescription()).append("</p>");
        });

        // Kit info
        if (response.getKitAppointmentResponse() != null) {
            sb.append("<h3>📦 Testing Kit</h3><p>")
                    .append("Kit Name: ").append(response.getKitAppointmentResponse().getKitName()).append("<br>")
                    .append("Kit Code: ").append(response.getKitAppointmentResponse().getKitCode()).append("</p>");
        }

        // Patients
        sb.append("<h3>👤 Patients</h3><ul>");
        response.getPatientAppointmentResponse().forEach(p -> {
            sb.append("<li>").append(p.getFullName()).append(" (").append(p.getRelationship())
                    .append("), DOB: ").append(p.getDateOfBirth())
                    .append(", Gender: ").append(p.getGender()).append("</li>");
        });
        sb.append("</ul>");

        // User
        sb.append("<h3>📱 Booked By</h3><ul>");
        response.getUserAppointmentResponse().forEach(u -> {
            sb.append("<li>").append(u.getFullName())
                    .append(", Phone: ").append(u.getPhone())
                    .append(", Email: ").append(u.getEmail()).append("</li>");
        });
        sb.append("</ul>");

        sb.append("</body></html>");

        return sb.toString();
    }


}



