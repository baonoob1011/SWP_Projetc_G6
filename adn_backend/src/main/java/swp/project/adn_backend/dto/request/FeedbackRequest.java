package swp.project.adn_backend.dto.request;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;

import java.time.LocalDate;

public class FeedbackRequest {

    String feedbackText;

    LocalDate dateSubmitted;

    Users users;

    ServiceTest service;

    public FeedbackRequest(String feedbackText, LocalDate dateSubmitted, Users users, ServiceTest service) {
        this.feedbackText = feedbackText;
        this.dateSubmitted = dateSubmitted;
        this.users = users;
        this.service = service;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public LocalDate getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(LocalDate dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }
}
