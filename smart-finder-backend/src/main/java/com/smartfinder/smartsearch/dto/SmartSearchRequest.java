package com.smartfinder.smartsearch.dto;

public record SmartSearchRequest(
        String userQuery,
        Double latitude,
        Double longitude,
        Double radiusKm) {
}
