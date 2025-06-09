package swp.project.adn_backend.service.slot;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.request.slot.*;
//import swp.project.adn_backend.dto.response.SlotReponse;
import swp.project.adn_backend.dto.response.serviceResponse.GetAllServiceResponse;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SlotMapper;
import swp.project.adn_backend.repository.SlotRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotService {
    SlotMapper slotMapper;
    SlotRepository slotRepository;
    UserRepository userRepository;
    StaffRepository staffRepository;
    EntityManager entityManager;

    @Autowired
    public SlotService(SlotMapper slotMapper, SlotRepository slotRepository, UserRepository userRepository, StaffRepository staffRepository, EntityManager entityManager) {
        this.slotMapper = slotMapper;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.entityManager = entityManager;
    }

    public Slot createSlot(SlotRequest slotRequest,
                           Authentication authentication,
                           long staffId) {
//        Jwt jwt = (Jwt) authentication.getPrincipal();
//        Long userId = jwt.getClaim("id");
//        Users userCreated = userRepository.findById(userId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_EXISTED));
        Slot slot = slotMapper.toSlot(slotRequest);
        slot.setStaff(staff);
//        slot.setUsers(userCreated);
        return slotRepository.save(slot);
    }


    public List<GetFullSlotResponse> getAllSlot() {
        List<GetFullSlotResponse> fullSlotResponses = new ArrayList<>();
        List<Slot> slotList = slotRepository.findAll();
        GetFullSlotResponse getAllServiceResponse = null;
        for (Slot slot : slotList) {
            SlotResponse slotResponse = slotMapper.toSlotResponse(slot);

            //lay staff
            StaffSlotResponse staffSlotResponse = new StaffSlotResponse();
            staffSlotResponse.setStaffId(slot.getStaff().getStaffId());
            staffSlotResponse.setFullName(slot.getStaff().getFullName());


            GetFullSlotResponse getFullSlotResponse = new GetFullSlotResponse();
            getFullSlotResponse.setSlotResponse(slotResponse);
            getFullSlotResponse.setStaffSlotResponse(staffSlotResponse);

            //lay full response
            fullSlotResponses.add(getFullSlotResponse);
        }
        return fullSlotResponses;
    }

    public void deleteSlot(long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SLOT_NOT_EXISTS));
        slotRepository.delete(slot);
    }
}
