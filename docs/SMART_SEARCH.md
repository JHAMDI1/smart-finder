# 🤖 Smart Search - Module IA

Documentation complète du Concierge Virtuel (Smart Finder AI).

---

## 📋 Table des Matières

- [Architecture](#architecture)
- [Prompt Engineering](#prompt-engineering)
- [API Reference](#api-reference)
- [Fallback Strategy](#fallback-strategy)
- [Testing](#testing)

---

## 🏗️ Architecture

### Component Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SMART SEARCH ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Input: "café calme avec wifi ouvert le dimanche"                 │
│                                                                         │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. PREPROCESSING                                                │   │
│  │    • Normalize text                                            │   │
│  │    • Remove special chars                                      │   │
│  │    • Truncate if > 500 chars                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 2. PROMPT BUILDER                                               │   │
│  │    • Load template                                             │   │
│  │    • Inject available criteria (from cache)                    │   │
│  │    • Add few-shot examples                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 3. LLM SERVICE                                                  │   │
│  │    • Call OpenAI/Claude API                                    │   │
│  │    • Timeout: 5s                                               │   │
│  │    • Retry: 3 attempts with backoff                            │   │
│  │    • Circuit breaker pattern                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 4. RESPONSE PARSER                                              │   │
│  │    • Validate JSON schema                                      │   │
│  │    • Extract tags[]                                            │   │
│  │    • Check confidence score                                    │   │
│  │    • Identify unknown criteria                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 5. TAG MAPPER                                                   │   │
│  │    • Map tag names → Database IDs                              │   │
│  │    • Handle missing matches                                    │   │
│  │    • Filter inactive criteria                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 6. SEARCH EXECUTION                                             │   │
│  │    • Call LieuSearchService                                    │   │
│  │    • Apply standard ranking                                    │   │
│  │    • Return paginated results                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│     │                                                                   │
│     ▼                                                                   │
│  Response: {query, understood, results, unknownCriteria}                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Prompt Engineering

### Main Prompt Template

```
Tu es un assistant intelligent pour une application de recherche d'espaces de travail.

CONTEXTE:
L'utilisateur cherche un lieu (café, bibliothèque, espace de coworking) pour travailler ou étudier.
Il décrit ses besoins en langage naturel.

REQUÊTE UTILISATEUR:
"{userQuery}"

CRITÈRES DISPONIBLES EN BASE DE DONNÉES:
{availableCriteria}

TAÂCHE:
Analyse la requête et extrais les critères/tags pertinents parmi ceux disponibles.

RÈGLES:
1. Ne retourne QUE des critères existants dans la liste ci-dessus
2. Si un critère mentionné n'existe pas, l'ajouter à "unknownCriteria"
3. Associe chaque critère à sa confiance (0.0 - 1.0)
4. Fournis une explication claire de ce qui a été compris

FORMAT DE RÉPONSE (JSON strict):
{
  "tags": ["nom_critere1", "nom_critere2"],
  "confidence": 0.95,
  "explanation": "J'ai compris que vous cherchez...",
  "unknownCriteria": []
}

EXEMPLES:
Input: "Je veux un endroit calme avec du wifi pour bosser"
Output: {
  "tags": ["calme", "wifi"],
  "confidence": 0.98,
  "explanation": "Espace calme avec connexion wifi pour travailler",
  "unknownCriteria": []
}

Input: "Café sympa avec terrasse chauffée et prises"
Output: {
  "tags": ["prises"],
  "confidence": 0.85,
  "explanation": "Café avec prises électriques disponibles",
  "unknownCriteria": ["terrasse chauffée"]
}
```

### Few-Shot Examples

```
EXEMPLES SUPPLÉMENTAIRES:

Exemple 1:
Input: "Un café animé avec bon café et vegan options"
Output: {
  "tags": ["anime", "cafe", "vegan"],
  "confidence": 0.92,
  "explanation": "Café animé proposant du café de qualité et options vegan",
  "unknownCriteria": []
}

Exemple 2:
Input: "Bibliothèque ouverte le weekend avec wifi"
Output: {
  "tags": ["wifi", "dimanche"],
  "confidence": 0.88,
  "explanation": "Bibliothèque avec wifi, ouverte le dimanche (weekend)",
  "unknownCriteria": ["samedi"]
}

Exemple 3:
Input: "Endroit accessible en fauteuil avec parking"
Output: {
  "tags": ["pmr", "parking"],
  "confidence": 0.95,
  "explanation": "Espace accessible PMR avec parking à proximité",
  "unknownCriteria": []
}
```

### Prompt File Location

```
src/main/resources/prompts/search-extraction.txt
```

---

## 🔌 API Reference

### Endpoint

```
POST /api/v1/smart-search
```

### Request

```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec des prises pour bosser"
}
```

### Response (Success)

```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec des prises pour bosser",
  "understood": {
    "tags": ["wifi", "prises", "calme", "dimanche"],
    "tagIds": [1, 3, 5, 12],
    "explanation": "Café avec ambiance calme, ouvert le dimanche, équipé en prises électriques et wifi"
  },
  "results": [
    {
      "id": 1,
      "nom": "Le Café Tranquille",
      "adresse": "12 Rue de la Paix, Paris",
      "noteMoyenne": 4.5,
      "criteres": [
        {"id": 1, "nom": "wifi", "categorie": "CONNECTIVITE"},
        {"id": 3, "nom": "prises", "categorie": "CONNECTIVITE"},
        {"id": 5, "nom": "calme", "categorie": "AMBIANCE"},
        {"id": 12, "nom": "dimanche", "categorie": "HORAIRES"}
      ]
    }
  ],
  "unknownCriteria": [],
  "fallback": false
}
```

### Response (With Unknown Criteria)

```json
{
  "query": "Café avec terrasse chauffée et wifi",
  "understood": {
    "tags": ["wifi"],
    "tagIds": [1],
    "explanation": "Café avec connexion wifi"
  },
  "results": [...],
  "unknownCriteria": ["terrasse chauffée"],
  "message": "Le critère 'terrasse chauffée' n'est pas encore disponible. Nous avons cherché avec vos autres critères.",
  "fallback": false
}
```

### Response (LLM Error - Fallback)

```json
{
  "query": "Café calme avec wifi",
  "understood": {
    "tags": ["calme", "wifi"],
    "tagIds": [5, 1],
    "explanation": "Extraction par mots-clés (service IA indisponible)"
  },
  "results": [...],
  "unknownCriteria": [],
  "fallback": true,
  "message": "Le service IA est temporairement indisponible. Recherche par mots-clés activée."
}
```

---

## 🛡️ Fallback Strategy

### Circuit Breaker Pattern

```java
@Component
public class LLMService {
    
    private final CircuitBreaker circuitBreaker;
    private final KeywordExtractor fallbackExtractor;
    
    public SmartSearchResponse search(String query) {
        return circuitBreaker.execute(
            () -> callLLM(query),           // Normal path
            () -> fallbackSearch(query)      // Fallback path
        );
    }
    
    private SmartSearchResponse callLLM(String query) {
        // Call OpenAI/Claude API
        // Timeout: 5s
        // Retry: 3 attempts
    }
    
    private SmartSearchResponse fallbackSearch(String query) {
        // Simple keyword matching
        // Extract words that match available criteria
        // Lower confidence
        log.warn("LLM fallback activated for query: {}", query);
        
        List<String> keywords = Arrays.asList(query.toLowerCase().split("\\s+"));
        List<String> matchedTags = availableCriteria.stream()
            .filter(c -> keywords.contains(c.getNom()))
            .map(Critere::getNom)
            .collect(Collectors.toList());
        
        return SmartSearchResponse.builder()
            .query(query)
            .understood(Understood.builder()
                .tags(matchedTags)
                .explanation("Extraction par mots-clés (service IA indisponible)")
                .build())
            .fallback(true)
            .build();
    }
}
```

### Error Scenarios

| Scenario | Action | User Message |
|----------|--------|--------------|
| LLM Timeout (>5s) | Fallback + cache result | "Recherche rapide activée" |
| LLM Error (5xx) | Fallback + retry in 30s | "Service temporairement limité" |
| Invalid JSON response | Fallback | "Extraction simplifiée" |
| Rate limited (429) | Queue + fallback | "Recherche alternative" |
| All retries failed | Full fallback | "Recherche par filtres manuels" |

---

## 🧪 Testing

### Unit Test Example

```java
@SpringBootTest
class SmartSearchServiceTest {
    
    @Autowired
    private SmartSearchService smartSearchService;
    
    @MockBean
    private LLMService llmService;
    
    @Test
    void shouldExtractCriteriaFromNaturalLanguage() {
        // Given
        String query = "café calme avec wifi ouvert le dimanche";
        LLMResponse mockResponse = LLMResponse.builder()
            .tags(Arrays.asList("wifi", "calme", "dimanche"))
            .confidence(0.95)
            .explanation("Café calme avec wifi ouvert dimanche")
            .unknownCriteria(Collections.emptyList())
            .build();
        
        when(llmService.extractCriteria(query)).thenReturn(mockResponse);
        
        // When
        SmartSearchResponse result = smartSearchService.search(query);
        
        // Then
        assertNotNull(result);
        assertEquals(3, result.getUnderstood().getTags().size());
        assertTrue(result.getUnderstood().getTags().contains("wifi"));
        assertFalse(result.isFallback());
    }
    
    @Test
    void shouldHandleUnknownCriteria() {
        // Given
        String query = "café avec terrasse chauffée et wifi";
        LLMResponse mockResponse = LLMResponse.builder()
            .tags(Arrays.asList("wifi"))
            .unknownCriteria(Arrays.asList("terrasse chauffée"))
            .build();
        
        when(llmService.extractCriteria(query)).thenReturn(mockResponse);
        
        // When
        SmartSearchResponse result = smartSearchService.search(query);
        
        // Then
        assertEquals(1, result.getUnderstood().getTags().size());
        assertEquals(1, result.getUnknownCriteria().size());
        assertEquals("terrasse chauffée", result.getUnknownCriteria().get(0));
    }
    
    @Test
    void shouldFallbackWhenLLMUnavailable() {
        // Given
        String query = "café calme";
        when(llmService.extractCriteria(query))
            .thenThrow(new LLMServiceException("API unavailable"));
        
        // When
        SmartSearchResponse result = smartSearchService.search(query);
        
        // Then
        assertTrue(result.isFallback());
        assertNotNull(result.getResults());
    }
}
```

### Integration Test

```java
@Test
void endToEndSmartSearch() {
    // 1. Seed database with criteria and places
    // 2. Call /api/v1/smart-search endpoint
    // 3. Verify response structure
    // 4. Verify results are relevant
}
```

### Performance Test

```java
@Test
void shouldRespondWithin2Seconds() {
    String query = "café calme avec wifi";
    
    long start = System.currentTimeMillis();
    SmartSearchResponse result = smartSearchService.search(query);
    long duration = System.currentTimeMillis() - start;
    
    assertTrue(duration < 2000, "Response time should be < 2s");
}
```

---

## 💡 Best Practices

### 1. **Caching**

```java
@Cacheable(value = "smartSearch", key = "#query.hashCode()")
public SmartSearchResponse search(String query) {
    // ...
}

@CacheEvict(value = "smartSearch", allEntries = true)
public void clearCache() {
    // Called when criteria change
}
```

### 2. **Rate Limiting**

```java
@Component
public class RateLimiter {
    private final Map<String, AtomicInteger> requests = new ConcurrentHashMap<>();
    
    public boolean allowRequest(String userId) {
        // Implement token bucket or sliding window
        // Limit: 10 requests per minute per user
    }
}
```

### 3. **Logging**

```java
@Slf4j
@Service
public class SmartSearchService {
    
    public SmartSearchResponse search(String query) {
        log.info("Smart search query: {}", query);
        
        try {
            // ...
            log.info("Smart search completed: {} tags found", 
                response.getUnderstood().getTags().size());
            return response;
        } catch (Exception e) {
            log.error("Smart search failed for query: {}", query, e);
            return fallbackSearch(query);
        }
    }
}
```

---

## 📊 Monitoring

### Metrics to Track

| Metric | Target | Alert If |
|--------|--------|----------|
| Response time | < 2s | > 3s |
| Success rate | > 95% | < 90% |
| Fallback rate | < 5% | > 10% |
| Cache hit rate | > 30% | < 20% |
| Unknown criteria | Track | Analyze trends |

### Dashboard Queries (Prometheus/Grafana)

```promql
# Response time
histogram_quantile(0.95, rate(smart_search_duration_seconds_bucket[5m]))

# Error rate
rate(smart_search_errors_total[5m]) / rate(smart_search_total[5m])

# Fallback rate
rate(smart_search_fallback_total[5m]) / rate(smart_search_total[5m])
```

---

## 📚 Related Documentation

- [Backend Guide](../BACKEND_GUIDE.md) - Implementation details
- [API Reference](../API_REFERENCE.md) - Endpoint specifications
- [Architecture](../ARCHITECTURE.md) - System design

---

**Version** : 1.0  
**Last Updated** : Février 2026
