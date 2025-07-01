package swp.project.adn_backend.service.slot;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class StaffAssignmentTracker {

    private AtomicInteger currentIndex = new AtomicInteger(0);

    public int getNextIndex(int totalStaff) {
        if (totalStaff == 0) return 0;
        // Auto reset về 0 nếu vượt quá size
        return currentIndex.getAndUpdate(index -> (index + 1) % totalStaff);
    }
}
