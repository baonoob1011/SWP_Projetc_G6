package swp.project.adn_backend.dto.request.authentication;

public class GoogleUserRequest {
    private String sub;
    private String email;
    private String name;
    private String picture;

    public GoogleUserRequest(String sub, String email, String name, String picture) {
        this.sub = sub;
        this.email = email;
        this.name = name;
        this.picture = picture;
    }

    public GoogleUserRequest() {
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
