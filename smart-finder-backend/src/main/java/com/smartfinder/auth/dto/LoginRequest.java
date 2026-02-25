package com.smartfinder.auth.dto;

public record LoginRequest(
    String email,
    String password
) {}
