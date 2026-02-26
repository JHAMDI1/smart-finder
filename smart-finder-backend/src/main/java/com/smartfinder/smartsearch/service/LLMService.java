package com.smartfinder.smartsearch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LLMService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:deepseek-chat}")
    private String model;

    @Value("${openai.base-url:https://api.deepseek.com}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String extractCriteriaFromQuery(String userQuery) {
        String prompt = buildExtractionPrompt(userQuery);

        try {
            // Construire la requête pour DeepSeek API
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content",
                            "Tu es un assistant spécialisé dans l'extraction de critères de recherche pour des espaces de coworking. Réponds uniquement avec un JSON valide contenant les critères identifiés."),
                    Map.of("role", "user", "content", prompt)));
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 500);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Appel à DeepSeek API
            String url = baseUrl + "/v1/chat/completions";
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            if (response == null) {
                throw new RuntimeException("Réponse vide de l'IA");
            }

            // Extraire le contenu de la réponse
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            log.info("Réponse DeepSeek: {}", content);
            return content;

        } catch (Exception e) {
            log.error("Erreur LLM: {}", e.getMessage());
            throw new RuntimeException("Service IA temporairement indisponible");
        }
    }

    private String buildExtractionPrompt(String userQuery) {
        return """
                Analyse cette requête utilisateur pour trouver un espace de coworking:
                "%s"

                Extrais les critères suivants et retourne UNIQUEMENT un JSON de ce format:
                {
                  "ambiance": "calme|dynamique|creatif",
                  "wifiSpeed": "basique|standard|ultra-rapide",
                  "equipments": ["imprimante", "scanner", "video-projecteur", "tableau-blanc"],
                  "services": ["cafe", "restauration", "parking", "salle-reunion"],
                  "accessibilite": "pmr|famille|animaux",
                  "budget": "economique|standard|premium",
                  "localisation": "centre-ville|peripherie|gare|aeroport",
                  "horaires": "24-7|standard|weekend"
                }

                Règles:
                - Retourne UNIQUEMENT le JSON, sans markdown, sans explication
                - Si un critère n'est pas mentionné, mets la valeur à null ou liste vide
                - Pour les budgets: "pas cher" = economique, "luxe" = premium
                - Pour le wifi: "fibre" ou "rapide" = ultra-rapide
                """.formatted(userQuery);
    }
}
