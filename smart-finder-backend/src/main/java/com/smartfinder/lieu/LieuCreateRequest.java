package com.smartfinder.lieu;

import lombok.Data;

import java.util.List;

@Data
public class LieuCreateRequest {
    private String nom;
    private String adresse;
    private String description;
    private Double latitude;
    private Double longitude;
    private String horaires;
    private List<Long> critereIds;
}
