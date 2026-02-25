package com.smartfinder.auth.dto;

public record LoginResponse(
    String token,
    Long id,
    String email,
    String prenom,
    String nom,
    String role
) {}
