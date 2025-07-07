package swp.project.adn_backend.dto.InfoDTO;

public class NotificationResponse {
    private long notificationId;
    private int numOfNotification;
    private String note;

    public NotificationResponse(long notificationId, int numOfNotification, String note) {
        this.notificationId = notificationId;
        this.numOfNotification = numOfNotification;
        this.note = note;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(long notificationId) {
        this.notificationId = notificationId;
    }

    public int getNumOfNotification() {
        return numOfNotification;
    }

    public void setNumOfNotification(int numOfNotification) {
        this.numOfNotification = numOfNotification;
    }
}
