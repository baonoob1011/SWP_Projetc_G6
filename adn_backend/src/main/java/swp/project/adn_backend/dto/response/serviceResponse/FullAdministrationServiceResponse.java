package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.dto.response.discount.DiscountResponse;

import java.util.List;

public class FullAdministrationServiceResponse {
    private ServiceTestResponse serviceRequest;
    private List<PriceListResponse> priceListRequest; // ✅ CHỈNH Ở ĐÂY
    private List<AdministrativeServiceResponse> administrativeServiceRequest;
    private List<DiscountResponse> discountResponses;

    public List<DiscountResponse> getDiscountResponses() {
        return discountResponses;
    }

    public void setDiscountResponses(List<DiscountResponse> discountResponses) {
        this.discountResponses = discountResponses;
    }

    public ServiceTestResponse getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceTestResponse serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public List<PriceListResponse> getPriceListRequest() {
        return priceListRequest;
    }

    public void setPriceListRequest(List<PriceListResponse> priceListRequest) {
        this.priceListRequest = priceListRequest;
    }

    public List<AdministrativeServiceResponse> getAdministrativeServiceRequest() {
        return administrativeServiceRequest;
    }

    public void setAdministrativeServiceRequest(List<AdministrativeServiceResponse> administrativeServiceRequest) {
        this.administrativeServiceRequest = administrativeServiceRequest;
    }
}
