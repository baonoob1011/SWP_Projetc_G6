package swp.project.adn_backend.dto.request.roleRequest;

public class UserPhoneRequest {
    private String phone;

    public UserPhoneRequest(String phone) {
        this.phone = phone;
    }

    public UserPhoneRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
