package swp.project.adn_backend.dto.response.result;

public class LocusResponse {
    private long locusId;
    private String locusName;
    private String description;

    public long getLocusId() {
        return locusId;
    }

    public void setLocusId(long locusId) {
        this.locusId = locusId;
    }

    public String getLocusName() {
        return locusName;
    }

    public void setLocusName(String locusName) {
        this.locusName = locusName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
