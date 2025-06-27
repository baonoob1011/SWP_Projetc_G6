package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.dto.response.discount.DiscountResponse;

import java.util.List;

public class FullCivilServiceResponse {
    private ServiceTestResponse serviceRequest;
    private List<PriceListResponse> priceListRequest; //
    private List<CivilServiceResponse> serviceResponses;
    private List<DiscountResponse> discountResponses;

    public List<DiscountResponse> getDiscountResponses() {
        return discountResponses;
    }

    public void setDiscountResponses(List<DiscountResponse> discountResponses) {
        this.discountResponses = discountResponses;
    }

    public List<CivilServiceResponse> getServiceResponses() {
        return serviceResponses;
    }

    public void setServiceResponses(List<CivilServiceResponse> serviceResponses) {
        this.serviceResponses = serviceResponses;
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

}
