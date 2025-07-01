package swp.project.adn_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TotalRevenueResponse {
    private Long totalRevenue;
    private String currency;
    private String description;
} 