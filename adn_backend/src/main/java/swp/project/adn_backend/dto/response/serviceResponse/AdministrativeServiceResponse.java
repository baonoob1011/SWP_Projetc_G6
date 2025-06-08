package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.enums.SampleCollectionMethod;

public class AdministrativeServiceResponse {
   private SampleCollectionMethod sampleCollectionMethod;

    public AdministrativeServiceResponse(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }

    public AdministrativeServiceResponse() {
    }

    public SampleCollectionMethod getSampleCollectionMethod() {
        return sampleCollectionMethod;
    }

    public void setSampleCollectionMethod(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }
}