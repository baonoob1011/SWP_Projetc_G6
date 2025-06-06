package swp.project.adn_backend.dto.request.serviceRequest;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ServiceType;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterServiceRequest {
     String service_name;
     ServiceType serviceType;
     boolean isActive;
     List<Appointment>appointments;
     Users users;
}
