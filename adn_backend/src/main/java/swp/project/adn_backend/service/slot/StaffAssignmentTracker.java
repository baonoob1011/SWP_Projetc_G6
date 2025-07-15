package swp.project.adn_backend.service.slot;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class StaffAssignmentTracker {

    private AtomicInteger currentIndex = new AtomicInteger(0);

    public int getNextIndex(int totalStaff) {
        if (totalStaff == 0) return 0;
        int index = currentIndex.getAndUpdate(i -> (i + 1) % totalStaff);
        System.out.println("⚙️ Current assignment index: " + index);
        return index;
    }

}
