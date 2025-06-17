package swp.project.adn_backend.dto.response.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffSampleResponse {
    long staffId;
    String fullName;


    public StaffSampleResponse() {
    }

    public StaffSampleResponse(long staffId, String fullName) {
        this.staffId = staffId;
        this.fullName = fullName;
    }

    public long getStaffId() {
        return staffId;
    }

    public void setStaffId(long staffId) {
        this.staffId = staffId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


}
