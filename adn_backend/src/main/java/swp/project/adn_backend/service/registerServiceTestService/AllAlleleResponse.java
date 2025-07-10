package swp.project.adn_backend.service.registerServiceTestService;

import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.PatientAppointmentResponse;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.dto.response.result.PatientAlleleResponse;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.dto.response.result.SampleAlleleResponse;

import java.util.List;

public class AllAlleleResponse {
    private List<SampleAlleleResponse> sampleAlleleResponse;
    private PatientAlleleResponse patientAppointmentResponse;
    private List<ResultAlleleResponse> resultAlleleResponse;
    private List<LocusResponse> locusResponses;

    public List<LocusResponse> getLocusResponses() {
        return locusResponses;
    }

    public void setLocusResponses(List<LocusResponse> locusResponses) {
        this.locusResponses = locusResponses;
    }

    public AllAlleleResponse() {
    }

    public List<SampleAlleleResponse> getSampleAlleleResponse() {
        return sampleAlleleResponse;
    }

    public void setSampleAlleleResponse(List<SampleAlleleResponse> sampleAlleleResponse) {
        this.sampleAlleleResponse = sampleAlleleResponse;
    }

    public PatientAlleleResponse getPatientAppointmentResponse() {
        return patientAppointmentResponse;
    }

    public void setPatientAppointmentResponse(PatientAlleleResponse patientAppointmentResponse) {
        this.patientAppointmentResponse = patientAppointmentResponse;
    }

    public List<ResultAlleleResponse> getResultAlleleResponse() {
        return resultAlleleResponse;
    }

    public void setResultAlleleResponse(List<ResultAlleleResponse> resultAlleleResponse) {
        this.resultAlleleResponse = resultAlleleResponse;
    }
}
