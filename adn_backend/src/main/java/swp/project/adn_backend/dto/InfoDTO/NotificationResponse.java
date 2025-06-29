package swp.project.adn_backend.dto.InfoDTO;

public class NotificationResponse {
    private long notificationId;
    private int numOfNotification;

    public NotificationResponse(long notificationId, int numOfNotification) {
        this.notificationId = notificationId;
        this.numOfNotification = numOfNotification;
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
