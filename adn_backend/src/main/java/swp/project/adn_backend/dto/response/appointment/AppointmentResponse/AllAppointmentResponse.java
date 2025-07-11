package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import java.util.List;

public class AllAppointmentResponse {
 public List<AllAppointmentAtCenterResponse> allAppointmentAtCenterResponse;
 public List<AllAppointmentAtHomeResponse> allAppointmentAtHomeResponse;

    public AllAppointmentResponse(List<AllAppointmentAtCenterResponse> allAppointmentAtCenterResponse, List<AllAppointmentAtHomeResponse> allAppointmentAtHomeResponse) {
        this.allAppointmentAtCenterResponse = allAppointmentAtCenterResponse;
        this.allAppointmentAtHomeResponse = allAppointmentAtHomeResponse;
    }

    public AllAppointmentResponse() {
    }

    public List<AllAppointmentAtCenterResponse> getAllAppointmentAtCenterResponse() {
        return allAppointmentAtCenterResponse;
    }

    public void setAllAppointmentAtCenterResponse(List<AllAppointmentAtCenterResponse> allAppointmentAtCenterResponse) {
        this.allAppointmentAtCenterResponse = allAppointmentAtCenterResponse;
    }

    public List<AllAppointmentAtHomeResponse> getAllAppointmentAtHomeResponse() {
        return allAppointmentAtHomeResponse;
    }

    public void setAllAppointmentAtHomeResponse(List<AllAppointmentAtHomeResponse> allAppointmentAtHomeResponse) {
        this.allAppointmentAtHomeResponse = allAppointmentAtHomeResponse;
    }
}
