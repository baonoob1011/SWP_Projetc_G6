package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.account.StaffAccountRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.entity.Staff;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    Staff toStaff(StaffRequest staffRequest);
    Staff toStaffAccount(StaffAccountRequest staffRequest);
}
