package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Kit")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Kit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kit_id")
    long kitId;
    String kitCode;
    @Column(name = "kit_name", columnDefinition = "nvarchar(255)")
    String kitName;
    @Column(columnDefinition = "nvarchar(255)")
    String targetPersonCount;
    int quantity;
    double price;

    @Column(columnDefinition = "nvarchar(255)")
    String contents;

    @OneToMany(mappedBy = "kit", cascade = CascadeType.ALL)
    private List<KitDeliveryStatus> kitDeliveryStatuses;

    @OneToMany(mappedBy = "kit", fetch = FetchType.EAGER, cascade = {
            CascadeType.ALL
    })
    List<ServiceTest> serviceTest;

    public List<KitDeliveryStatus> getKitDeliveryStatuses() {
        return kitDeliveryStatuses;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setKitDeliveryStatuses(List<KitDeliveryStatus> kitDeliveryStatuses) {
        this.kitDeliveryStatuses = kitDeliveryStatuses;
    }

    public List<ServiceTest> getServiceTest() {
        return serviceTest;
    }

    public void setServiceTest(List<ServiceTest> serviceTest) {
        this.serviceTest = serviceTest;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public long getKitId() {
        return kitId;
    }

    public void setKitId(long kitId) {
        this.kitId = kitId;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    //
//    @ManyToOne(cascade = {
//            CascadeType.PERSIST, CascadeType.MERGE,
//            CascadeType.DETACH, CascadeType.REFRESH
//    })
//    @JoinColumn(name = "patient_id", nullable = false)
//    Patient patient;
//
//    @ManyToOne(cascade = {
//            CascadeType.PERSIST, CascadeType.MERGE,
//            CascadeType.DETACH, CascadeType.REFRESH
//    })
//    @JoinColumn(name = "civil_service_id", nullable = false)
//    CivilService civilService;
//
//    @OneToMany(mappedBy = "kit", fetch = FetchType.LAZY, cascade = {
//            CascadeType.PERSIST, CascadeType.MERGE,
//            CascadeType.DETACH, CascadeType.REFRESH
//    })
//    List<Sample> sample;
}
