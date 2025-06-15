package swp.project.adn_backend.service.slot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.repository.SlotRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SlotStatusScheduler {

    @Autowired
    private SlotRepository slotRepository;

    @Scheduled(fixedRate = 60_000) // mỗi 1 phút
    public void updateExpiredSlots() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Slot> expiredSlots = slotRepository.findExpiredSlots(today, now);

        for (Slot slot : expiredSlots) {
            slot.setSlotStatus(SlotStatus.AVAILABLE); // hoặc status bạn muốn
            slotRepository.save(slot);
        }
    }
}
