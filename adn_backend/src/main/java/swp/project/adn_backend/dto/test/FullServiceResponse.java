package swp.project.adn_backend.dto.test;

public class FullServiceResponse {
    private ServiceTestResponse serviceRequest;
    private PriceListResponse priceListRequest;
    private AdministrativeServiceResponse administrativeServiceRequest;

    public ServiceTestResponse getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceTestResponse serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public PriceListResponse getPriceListRequest() {
        return priceListRequest;
    }

    public void setPriceListRequest(PriceListResponse priceListRequest) {
        this.priceListRequest = priceListRequest;
    }

    public AdministrativeServiceResponse getAdministrativeServiceRequest() {
        return administrativeServiceRequest;
    }

    public void setAdministrativeServiceRequest(AdministrativeServiceResponse administrativeServiceRequest) {
        this.administrativeServiceRequest = administrativeServiceRequest;
    }
}
