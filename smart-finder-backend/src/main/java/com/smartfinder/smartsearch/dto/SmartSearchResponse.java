package com.smartfinder.smartsearch.dto;

import com.smartfinder.lieu.dto.LieuDTO;

import java.util.List;
import java.util.Map;

public record SmartSearchResponse(
    List<LieuDTO> results,
    Map<String, Object> extractedCriteria,
    String interpretedQuery,
    int totalResults,
    String searchId
) {}
