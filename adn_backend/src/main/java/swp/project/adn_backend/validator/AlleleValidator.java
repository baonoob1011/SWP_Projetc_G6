package swp.project.adn_backend.validator;

import java.util.*;

public class AlleleValidator {

    // Danh sách allele hợp lệ theo locus STR
    private static final Map<String, Set<String>> VALID_ALLELES = new HashMap<>();

    static {
        VALID_ALLELES.put("TH01", new HashSet<>(Arrays.asList("6", "7", "8", "9", "9.3", "10", "11")));
        VALID_ALLELES.put("D3S1358", new HashSet<>(Arrays.asList("12", "13", "14", "15", "16", "17", "18")));
        VALID_ALLELES.put("vWA", new HashSet<>(Arrays.asList("14", "15", "16", "17", "18", "19", "20", "21")));
        VALID_ALLELES.put("FGA", new HashSet<>(Arrays.asList("18", "19", "20", "21", "22", "23", "24", "25")));
        VALID_ALLELES.put("D8S1179", new HashSet<>(Arrays.asList("9", "10", "11", "12", "13", "14", "15", "16")));
        VALID_ALLELES.put("D21S11", new HashSet<>(Arrays.asList("25", "26", "27", "28", "29", "30", "31", "32", "32.2", "33.2", "34.2")));
        VALID_ALLELES.put("D18S51", new HashSet<>(Arrays.asList("12", "13", "14", "15", "16", "17", "18", "19")));
        VALID_ALLELES.put("D5S818", new HashSet<>(Arrays.asList("9", "10", "11", "12", "13")));
        VALID_ALLELES.put("D13S317", new HashSet<>(Arrays.asList("8", "9", "10", "11", "12", "13")));
        VALID_ALLELES.put("D7S820", new HashSet<>(Arrays.asList("8", "9", "10", "11", "12", "13", "14")));
        VALID_ALLELES.put("D16S539", new HashSet<>(Arrays.asList("9", "10", "11", "12", "13", "14")));
        VALID_ALLELES.put("TPOX", new HashSet<>(Arrays.asList("6", "7", "8", "9", "10", "11")));
        VALID_ALLELES.put("CSF1PO", new HashSet<>(Arrays.asList("8", "9", "10", "11", "12", "13")));
        VALID_ALLELES.put("D19S433", new HashSet<>(Arrays.asList("13", "14", "15", "16", "17", "18", "19", "20", "21", "22")));
        VALID_ALLELES.put("D2S1338", new HashSet<>(Arrays.asList("17", "18", "19", "20", "21", "22", "23", "24")));
        VALID_ALLELES.put("D12S391", new HashSet<>(Arrays.asList("17", "18", "19", "20", "21", "22", "23", "24")));
    }


    public static boolean isValid(String locus, String alleleValue) {
        if (locus == null || alleleValue == null) return false;

        // Chuẩn hóa tên locus giống key trong VALID_ALLELES (không ép hoa)
        Set<String> valid = VALID_ALLELES.get(locus.trim());

        // Chuẩn hóa allele: bỏ khoảng trắng, ".0" nếu có
        String normalized = alleleValue.trim();
        if (normalized.endsWith(".0")) {
            normalized = normalized.substring(0, normalized.length() - 2);
        }

        return valid != null && valid.contains(normalized);
    }



}