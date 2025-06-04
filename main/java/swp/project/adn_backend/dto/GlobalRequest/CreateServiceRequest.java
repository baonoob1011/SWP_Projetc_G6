package swp.project.adn_backend.dto.GlobalRequest;

import jakarta.validation.Valid;
import swp.project.adn_backend.dto.request.*;

public class CreateServiceRequest {

    @Valid
    private ServiceRequest serviceRequest;

    @Valid
    private PriceListRequest priceListRequest;

    private AdministrativeServiceRequest administrativeServiceRequest;

    private CivilServiceRequest civilServiceRequest;

    public CivilServiceRequest getCivilServiceRequest() {
        return civilServiceRequest;
    }

    public void setCivilServiceRequest(CivilServiceRequest civilServiceRequest) {
        this.civilServiceRequest = civilServiceRequest;
    }

    public AdministrativeServiceRequest getAdministrativeServiceRequest() {
        return administrativeServiceRequest;
    }

    public void setAdministrativeServiceRequest(AdministrativeServiceRequest administrativeServiceRequest) {
        this.administrativeServiceRequest = administrativeServiceRequest;
    }

    // Getters và setters
    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public PriceListRequest getPriceListRequest() {
        return priceListRequest;
    }

    public void setPriceListRequest(PriceListRequest priceListRequest) {
        this.priceListRequest = priceListRequest;
    }
}
