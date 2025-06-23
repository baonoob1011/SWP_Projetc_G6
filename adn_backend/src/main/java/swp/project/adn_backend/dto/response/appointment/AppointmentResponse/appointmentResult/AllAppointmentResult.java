package swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult;

import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;

import java.util.List;

public class AllAppointmentResult {
    private List<PatientAppointmentResponse> patientAppointmentResponse;
    private StaffAppointmentResponse staffAppointmentResponse;
    private UserAppointmentResponse userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private ServiceAppointmentResponse serviceAppointmentResponses;
    private List<ResultAppointmentResponse> resultAppointmentResponse;
    private List<ResultLocusAppointmentResponse> resultLocusAppointmentResponse;
    private List<ResultDetailAppointmentResponse> resultDetailAppointmentResponse;
    private List<SampleAppointmentResponse> sampleAppointmentResponse;

    public List<SampleAppointmentResponse> getSampleAppointmentResponse() {
        return sampleAppointmentResponse;
    }

    public void setSampleAppointmentResponse(List<SampleAppointmentResponse> sampleAppointmentResponse) {
        this.sampleAppointmentResponse = sampleAppointmentResponse;
    }

    public AllAppointmentResult() {
    }

    public List<ResultDetailAppointmentResponse> getResultDetailAppointmentResponse() {
        return resultDetailAppointmentResponse;
    }

    public void setResultDetailAppointmentResponse(List<ResultDetailAppointmentResponse> resultDetailAppointmentResponse) {
        this.resultDetailAppointmentResponse = resultDetailAppointmentResponse;
    }

    public List<PatientAppointmentResponse> getPatientAppointmentResponse() {
        return patientAppointmentResponse;
    }

    public void setPatientAppointmentResponse(List<PatientAppointmentResponse> patientAppointmentResponse) {
        this.patientAppointmentResponse = patientAppointmentResponse;
    }

    public StaffAppointmentResponse getStaffAppointmentResponse() {
        return staffAppointmentResponse;
    }

    public void setStaffAppointmentResponse(StaffAppointmentResponse staffAppointmentResponse) {
        this.staffAppointmentResponse = staffAppointmentResponse;
    }

    public UserAppointmentResponse getUserAppointmentResponse() {
        return userAppointmentResponse;
    }

    public void setUserAppointmentResponse(UserAppointmentResponse userAppointmentResponse) {
        this.userAppointmentResponse = userAppointmentResponse;
    }

    public ShowAppointmentResponse getShowAppointmentResponse() {
        return showAppointmentResponse;
    }

    public void setShowAppointmentResponse(ShowAppointmentResponse showAppointmentResponse) {
        this.showAppointmentResponse = showAppointmentResponse;
    }

    public ServiceAppointmentResponse getServiceAppointmentResponses() {
        return serviceAppointmentResponses;
    }

    public void setServiceAppointmentResponses(ServiceAppointmentResponse serviceAppointmentResponses) {
        this.serviceAppointmentResponses = serviceAppointmentResponses;
    }

    public List<ResultAppointmentResponse> getResultAppointmentResponse() {
        return resultAppointmentResponse;
    }

    public void setResultAppointmentResponse(List<ResultAppointmentResponse> resultAppointmentResponse) {
        this.resultAppointmentResponse = resultAppointmentResponse;
    }

    public List<ResultLocusAppointmentResponse> getResultLocusAppointmentResponse() {
        return resultLocusAppointmentResponse;
    }

    public void setResultLocusAppointmentResponse(List<ResultLocusAppointmentResponse> resultLocusAppointmentResponse) {
        this.resultLocusAppointmentResponse = resultLocusAppointmentResponse;
    }
}
