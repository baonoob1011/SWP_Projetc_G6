package swp.project.adn_backend.dto.response;

public class DashboardResponse {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long totalPatients;
    private long totalStaff;
    private long totalManagers;
    private long totalAdmins;
    private long totalUsersRegisteredService;
    private String description;

    public DashboardResponse() {}

    public DashboardResponse(long totalUsers, long activeUsers, long inactiveUsers, 
                           long totalPatients, long totalStaff, long totalManagers, long totalAdmins) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalPatients = totalPatients;
        this.totalStaff = totalStaff;
        this.totalManagers = totalManagers;
        this.totalAdmins = totalAdmins;
        this.description = "Thống kê tổng quan hệ thống";
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getInactiveUsers() {
        return inactiveUsers;
    }

    public void setInactiveUsers(long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalUsersRegisteredService() {
        return totalUsersRegisteredService;
    }

    public void setTotalUsersRegisteredService(long totalUsersRegisteredService) {
        this.totalUsersRegisteredService = totalUsersRegisteredService;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "DashboardResponse{" +
                "totalUsers=" + totalUsers +
                ", activeUsers=" + activeUsers +
                ", inactiveUsers=" + inactiveUsers +
                ", totalPatients=" + totalPatients +
                ", totalStaff=" + totalStaff +
                ", totalManagers=" + totalManagers +
                ", totalAdmins=" + totalAdmins +
                ", totalUsersRegisteredService=" + totalUsersRegisteredService +
                ", description='" + description + '\'' +
                '}';
    }
} 