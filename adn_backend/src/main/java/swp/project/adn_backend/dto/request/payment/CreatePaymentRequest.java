package swp.project.adn_backend.dto.request.payment;

public class CreatePaymentRequest {
    private double amount;
    private String orderInfo;
    private String returnUrlBase;
    private String txnRef; // ✅ thêm dòng này

    public CreatePaymentRequest() {
    }

    public String getTxnRef() {
        return txnRef;
    }

    public void setTxnRef(String txnRef) {
        this.txnRef = txnRef;
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
