package swp.project.adn_backend.dto.response.sample;

public class AllSampleResponse {
    private SampleResponse sampleResponse;
    private PatientSampleResponse patientSampleResponse;
    private StaffSampleResponse staffSampleResponse;

    public AllSampleResponse(SampleResponse sampleResponse, PatientSampleResponse patientSampleResponse, StaffSampleResponse staffSampleResponse) {
        this.sampleResponse = sampleResponse;
        this.patientSampleResponse = patientSampleResponse;
        this.staffSampleResponse = staffSampleResponse;
    }

    public AllSampleResponse() {
    }

    public SampleResponse getSampleResponse() {
        return sampleResponse;
    }

    public void setSampleResponse(SampleResponse sampleResponse) {
        this.sampleResponse = sampleResponse;
    }

    public PatientSampleResponse getPatientSampleResponse() {
        return patientSampleResponse;
    }

    public void setPatientSampleResponse(PatientSampleResponse patientSampleResponse) {
        this.patientSampleResponse = patientSampleResponse;
    }

    public StaffSampleResponse getStaffSampleResponse() {
        return staffSampleResponse;
    }

    public void setStaffSampleResponse(StaffSampleResponse staffSampleResponse) {
        this.staffSampleResponse = staffSampleResponse;
    }
}
