package swp.project.adn_backend.dto.response.serviceResponse;

import java.util.List;

public class FullServiceTestResponse {
    private GetAllServiceResponse serviceRequest;
    private List<PriceListResponse> priceListRequest; //

    public GetAllServiceResponse getServiceRequest() {
        return serviceRequest;
    }


    public void setServiceRequest(GetAllServiceResponse serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public List<PriceListResponse> getPriceListRequest() {
        return priceListRequest;
    }

    public void setPriceListRequest(List<PriceListResponse> priceListRequest) {
        this.priceListRequest = priceListRequest;
    }
}
