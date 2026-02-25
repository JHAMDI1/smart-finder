package com.smartfinder.lieu.dto;

import com.smartfinder.critere.dto.CritereDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LieuDTO {
    private Long id;
    private String nom;
    private String adresse;
    private String description;
    private Double latitude;
    private Double longitude;
    private String horaires;
    private Double noteMoyenne;
    private List<CritereDTO> criteres;
    private LocalDateTime createdAt;
}
