package swp.project.adn_backend.dto.InfoDTO;

public class LocusInfoDTO {
    private long locusId;
    private String locusName;
    private String description;

    public LocusInfoDTO(long locusId, String locusName, String description) {
        this.locusId = locusId;
        this.locusName = locusName;
        this.description = description;
    }

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
