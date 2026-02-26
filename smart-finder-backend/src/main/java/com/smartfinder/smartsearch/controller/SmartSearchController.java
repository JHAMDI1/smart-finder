package com.smartfinder.smartsearch.controller;

import com.smartfinder.smartsearch.dto.SmartSearchRequest;
import com.smartfinder.smartsearch.dto.SmartSearchResponse;
import com.smartfinder.smartsearch.service.SmartSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SmartSearchController {

    private final SmartSearchService smartSearchService;

    @PostMapping("/smart-search")
    public ResponseEntity<SmartSearchResponse> smartSearch(@RequestBody SmartSearchRequest request) {
        SmartSearchResponse response = smartSearchService.smartSearch(request);
        return ResponseEntity.ok(response);
    }
}
