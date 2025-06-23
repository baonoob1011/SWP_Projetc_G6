package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

public class AllAppointmentAtHomeManagerResponse {
    private ShowAppointmentResponse appointmentResponse;
    private StaffAppointmentResponse staffAppointmentResponse;

    public ShowAppointmentResponse getAppointmentResponse() {
        return appointmentResponse;
    }

    public void setAppointmentResponse(ShowAppointmentResponse appointmentResponse) {
        this.appointmentResponse = appointmentResponse;
    }

    public StaffAppointmentResponse getStaffAppointmentResponse() {
        return staffAppointmentResponse;
    }

    public void setStaffAppointmentResponse(StaffAppointmentResponse staffAppointmentResponse) {
        this.staffAppointmentResponse = staffAppointmentResponse;
    }
}
