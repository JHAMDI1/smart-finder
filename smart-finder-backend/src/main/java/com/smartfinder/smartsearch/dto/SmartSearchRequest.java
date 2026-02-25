package com.smartfinder.smartsearch.dto;

import java.util.List;

public record SmartSearchRequest(
    String userQuery,
    Double latitude,
    Double longitude,
    Double radiusKm
) {}
