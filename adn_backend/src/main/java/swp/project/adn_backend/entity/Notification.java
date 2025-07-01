package swp.project.adn_backend.entity;


import jakarta.persistence.*;
import swp.project.adn_backend.enums.TransactionStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long notificationId;
    private int numOfNotification;
    @Column(columnDefinition = "nvarchar(255)")
    private String note;

    @OneToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "staff_id")  // Chỉ định tên cột khóa ngoại
    private Staff staff;

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Notification() {
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

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }
}

