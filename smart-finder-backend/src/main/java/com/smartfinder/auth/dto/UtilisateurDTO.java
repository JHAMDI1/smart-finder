package com.smartfinder.auth.dto;

import lombok.Data;

@Data
public class UtilisateurDTO {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String role;
}
