package swp.project.adn_backend.service.slot;

import org.springframework.stereotype.Component;

@Component
public class StaffAssignmentTracker {
    private int currentIndex = 0;

    public synchronized int getNextIndex(int staffListSize) {
        int indexToUse = currentIndex;
        currentIndex = (currentIndex + 1) % staffListSize;
        return indexToUse;
    }
}
