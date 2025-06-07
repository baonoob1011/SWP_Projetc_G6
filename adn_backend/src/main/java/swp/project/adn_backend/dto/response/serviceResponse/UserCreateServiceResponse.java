package swp.project.adn_backend.dto.response.serviceResponse;

public class UserCreateServiceResponse {
    private String fullName;

    public UserCreateServiceResponse(String fullName) {
        this.fullName = fullName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
