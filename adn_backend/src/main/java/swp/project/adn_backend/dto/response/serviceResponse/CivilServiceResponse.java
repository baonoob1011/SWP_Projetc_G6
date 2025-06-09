package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.enums.SampleCollectionMethod;

import java.util.Set;

public class CivilServiceResponse {
    private Set<SampleCollectionMethod> sampleCollectionMethods;

    public CivilServiceResponse() {
    }

    public CivilServiceResponse(Set<SampleCollectionMethod> sampleCollectionMethods) {
        this.sampleCollectionMethods = sampleCollectionMethods;
    }

    public Set<SampleCollectionMethod> getSampleCollectionMethods() {
        return sampleCollectionMethods;
    }

    public void setSampleCollectionMethods(Set<SampleCollectionMethod> sampleCollectionMethods) {
        this.sampleCollectionMethods = sampleCollectionMethods;
    }
}