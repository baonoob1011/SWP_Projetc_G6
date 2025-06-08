package swp.project.adn_backend.service.slot;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.SlotRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotService {
    SlotMapper slotMapper;
    SlotRepository slotRepository;
    UserRepository userRepository;
    StaffRepository staffRepository;

    @Autowired
    public SlotService(SlotMapper slotMapper, SlotRepository slotRepository, UserRepository userRepository, StaffRepository staffRepository) {
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
    }

    public Slot createSlot(SlotRequest slotRequest,
                           Authentication authentication,
                           Long staffId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userCreated = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_EXISTED));
        Slot slot = slotMapper.toSlot(slotRequest);
        slot.setStaff(staff);
        slot.setUsers(userCreated);
        return slotRepository.save(slot);
    }
}
