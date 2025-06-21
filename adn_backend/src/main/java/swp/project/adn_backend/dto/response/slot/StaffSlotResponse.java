package swp.project.adn_backend.dto.response.slot;

public class StaffSlotResponse {
    private Long staffId;
    private String fullName;
    public StaffSlotResponse() {
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
