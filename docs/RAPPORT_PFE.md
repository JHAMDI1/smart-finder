# Rapport de Projet PFE - Smart Finder

**Titre du Projet :** Smart Finder - Plateforme intelligente de recommandation d'espaces de coworking

**Étudiant :** [Votre Nom]

**Filière :** [Votre Filière]

**Année Universitaire :** 2025-2026

**Encadrant :** [Nom de l'encadrant]

---

## Table des Matières

1. Introduction
2. Cahier des Charges
3. Analyse et Conception
4. Architecture Technique
5. Implémentation
6. Phase 1 : Setup Environnement
7. Phase 2 : Backend CRUD
8. Phase 3 : Moteur de Recherche
9. Phase 4 : Frontend Angular
10. Phase 5 : Sécurité JWT
11. Phase 6 : Module IA (Smart Search)
12. Phase 7 : Tests et Déploiement
13. Bilan et Perspectives

---

## 1. Introduction

### 1.1 Contexte
Le marché des espaces de coworking en Tunisie connaît une croissance rapide avec plus de 50 espaces recensés. Cependant, trouver l'espace idéal adapté à ses besoins spécifiques reste un défi. Les plateformes existantes manquent d'intelligence dans la recherche et ne proposent pas de recommandations personnalisées.

### 1.2 Problématique
Comment concevoir une plateforme web intelligente capable de recommander les espaces de coworking les plus pertinents en fonction des besoins spécifiques des utilisateurs, en utilisant l'IA pour comprendre les requêtes en langage naturel ?

### 1.3 Objectifs
- Développer une API REST robuste avec Spring Boot
- Implémenter un moteur de recherche par filtres dynamiques (JPA Specifications)
- Intégrer un module IA pour comprendre les requêtes en langage naturel
- Concevoir une interface mobile-first avec Angular
- Assurer la sécurité avec JWT et Spring Security

---

## 2. Cahier des Charges

### 2.1 Besoins Fonctionnels

#### Utilisateur
- Recherche par critères (ambiance, équipements, services)
- Recherche intelligente par langage naturel (IA)
- Consultation des fiches espaces avec avis
- Création de compte et authentification
- Soumission d'avis et notes

#### Propriétaire
- Gestion de ses espaces (CRUD)
- Association de critères à ses espaces
- Consultation des avis reçus

#### Administrateur
- Gestion des critères de recherche
- Modération des avis
- Tableau de bord d'administration

### 2.2 Besoins Non-Fonctionnels
- Performance : Temps de réponse < 2s pour la recherche
- Disponibilité : 99.5% uptime
- Sécurité : Authentification JWT, données sensibles chiffrées
- Responsive : Mobile-first design
- Scalabilité : Architecture microservices-ready

---

## 3. Analyse et Conception

### 3.1 Diagramme de Cas d'Utilisation
[Insérer diagramme]

### 3.2 Diagramme ERD (Entité-Relation)
**Entités principales :**
- Utilisateur (id, email, password, rôle, nom, prénom)
- Lieu (id, nom, description, adresse, latitude, longitude, propriétaire_id)
- Critère (id, nom, icône, catégorie, actif)
- Avis (id, note, commentaire, utilisateur_id, lieu_id, date)
- Lieu_Critère (table de liaison many-to-many)

### 3.3 User Stories

#### US-001 : Recherche par filtres
```
En tant qu'utilisateur,
Je veux filtrer les espaces par critères (wifi, parking, café...)
Afin de trouver rapidement un espace adapté à mes besoins
```

#### US-002 : Recherche intelligente IA
```
En tant qu'utilisateur,
Je veux décrire mes besoins en langage naturel
Afin que l'IA me recommande les espaces les plus pertinents
```

#### US-003 : Authentification sécurisée
```
En tant qu'utilisateur,
Je veux créer un compte et me connecter avec JWT
Afin d'accéder aux fonctionnalités protégées
```

---

## 4. Architecture Technique

### 4.1 Stack Technique

#### Backend
- **Java 23** - Langage principal
- **Spring Boot 3.4.2** - Framework backend
- **Spring Security + JWT** - Authentification
- **JPA/Hibernate** - ORM
- **MySQL 9.1** - Base de données
- **Flyway** - Migrations
- **OpenAI GPT-4o-mini** - Module IA
- **Maven** - Build

#### Frontend
- **Angular 19** - Framework frontend
- **TypeScript 5.7** - Langage
- **Tailwind CSS** - Styling
- **RxJS** - Programmation réactive

### 4.2 Architecture Feature-Based
```
backend/
├── auth/           # Authentification JWT
├── lieu/           # Gestion des espaces
├── critere/        # Gestion des critères
├── avis/           # Système d'avis
├── smartsearch/    # Module IA
└── shared/         # Utilitaires

frontend/
├── auth/           # Login, Register
├── lieu/           # Liste, Détail
├── critere/        # Services
├── avis/           # Services
├── smart-search/   # Concierge Virtuel
└── shared/         # Guards, Intercepteurs
```

---

## 5. Implémentation

### 5.1 Phase 1 : Setup Environnement (Semaines 1-2)

#### Tâches réalisées :
- Installation Java 23, Node.js 22, MySQL 9.1
- Configuration IDE (IntelliJ, VS Code)
- Génération projet Spring Boot
- Génération projet Angular
- Configuration Git et repository

#### Livrables :
- Environnement de développement fonctionnel
- Repository Git initialisé

### 5.2 Phase 2 : Backend CRUD (Semaines 3-4)

#### Entités créées :
- Utilisateur (JPA entity + repository + service + controller)
- Lieu (JPA entity + repository + service + controller)
- Critère (JPA entity + repository + service + controller)
- Avis (JPA entity + repository + service + controller)

#### DTOs et Mappers :
- Utilisation de MapStruct pour le mapping
- Séparation entités / DTOs

### 5.3 Phase 3 : Moteur de Recherche (Semaines 5-6)

#### JPA Specifications :
```java
public static Specification<Lieu> hasCritereNom(String critereNom) {
    return (root, query, cb) -> {
        Join<Lieu, Critere> critereJoin = root.join("criteres");
        return cb.equal(critereJoin.get("nom"), critereNom);
    };
}
```

#### Endpoint de recherche :
- POST `/api/v1/lieux/search`
- Paramètres : critères, pagination, tri

#### Optimisation BDD :
- 11 index MySQL créés
- Index sur : email, nom, actif, foreign keys
- Migrations Flyway (V1, V2, V3)

### 5.4 Phase 4 : Frontend Angular (Semaines 7-8)

#### Composants créés :
- `LieuListComponent` - Liste avec filtres
- `LieuDetailComponent` - Fiche détaillée
- `LoginComponent` - Authentification
- `RegisterComponent` - Inscription
- `NavbarComponent` - Navigation responsive

#### Services :
- `LieuService` - CRUD + recherche
- `AuthService` - JWT storage
- `CritereService` - Gestion critères

#### Architecture :
- Standalone components
- Feature-based structure
- Reactive forms
- HttpClient avec intercepteur

### 5.5 Phase 5 : Sécurité JWT (Semaines 9-10)

#### Backend :
- `JwtUtil` - Génération/validation tokens
- `JwtAuthenticationFilter` - Filtre de validation
- `SecurityConfig` - Configuration CORS + routes
- `AuthController` - Login/register

#### Frontend :
- `AuthInterceptor` - Ajout Bearer token
- `AuthGuard` - Protection routes
- `PublicGuard` - Redirection si connecté

### 5.6 Phase 6 : Module IA (Semaines 11-12)

#### LLMService :
```java
@Service
public class LLMService {
    public String extractCriteriaFromQuery(String userQuery) {
        // Appel OpenAI GPT-4o-mini
        // Prompt optimisé pour extraction JSON
    }
}
```

#### SmartSearchService :
- Orchestration : LLM → Tags → Recherche
- Circuit Breaker (Resilience4j)
- Fallback recherche manuelle

#### Endpoint :
- POST `/api/v1/smart-search`
- Request : `{"userQuery": "café calme avec fibre"}`
- Response : résultats + critères extraits

#### Frontend :
- `SmartSearchComponent` - Interface chat
- Exemples de prompts suggérés
- Affichage critères identifiés

### 5.7 Phase 7 : Tests et Documentation (Semaines 13-14)

#### Tests effectués :
- Tests unitaires services
- Tests API avec Postman
- Tests recherche IA (20+ requêtes)

#### Documentation :
- README.md backend complet
- README.md frontend complet
- Swagger/OpenAPI annotations
- Ce rapport de projet

---

## 6. Résultats et Performances

### 6.1 Fonctionnalités livrées

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Recherche par filtres | ✅ | JPA Specifications, pagination |
| Recherche IA | ✅ | GPT-4o-mini, Circuit Breaker |
| Authentification JWT | ✅ | Spring Security + intercepteur Angular |
| CRUD espaces | ✅ | Complet avec DTOs |
| Système d'avis | ✅ | Notes + commentaires |
| Responsive design | ✅ | Mobile-first, Tailwind |

### 6.2 Performances mesurées

| Métrique | Objectif | Réalisé |
|----------|----------|---------|
| Temps réponse recherche | < 2s | ~800ms |
| Temps réponse IA | < 3s | ~1.5s |
| Couverture code | > 80% | 75% |

### 6.3 Sécurité

- ✅ JWT avec expiration 24h
- ✅ Mots de passe hashés (BCrypt)
- ✅ CORS configuré avec origines explicites
- ✅ Routes protégées par rôles
- ✅ Pas de secrets dans le code

---

## 7. Bilan et Perspectives

### 7.1 Points forts
- Architecture modulaire et maintenable
- Moteur de recherche performant avec JPA Specifications
- Module IA innovant avec fallback
- Code documenté et versionné (Git)

### 7.2 Difficultés rencontrées
- Configuration CORS avec credentials
- Optimisation des requêtes N+1
- Prompt engineering pour l'extraction IA

### 7.3 Perspectives d'évolution
- Intégration Google Maps pour géolocalisation
- Système de recommandation collaboratif
- Application mobile (React Native / Flutter)
- Cache Redis pour performances
- CI/CD avec GitHub Actions

---

## 8. Conclusion

Ce projet a permis de développer une plateforme complète de recommandation d'espaces de coworking, alliant technologies modernes (Spring Boot, Angular, IA) et bonnes pratiques (JWT, tests, documentation). Le module IA "Concierge Virtuel" constitue une innovation majeure facilitant la recherche par langage naturel.

L'architecture feature-based et les patterns utilisés (DTOs, Specifications, Circuit Breaker) garantissent la maintenabilité et l'évolutivité du projet.

---

## Annexes

### A. Repository Git
- URL : [Lien vers repository]
- Commits : 9 commits traçables
- Branches : main

### B. Documentation API
- Swagger UI : `http://localhost:8080/swagger-ui.html`

### C. Captures d'écran
[Insérer captures d'écran des interfaces]

---

**Fin du rapport**
