package com.smartfinder.smartsearch.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartfinder.critere.Critere;
import com.smartfinder.critere.CritereRepository;
import com.smartfinder.lieu.Lieu;
import com.smartfinder.lieu.LieuRepository;
import com.smartfinder.lieu.dto.LieuDTO;
import com.smartfinder.lieu.mapper.LieuMapper;
import com.smartfinder.smartsearch.dto.SmartSearchRequest;
import com.smartfinder.smartsearch.dto.SmartSearchResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmartSearchService {

    private final LLMService llmService;
    private final CritereRepository critereRepository;
    private final LieuRepository lieuRepository;
    private final LieuMapper lieuMapper;
    private final ObjectMapper objectMapper;

    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackSearch")
    public SmartSearchResponse smartSearch(SmartSearchRequest request) {
        log.info("Smart search pour: {}", request.userQuery());

        // 1. Appel LLM pour extraire les critères
        String llmResponse = llmService.extractCriteriaFromQuery(request.userQuery());
        
        // 2. Parser la réponse JSON
        Map<String, Object> extractedCriteria = parseLLMResponse(llmResponse);
        
        // 3. Mapper les critères vers les IDs de la BDD
        List<Long> critereIds = mapCriteriaToIds(extractedCriteria);
        
        // 4. Rechercher les lieux correspondants
        List<Lieu> matchingLieux;
        if (critereIds.isEmpty()) {
            matchingLieux = lieuRepository.findAll();
        } else {
            matchingLieux = lieuRepository.findByCriteriaIds(critereIds, critereIds.size());
        }
        
        // 5. Trier par pertinence (score basé sur le nombre de critères matchés)
        List<LieuDTO> results = matchingLieux.stream()
                .map(lieuMapper::toDto)
                .collect(Collectors.toList());
        
        return new SmartSearchResponse(
                results,
                extractedCriteria,
                "Recherche intelligente pour: " + request.userQuery(),
                results.size(),
                UUID.randomUUID().toString()
        );
    }

    private Map<String, Object> parseLLMResponse(String response) {
        try {
            // Nettoyer la réponse (enlever markdown si présent)
            String cleanJson = response.replaceAll("```json", "")
                                       .replaceAll("```", "")
                                       .trim();
            return objectMapper.readValue(cleanJson, Map.class);
        } catch (Exception e) {
            log.error("Erreur parsing LLM response: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private List<Long> mapCriteriaToIds(Map<String, Object> criteria) {
        List<Long> ids = new ArrayList<>();
        
        // Récupérer tous les critères actifs
        List<Critere> allCriteres = critereRepository.findByActifTrue();
        
        // Mapper ambiance
        if (criteria.get("ambiance") != null) {
            String ambiance = criteria.get("ambiance").toString().toLowerCase();
            allCriteres.stream()
                    .filter(c -> c.getNom().toLowerCase().contains(ambiance) ||
                                (c.getCategorie() != null && c.getCategorie().toString().toLowerCase().contains("ambiance")))
                    .findFirst()
                    .ifPresent(c -> ids.add(c.getId()));
        }
        
        // Mapper équipements
        @SuppressWarnings("unchecked")
        List<String> equipments = (List<String>) criteria.get("equipments");
        if (equipments != null) {
            for (String equip : equipments) {
                String equipLower = equip.toLowerCase();
                allCriteres.stream()
                        .filter(c -> c.getNom().toLowerCase().contains(equipLower))
                        .findFirst()
                        .ifPresent(c -> ids.add(c.getId()));
            }
        }
        
        // Mapper services
        @SuppressWarnings("unchecked")
        List<String> services = (List<String>) criteria.get("services");
        if (services != null) {
            for (String service : services) {
                String serviceLower = service.toLowerCase();
                allCriteres.stream()
                        .filter(c -> c.getNom().toLowerCase().contains(serviceLower))
                        .findFirst()
                        .ifPresent(c -> ids.add(c.getId()));
            }
        }
        
        // Mapper wifi
        if (criteria.get("wifiSpeed") != null) {
            String wifi = criteria.get("wifiSpeed").toString().toLowerCase();
            allCriteres.stream()
                    .filter(c -> c.getNom().toLowerCase().contains("wifi") ||
                                c.getNom().toLowerCase().contains("fibre") ||
                                c.getNom().toLowerCase().contains("internet"))
                    .findFirst()
                    .ifPresent(c -> ids.add(c.getId()));
        }
        
        return ids.stream().distinct().collect(Collectors.toList());
    }

    // Fallback si le service LLM est indisponible
    public SmartSearchResponse fallbackSearch(SmartSearchRequest request, Throwable t) {
        log.warn("Fallback activé pour smart-search: {}", t.getMessage());
        
        // Recherche simple par mots-clés dans la description
        List<Lieu> allLieux = lieuRepository.findAll();
        String query = request.userQuery().toLowerCase();
        
        List<LieuDTO> results = allLieux.stream()
                .filter(l -> l.getDescription() != null && 
                            l.getDescription().toLowerCase().contains(query))
                .map(lieuMapper::toDto)
                .collect(Collectors.toList());
        
        return new SmartSearchResponse(
                results,
                Map.of("fallback", true, "error", t.getMessage()),
                "Recherche de secours (service IA indisponible)",
                results.size(),
                UUID.randomUUID().toString()
        );
    }
}
