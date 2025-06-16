package swp.project.adn_backend.service.registerServiceTestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;

import java.util.List;

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

        sb.append("✅ Appointment Confirmation (At Center)\n\n");

        // Appointment info
        if (response.getShowAppointmentResponse() != null) {
            sb.append("📌 Appointment Date: ")
                    .append(response.getShowAppointmentResponse().getAppointmentDate()).append("\n");
            sb.append("📌 Status: ")
                    .append(response.getShowAppointmentResponse().getAppointmentStatus()).append("\n\n");
            sb.append("📌 Note: ")
                    .append(response.getShowAppointmentResponse().getNote()).append("\n\n");
        }

        // Services
        List<ServiceAppointmentResponse> services = response.getServiceAppointmentResponses();
        if (services != null && !services.isEmpty()) {
            sb.append("🧪 Services:\n");
            services.forEach(service -> {
                sb.append("- ").append(service.getServiceName()).append("\n")
                        .append("  Type: ").append(service.getServiceType()).append("\n")
                        .append("  Description: ").append(service.getDescription()).append("\n\n");
            });
        }

        // Slots
        List<SlotAppointmentResponse> slots = response.getSlotAppointmentResponse();
        if (slots != null && !slots.isEmpty()) {
            sb.append("🕒 Time Slots:\n");
            slots.forEach(slot -> {
                sb.append("- ").append(slot.getStartTime()).append(" - ").append(slot.getEndTime()).append("\n")
                        .append("  Date: ").append(slot.getSlotDate()).append("\n");
            });
            sb.append("\n");
        }

        // Room
        RoomAppointmentResponse room = response.getRoomAppointmentResponse();
        if (room != null) {
            sb.append("🏠 Room:\n");
            sb.append("- Room Name: ").append(room.getRoomName()).append("\n\n");
        }

        // Location
        List<LocationAppointmentResponse> locations = response.getLocationAppointmentResponses();
        if (locations != null && !locations.isEmpty()) {
            sb.append("📍 Location:\n");
            locations.forEach(loc -> {
                sb.append("- ").append(loc.getAddressLine()).append(", ")
                        .append(loc.getDistrict()).append(", ")
                        .append(loc.getCity()).append("\n");
            });
            sb.append("\n");
        }


        // Staff
        List<StaffAppointmentResponse> staff = response.getStaffAppointmentResponse();
        if (staff != null && !staff.isEmpty()) {
            sb.append("👨‍⚕️ Staff in Charge:\n");
            staff.forEach(s -> {
                sb.append("- ").append(s.getFullName())
                        .append(", Phone: ").append(s.getPhone())
                        .append(", Email: ").append(s.getEmail()).append("\n");
            });
            sb.append("\n");
        }

        // User
        List<UserAppointmentResponse> users = response.getUserAppointmentResponse();
        if (users != null && !users.isEmpty()) {
            sb.append("📱 Booked By:\n");
            users.forEach(u -> {
                sb.append("- ").append(u.getFullName())
                        .append(", Phone: ").append(u.getPhone())
                        .append(", Email: ").append(u.getEmail()).append("\n");
            });
        }

        return sb.toString();
    }


    private String buildEmailAtHomeBody(AllAppointmentAtHomeResponse response) {
        StringBuilder sb = new StringBuilder();

        sb.append("✅ Appointment Confirmation (At Home)\n\n");

        // Appointment info
        sb.append("📌 Appointment Date: ")
                .append(response.getShowAppointmentResponse().getAppointmentDate()).append("\n");
        sb.append("📌 Status: ")
                .append(response.getShowAppointmentResponse().getAppointmentStatus()).append("\n\n");
        sb.append("📌 Note: ")
                .append(response.getShowAppointmentResponse().getNote()).append("\n\n");

        // Services
        sb.append("🧪 Services:\n");
        response.getServiceAppointmentResponses().forEach(service -> {
            sb.append("- ").append(service.getServiceName()).append("\n")
                    .append("  Type: ").append(service.getServiceType()).append("\n")
                    .append("  Description: ").append(service.getDescription()).append("\n\n");
        });

        // Kit
        if (response.getKitAppointmentResponse() != null) {
            sb.append("📦 Testing Kit:\n");
            sb.append("- Kit Name: ").append(response.getKitAppointmentResponse().getKitName()).append("\n")
                    .append("- Kit Code: ").append(response.getKitAppointmentResponse().getKitCode()).append("\n\n");
        }


        // User
        sb.append("📱 Booked By:\n");
        response.getUserAppointmentResponse().forEach(u -> {
            sb.append("- ").append(u.getFullName())
                    .append(", Phone: ").append(u.getPhone())
                    .append(", Email: ").append(u.getEmail()).append("\n");
        });

        return sb.toString();
    }


}



