package swp.project.adn_backend.dto.request.slot;

public class StaffSlotResponse {
    private Long staffId;
    private String fullName;
    public StaffSlotResponse() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public long getStaffId() {
        return this.staffId;
    }

    public void setStaffId(long staffId) {
        this.staffId = staffId;
    }
}
