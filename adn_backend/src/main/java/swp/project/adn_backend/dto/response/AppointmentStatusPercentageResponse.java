package swp.project.adn_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusPercentageResponse {
    private long totalCompleted;
    private long totalCancelled;
    private long totalAppointments;
    private double completedPercentage;
    private double cancelledPercentage;
} 