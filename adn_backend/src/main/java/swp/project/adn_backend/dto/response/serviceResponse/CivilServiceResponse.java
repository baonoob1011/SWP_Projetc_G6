package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.enums.SampleCollectionMethod;

public class CivilServiceResponse {
   private SampleCollectionMethod sampleCollectionMethod;

    public CivilServiceResponse(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }

    public CivilServiceResponse() {
    }

    public SampleCollectionMethod getSampleCollectionMethod() {
        return sampleCollectionMethod;
    }

    public void setSampleCollectionMethod(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }
}