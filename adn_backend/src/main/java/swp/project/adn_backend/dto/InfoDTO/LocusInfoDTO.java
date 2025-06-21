package swp.project.adn_backend.dto.InfoDTO;

public class LocusInfoDTO {
    private long id;
    private String locusName;
    private String description;

    public LocusInfoDTO(long id, String locusName, String description) {
        this.id = id;
        this.locusName = locusName;
        this.description = description;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
