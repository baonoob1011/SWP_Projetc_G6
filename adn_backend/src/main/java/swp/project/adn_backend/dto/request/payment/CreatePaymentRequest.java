package swp.project.adn_backend.dto.request.payment;

public class CreatePaymentRequest {
    private double amount;
    private String orderInfo;
    private String returnUrlBase;

    public CreatePaymentRequest() {
    }

    public CreatePaymentRequest(double amount, String orderInfo, String returnUrlBase) {
        this.amount = amount;
        this.orderInfo = orderInfo;
        this.returnUrlBase = returnUrlBase;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }

    public String getReturnUrlBase() {
        return returnUrlBase;
    }

    public void setReturnUrlBase(String returnUrlBase) {
        this.returnUrlBase = returnUrlBase;
    }
}
