# Slides de Soutenance PFE - Smart Finder

## Slide 1 : Page de titre
**Smart Finder**
Plateforme intelligente de recommandation d'espaces de coworking

[Votre Nom]
[Filière] - 2026
Encadrant : [Nom]

---

## Slide 2 : Plan de la présentation
1. Contexte et problématique
2. Cahier des charges
3. Architecture technique
4. Développement (Phases 1-7)
5. Démonstration
6. Bilan et perspectives

---

## Slide 3 : Contexte
- Marché du coworking en Tunisie : 50+ espaces
- Difficulté à trouver l'espace idéal
- Plateformes existantes : recherche basique, pas d'IA
- Besoin : recommandations personnalisées

**Opportunité** : Intégrer l'IA pour comprendre les besoins en langage naturel

---

## Slide 4 : Problématique
**Comment concevoir une plateforme web intelligente capable de recommander les espaces de coworking les plus pertinents ?**

Contraintes :
- Recherche par filtres dynamiques
- Requêtes en langage naturel
- Performance < 2s
- Mobile-first

---

## Slide 5 : Solution proposée
**Smart Finder** - 3 fonctionnalités clés :

1. 🔍 **Recherche par filtres** - JPA Specifications
2. 🤖 **Concierge Virtuel (IA)** - OpenAI GPT-4o-mini
3. 🔐 **Authentification sécurisée** - JWT

---

## Slide 6 : Stack Technique
**Backend :**
- Java 23, Spring Boot 3.4.2
- Spring Security + JWT
- JPA/Hibernate, MySQL
- OpenAI API, Flyway

**Frontend :**
- Angular 19, TypeScript 5.7
- Tailwind CSS, RxJS
- Standalone components

---

## Slide 7 : Architecture
**Feature-based architecture**

```
Backend              Frontend
--------             --------
auth/                auth/      
lieu/                lieu/
critere/             critere/
avis/                avis/
smartsearch/         smart-search/
shared/              shared/
```

✅ Modularité, maintenabilité, scalabilité

---

## Slide 8 : Phase 3 - Moteur de recherche
**JPA Specifications**
```java
Specification<Lieu> spec = Specification.where(null);
if (wifi) spec = spec.and(hasCritereNom("WiFi"));
if (parking) spec = spec.and(hasCritereNom("Parking"));
```

**Optimisation BDD :**
- 11 index MySQL
- Flyway migrations V1, V2, V3
- Temps réponse : ~800ms

---

## Slide 9 : Phase 6 - Module IA
**Concierge Virtuel**

1. Input utilisateur : *"Café calme avec fibre pour 5 personnes"*
2. Extraction IA (GPT-4o-mini) → JSON
3. Mapping vers critères BDD
4. Recherche standard
5. Résultats + explication

**Circuit Breaker** : Fallback si API down

---

## Slide 10 : Sécurité (Phase 5)
**JWT Authentication**

Backend :
- JwtUtil (génération/validation)
- JwtAuthenticationFilter
- SecurityConfig (CORS, routes)

Frontend :
- AuthInterceptor (Bearer token)
- AuthGuard (protection routes)

✅ Mots de passe hashés (BCrypt)
✅ CORS origines explicites

---

## Slide 11 : Fonctionnalités livrées
| Fonctionnalité | Status |
|----------------|--------|
| Recherche filtres | ✅ |
| Recherche IA | ✅ |
| Authentification JWT | ✅ |
| CRUD espaces | ✅ |
| Système avis | ✅ |
| Mobile-first | ✅ |

9 commits Git, 2 READMEs, Documentation complète

---

## Slide 12 : Démonstration
**Scénario 1 :** Recherche par filtres
→ Interface avec checkboxes, résultats instantanés

**Scénario 2 :** Concierge Virtuel
→ "Espace calme avec parking près de la gare"
→ Extraction critères par IA

**Scénario 3 :** Authentification
→ Login JWT, accès routes protégées

---

## Slide 13 : Résultats
**Performances :**
- Recherche standard : ~800ms (objectif < 2s) ✅
- Recherche IA : ~1.5s (objectif < 3s) ✅

**Sécurité :**
- JWT 24h expiration
- BCrypt password hashing
- CORS strict
- Pas de secrets en dur

---

## Slide 14 : Bilan
**Points forts :**
✅ Architecture modulaire
✅ Moteur de recherche performant
✅ Module IA innovant
✅ Code documenté et versionné

**Difficultés :**
⚠️ Configuration CORS avec credentials
⚠️ Optimisation requêtes N+1
⚠️ Prompt engineering IA

---

## Slide 15 : Perspectives
**Évolutions futures :**

1. 🗺️ Intégration Google Maps (géolocalisation)
2. 📱 Application mobile (React Native)
3. 🔄 Cache Redis (performances)
4. 🤝 Système de recommandation collaboratif
5. 🚀 CI/CD avec GitHub Actions

---

## Slide 16 : Conclusion
**Smart Finder** = Plateforme complète de recommandation avec IA

**Innovation :** Concierge Virtuel pour recherche en langage naturel

**Technologies :** Spring Boot, Angular, OpenAI, JWT

**Livrables :** 7 phases, 9 commits, documentation complète

---

## Slide 17 : Questions
**Merci de votre attention !**

Questions ?

📧 [votre.email@example.com]
🔗 [lien-repository-github]

---

## Annexes (Slides de secours)

### A. Diagramme ERD
[Schéma entités : Utilisateur, Lieu, Critere, Avis, Lieu_Critere]

### B. Architecture JWT
[Schéma : Login → JWT → Requêtes protégées]

### C. Prompt IA
```
"Analyse cette requête et extrais les critères...
Réponds UNIQUEMENT en JSON"
```

### D. Captures d'écran
[Interfaces mobile et desktop]

---

**Durée conseillée :** 20-25 minutes
**Format :** PDF ou PowerPoint
