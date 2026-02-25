package com.smartfinder.critere.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CritereDTO {
    private Long id;
    private String nom;
    private String description;
    private String categorie;
    private String icon;
    private Boolean actif;
    private LocalDateTime createdAt;
}
