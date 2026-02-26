package com.smartfinder.lieu;

import lombok.Data;

import java.util.List;

@Data
public class LieuCreateRequest {
    private String nom;
    private String adresse;
    private String description;
    private java.math.BigDecimal latitude;
    private java.math.BigDecimal longitude;
    private String horaires;
    private List<Long> critereIds;
}
