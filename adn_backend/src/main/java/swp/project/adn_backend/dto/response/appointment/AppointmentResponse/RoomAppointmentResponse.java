package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

public class RoomAppointmentResponse {
    private String roomName;

    public RoomAppointmentResponse() {
    }

    public RoomAppointmentResponse(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }
}
