package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

public class KitAppointmentResponse {
    String kitCode;
    String kitName;
    String targetPersonCount;
    String contents;

    public KitAppointmentResponse(String kitCode, String kitName, String targetPersonCount, String contents) {
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.targetPersonCount = targetPersonCount;
        this.contents = contents;
    }

    public String getKitCode() {
        return kitCode;
    }

    public void setKitCode(String kitCode) {
        this.kitCode = kitCode;
    }

    public String getKitName() {
        return kitName;
    }

    public void setKitName(String kitName) {
        this.kitName = kitName;
    }

    public String getTargetPersonCount() {
        return targetPersonCount;
    }

    public void setTargetPersonCount(String targetPersonCount) {
        this.targetPersonCount = targetPersonCount;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }
}
