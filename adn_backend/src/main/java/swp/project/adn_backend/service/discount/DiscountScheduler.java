package swp.project.adn_backend.service.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.repository.DiscountRepository;

import java.time.LocalDate;
import java.util.List;

@Component
public class DiscountScheduler {

    @Autowired
    private DiscountRepository discountRepository;

    @Scheduled(cron = "0 0 0 * * *") // Mỗi ngày lúc 00:00
    public void updateDiscountStatusDaily() {
        List<Discount> discounts = discountRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Discount discount : discounts) {
            boolean active = (today.isEqual(discount.getStartDate()) || today.isAfter(discount.getStartDate())) &&
                    (today.isBefore(discount.getEndDate()) || today.isEqual(discount.getEndDate()));
            discount.setActive(active);
        }

        discountRepository.saveAll(discounts);
        System.out.println("✅ Updated discount status for " + discounts.size() + " items.");
    }
}
