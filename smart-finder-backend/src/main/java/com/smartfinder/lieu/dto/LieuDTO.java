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
    private java.math.BigDecimal latitude;
    private java.math.BigDecimal longitude;
    private String horaires;
    private String imageUrl;
    private java.math.BigDecimal noteMoyenne;
    private List<CritereDTO> criteres;
    private LocalDateTime createdAt;
}
