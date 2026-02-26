package com.smartfinder.lieu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class LieuCreateRequest {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne doit pas dépasser 255 caractères")
    private String nom;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 500, message = "L'adresse ne doit pas dépasser 500 caractères")
    private String adresse;

    @Size(max = 2000, message = "La description ne doit pas dépasser 2000 caractères")
    private String description;

    private java.math.BigDecimal latitude;
    private java.math.BigDecimal longitude;
    private String horaires;
    private List<Long> critereIds;
}
