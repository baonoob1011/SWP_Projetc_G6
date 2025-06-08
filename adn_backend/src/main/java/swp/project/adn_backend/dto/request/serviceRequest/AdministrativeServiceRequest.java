package swp.project.adn_backend.dto.request.serviceRequest;

import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.SampleCollectionMethod;

public class AdministrativeServiceRequest {
    SampleCollectionMethod sampleCollectionMethod;
    ServiceTest service;

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

    public AdministrativeServiceRequest(SampleCollectionMethod sampleCollectionMethod, ServiceTest service) {
        this.sampleCollectionMethod = sampleCollectionMethod;
        this.service = service;
    }
}
