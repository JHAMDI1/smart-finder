package com.smartfinder.smartsearch.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
public class LLMService {

    private final OpenAiService openAiService;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    public LLMService(@Value("${openai.api.key}") String apiKey) {
        this.openAiService = new OpenAiService(apiKey, Duration.ofSeconds(30));
    }

    public String extractCriteriaFromQuery(String userQuery) {
        String prompt = buildExtractionPrompt(userQuery);
        
        ChatMessage systemMessage = new ChatMessage("system", 
            "Tu es un assistant spécialisé dans l'extraction de critères de recherche pour des espaces de coworking. " +
            "Réponds uniquement avec un JSON valide contenant les critères identifiés.");
        
        ChatMessage userMessage = new ChatMessage("user", prompt);
        
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(List.of(systemMessage, userMessage))
                .temperature(0.3)
                .maxTokens(500)
                .build();

        try {
            String response = openAiService.createChatCompletion(request)
                    .getChoices().get(0).getMessage().getContent();
            log.info("Réponse LLM: {}", response);
            return response;
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
