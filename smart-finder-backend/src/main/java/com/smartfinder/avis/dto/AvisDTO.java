package com.smartfinder.avis.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AvisDTO {
    private Long id;
    private Integer note;
    private String commentaire;
    private String auteurNom;
    private String auteurPrenom;
    private LocalDateTime createdAt;
}
