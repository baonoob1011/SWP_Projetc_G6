package swp.project.adn_backend.dto.request.serviceRequest;

import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.SampleCollectionMethod;

import java.util.List;

public class CivilServiceRequest {

    SampleCollectionMethod sampleCollectionMethod;


    ServiceTest service;


    List<Kit> kits;

    public CivilServiceRequest(SampleCollectionMethod sampleCollectionMethod, ServiceTest service, List<Kit> kits) {
        this.sampleCollectionMethod = sampleCollectionMethod;
        this.service = service;
        this.kits = kits;
    }

    public SampleCollectionMethod getSampleCollectionMethod() {
        return sampleCollectionMethod;
    }

    public void setSampleCollectionMethod(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }

    public List<Kit> getKits() {
        return kits;
    }

    public void setKits(List<Kit> kits) {
        this.kits = kits;
    }
}
