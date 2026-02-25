# ✅ Smart Finder - CHECKLIST FINALE DE DÉVELOPPEMENT

> **Projet PFE** : Application de recommandation d'espaces de travail avec IA  
> **Durée** : 12 semaines | **Stack** : Angular + Spring Boot + MySQL + LLM API

---

## 📌 Navigation Rapide

| Section | Description | Durée |
|---------|-------------|-------|
| [Phase 1](#phase-1-fondation--architecture) | Cahier des charges, ERD, Setup | Sem 1-2 |
| [Phase 2](#phase-2-socle-backend) | Entités, Repositories, API REST | Sem 3-4 |
| [Phase 3](#phase-3-moteur-de-recherche) | JPA Specifications, Ranking, Avis | Sem 5-6 |
| [Phase 4](#phase-4-frontend-angular) | UI Mobile-First, Services, Composants | Sem 7-8 |
| [Phase 5](#phase-5-sécurité-jwt) | Authentification, Autorisation | Sem 9 |
| [Phase 6](#phase-6-module-ia) | Concierge Virtuel, LLM Integration | Sem 10-11 |
| [Phase 7](#phase-7-tests--déploiement) | Tests, Optimisation, Livrables | Sem 12 |

---

## 📋 Guide d'Utilisation

```
- [ ]  Tâche non commencée
- [-]  Tâche en cours
- [x]  Tâche terminée
🔴     Critique - Bloquant pour la suite
🟡     Important - Impact sur qualité/fonctionnalités
🟢     Optionnel - Amélioration/Nice-to-have
⏱️     Temps estimé
```

**Règles** :
1. Toujours cocher `[x]` une tâche avant de passer à la suivante
2. Respecter l'ordre des phases (dépendances)
3. Documenter les blocages immédiatement

---

# PHASE 1 : FONDATION & ARCHITECTURE
### 🗓️ Semaines 1-2 | ⏱️ ~38h

## 1.1 Cahier des Charges & Conception

- [x] **🔴** Analyser l'énoncé PFE complet
  - ⏱️ 2h
- [x] **🔴** Rédiger le cahier des charges technique (CAHIER_DES_CHARGES.md)
  - ⏱️ 4h
- [x] **🔴** Créer le diagramme ERD (Entités: Utilisateur, Lieu, Critere, Avis)
  - ⏱️ 3h
- [x] **🔴** Définir les user stories par acteur
  - ⏱️ 2h | Utilisateur, Propriétaire, Admin
- [x] **🟡** Créer les wireframes (Figma ou papier)
  - ⏱️ 3h | Écrans: Home, Recherche, Détail, Profil
- [x] **🟢** Rédiger le rapport Phase 1
  - ⏱️ 2h

**✅ Livrable Phase 1.1** : Cahier des charges + ERD + Wireframes

---

## 1.2 Setup Environnement

- [x] **🔴** Installer Node.js 18+ et Angular CLI
  - ⏱️ 30min | ✅ Node.js v22.17.0 déjà installé
- [x] **🔴** Installer Java 17+ (JDK)
  - ⏱️ 30min | ✅ Java 23.0.1 déjà installé
- [x] **🔴** Installer IntelliJ IDEA ou VS Code
  - ⏱️ 30min | ✅ VS Code supposé installé
- [x] **🔴** Installer Angular CLI globalement
  - ⏱️ 15min | ✅ Angular CLI 19.1.5 installé
- [x] **🔴** Vérifier MySQL 8.0 et MySQL Workbench
  - ⏱️ 1h | ✅ MySQL 9.4.0 déjà installé
- [-] **🔴** Créer la base de données "smartfinder"
  - ⏱️ 30min | ⚠️ EN ATTENTE - MySQL server non démarré (localhost:3306)
- [x] **🟡** Configurer Postman
  - ⏱️ 30min | ✅ Collection créée: smart-finder-api-postman.json
- [x] **🔴** Créer la structure du projet Git
  - ⏱️ 30min | ✅ Structure créée (backend, frontend, docs)
- [x] **🔴** Initialiser les repositories Git
  - ⏱️ 30min | ✅ Git init + premier commit (docs + structure)

**✅ Livrable Phase 1.2** : Environnement prêt + Structure projet
- ⚠️ **Note**: MySQL server à démarrer manuellement (création BDD en attente)

---

# PHASE 2 : SOCLE BACKEND (CORE)
### 🗓️ Semaines 3-4 | ⏱️ ~34h

## 2.1 Configuration Spring Boot

- [x] **🔴** Créer le projet Spring Boot (Spring Initializr)
  - ⏱️ 30min | ✅ pom.xml créé avec toutes les dépendances
- [x] **🔴** Configurer `application.properties`
  - ⏱️ 1h | ✅ Fichier créé avec BDD, JWT, LLM config
- [x] **🔴** Créer la structure des packages
  - ⏱️ 1h | ✅ Feature-based: auth, lieu, critere, avis, smartsearch, shared

---

## 2.2 Entités JPA

- [x] **🔴** Créer `Utilisateur` (id, email, nom, prenom, role, password)
  - ⏱️ 1h | ✅ Entité créée avec Enum Role
- [x] **🔴** Créer `Lieu` (id, nom, adresse, description, lat, lng, noteMoyenne)
  - ⏱️ 1h | ✅ Entité créée avec relations @ManyToOne
- [x] **🔴** Créer `Critere` (id, nom, description, categorie, icon, actif)
  - ⏱️ 1h | ✅ Entité créée avec @Column(unique=true)
- [x] **🔴** Créer `Avis` et `LieuCritere`
  - ⏱️ 1h45min | ✅ Entités créées avec relations @ManyToOne
- [x] **🔴** Créer les Repositories (Utilisateur, Lieu, Critere, Avis)
  - ⏱️ 2h | ✅ 4 repositories créés avec JpaSpecificationExecutor pour Lieu

---

## 2.3 DTOs et Mappers

- [x] **🔴** Créer les DTOs (Utilisateur, Lieu, Critere, Avis)
  - ⏱️ 2h | ✅ 4 DTOs créés sans mot de passe pour sécurité
- [x] **🔴** Créer les Services (Utilisateur, Lieu, Critere, Avis)
  - ⏱️ 7h | ✅ 4 services créés avec calcul note moyenne
- [x] **🔴** Créer les Controllers REST
  - ⏱️ 5h | ✅ 4 controllers créés (Lieu, Critere, Avis, Auth)

---

## 2.4 Tests & Documentation API

- [x] **🟡** Créer la classe principale Spring Boot
  - ⏱️ 30min | ✅ SmartFinderApplication.java créée
- [x] **🟡** Commit Git du backend
  - ⏱️ 15min | ✅ Commit: "Phase 2: Backend CRUD complet"

---

## 2.6 Documentation API

- [x] **🟡** Collection Postman créée
  - ⏱️ 30min | ✅ smart-finder-api-postman.json

**✅ Livrable Phase 2** : Backend fonctionnel avec CRUD complet + API REST

---

# PHASE 3 : MOTEUR DE RECHERCHE & RANKING
### 🗓️ Semaines 5-6 | ⏱️ ~35h

## 3.1 JPA Specifications (Cœur Technique)

- [x] **🔴** Créer `LieuSpecifications`
  - ⏱️ 3h | ✅ Specifications: hasCritere, hasCriteres, noteGreaterThan, nomContains

## 3.2 API de Recherche

- [x] **🔴** Créer `SearchRequestDTO` et `SearchResponseDTO`
  - ⏱️ 2h | ✅ DTOs créés avec pagination
- [x] **🔴** Créer `LieuSearchService`
  - ⏱️ 2h | ✅ Service avec JPA Specifications + pagination

---

## 3.3 Endpoint de Recherche

- [x] **🔴** Ajouter endpoint POST /lieux/search
  - ⏱️ 1h | ✅ Endpoint créé avec JPA Specifications

---

## 3.4 Commit Phase 3

- [x] **🟡** Commit Git du moteur de recherche
  - ⏱️ 15min | ✅ Commit: "Phase 3: Moteur de recherche JPA Specifications"

---

## 3.3 Optimisation BDD

- [x] **🔴** Créer les index MySQL
  - ⏱️ 2h | ✅ 11 index créés (V2__add_indexes.sql)
- [x] **🔴** Créer migrations Flyway
  - ⏱️ 1h | ✅ V1__init_schema.sql, V2__add_indexes.sql, V3__seed_data.sql

---

## 3.4 Commit Phase 3 - Optimisation

- [-] **🟡** Commit Git optimisation BDD
  - ⏱️ 15min | En cours...

---

## 3.4 Algorithme de Ranking

- [ ] **🔴** Implémenter le calcul de pertinence
  - ⏱️ 3h | Nombre de critères correspondants
- [ ] **🔴** Implémenter le tri multi-critères
  - ⏱️ 2h | 1. Pertinence 2. Note 3. Nb avis 4. Date
- [ ] **🔴** Afficher le score de pertinence dans la réponse
  - ⏱️ 1h | Champ "matchCount" dans DTO

---

## 3.5 Système d'Avis

- [ ] **🔴** Calcul de la note moyenne (@Formula)
  - ⏱️ 1h | `AVG(a.note)` dans entité Lieu
- [ ] **🔴** Endpoint POST /api/lieux/{id}/avis
  - ⏱️ 1h | Validation: note 1-5
- [ ] **🔴** Vérification "un avis par utilisateur par lieu"
  - ⏱️ 1h | @UniqueConstraint ou vérification service
- [ ] **🟡** Modération des avis (Admin)
  - ⏱️ 2h | DELETE /api/avis/{id} (admin only)

**✅ Livrable Phase 3** : Moteur de recherche fonctionnel avec ranking + Avis

---

# PHASE 4 : FRONTEND ANGULAR
### 🗓️ Semaines 7-8 | ⏱️ ~40h

## 4.1 Setup Angular

- [ ] **🔴** Générer le projet Angular
  - ⏱️ 30min | `ng new smart-finder-frontend --routing --style=scss`
- [ ] **🔴** Configurer Tailwind CSS
  - ⏱️ 30min | Installation + config
- [ ] **🔴** Créer la structure des dossiers
  ```
  src/app/
  ├── components/
  ├── services/
  ├── models/
  ├── guards/
  ├── interceptors/
  └── pages/
  ```
- [ ] **🔴** Configurer les environnements
  - ⏱️ 30min | `environment.ts` avec URL API
- [ ] **🔴** Configurer le routing
  - ⏱️ 1h | Routes principales

---

## 4.2 Models TypeScript

- [ ] **🔴** Interface `Utilisateur`
  - ⏱️ 30min
- [ ] **🔴** Interface `Lieu`
  - ⏱️ 30min | Avec criteres[] et noteMoyenne
- [ ] **🔴** Interface `Critere`
  - ⏱️ 30min
- [ ] **🔴** Interface `Avis`
  - ⏱️ 30min
- [ ] **🔴** Interface `SearchRequest` / `SearchResponse`
  - ⏱️ 1h | Pour le moteur de recherche

---

## 4.3 Services HTTP

- [ ] **🔴** `AuthService` - Login, register, JWT storage
  - ⏱️ 2h
- [ ] **🔴** `LieuService` - CRUD + search
  - ⏱️ 2h
- [ ] **🔴** `CritereService` - Récupération des critères
  - ⏱️ 1h
- [ ] **🔴** `AvisService` - Soumission et récupération
  - ⏱️ 1h
- [ ] **🟡** Intercepteur HTTP (Bearer token)
  - ⏱️ 1h | Ajout automatique JWT

---

## 4.4 Composants UI (Mobile-First)

### Layout
- [ ] **🔴** `HeaderComponent` - Navigation responsive
  - ⏱️ 2h | Burger menu sur mobile
- [ ] **🔴** `FooterComponent`
  - ⏱️ 30min
- [ ] **🔴** `HomeComponent` - Page d'accueil
  - ⏱️ 2h | Hero + CTA Recherche

### Authentification
- [ ] **🔴** `LoginComponent` - Formulaire responsive
  - ⏱️ 2h | Validation email/password
- [ ] **🔴** `RegisterComponent`
  - ⏱️ 2h | Choix rôle (User/Owner)

### Recherche
- [ ] **🔴** `FiltresComponent` - Checkboxes par catégorie
  - ⏱️ 4h | Groupes: Connectivité, Ambiance, Services...
- [ ] **🔴** `ListeLieuxComponent` - Grille/Liste responsive
  - ⏱️ 3h | Cards avec image, nom, note, tags
- [ ] **🔴** `LieuCardComponent` - Carte individuelle
  - ⏱️ 2h | Mobile: full width, Desktop: grid
- [ ] **🟡** Pagination ou Infinite Scroll
  - ⏱️ 2h

### Détail
- [ ] **🔴** `LieuDetailComponent` - Vue complète
  - ⏱️ 4h | Carte, critères, avis, formulaire avis
- [ ] **🔴** `AvisListComponent` - Liste des avis
  - ⏱️ 2h | Avec étoiles
- [ ] **🔴** `AvisFormComponent` - Soumettre un avis
  - ⏱️ 2h | Rating stars + textarea

### Admin
- [ ] **🟡** `AdminCritereComponent` - Gestion CRUD critères
  - ⏱️ 3h | Table + formulaire ajout

---

## 4.5 Responsive Design

- [ ] **🔴** Tester sur mobile (Chrome DevTools)
  - ⏱️ 2h | iPhone SE, iPhone 12, Samsung
- [ ] **🔴** Tester sur tablette
  - ⏱️ 1h | iPad dimensions
- [ ] **🔴** Tester sur desktop
  - ⏱️ 1h | 1920x1080
- [ ] **🟡** Touch targets > 44px
  - ⏱️ 1h | Boutons et liens

**✅ Livrable Phase 4** : Frontend complet et responsive

---

# PHASE 5 : SÉCURITÉ JWT
### 🗓️ Semaine 9 | ⏱️ ~20h

## 5.1 Backend - Spring Security

- [ ] **🔴** Ajouter dépendances (Spring Security, JWT)
  - ⏱️ 30min | pom.xml
- [ ] **🔴** Créer `JwtUtil` (génération/validation)
  - ⏱️ 2h | Secret key, expiration
- [ ] **🔴** Créer `JwtAuthenticationFilter`
  - ⏱️ 2h | Validation token sur chaque requête
- [ ] **🔴** Configurer `SecurityConfig`
  - ⏱️ 2h | CORS, public routes, secured routes
- [ ] **🔴** Créer `AuthController`
  - ⏱️ 2h | POST /api/auth/login, /api/auth/register
- [ ] **🔴** Protéger POST/PUT/DELETE /api/criteres
  - ⏱️ 1h | `@PreAuthorize("hasRole('ADMIN')")`
- [ ] **🔴** Protéger les routes Propriétaire (CRUD lieux)
  - ⏱️ 2h | Vérifier ownership

## 5.3 CORS Configuration (CRITIQUE)

- [ ] **🔴** Configurer CORS avec origines EXPLICITES
  - ⏱️ 1h | 
    ```java
    config.setAllowedOrigins(List.of(
        "http://localhost:4200",
        "https://smart-finder.vercel.app"  // Production
    ));
    // ❌ JAMAIS: allowedOrigins("*") avec allowCredentials(true)
    ```
- [ ] **🔴** Valider CORS en production
  - ⏱️ 30min | Tester depuis domaine frontend déployé

---

## 5.2 Frontend - Auth Flow

- [ ] **🔴** Implémenter le login
  - ⏱️ 2h | Appel API + stockage JWT
- [ ] **🔴** Stocker JWT dans localStorage
  - ⏱️ 1h | `localStorage.setItem('token', jwt)`
- [ ] **🔴** Créer `AuthGuard`
  - ⏱️ 1h | Redirection si non authentifié
- [ ] **🔴** Créer `RoleGuard`
  - ⏱️ 1h | Vérification rôle pour routes admin
- [ ] **🔴** Intercepteur HTTP (ajout Bearer token)
  - ⏱️ 1h | Header Authorization
- [ ] **🟡** Gestion expiration token
  - ⏱️ 1h | Logout automatique

**✅ Livrable Phase 5** : Authentification complète + Routes protégées

---

# PHASE 6 : MODULE IA - CONCIERGE VIRTUEL
### 🗓️ Semaines 10-11 | ⏱️ ~45h

## 6.1 Setup API LLM

- [ ] **🔴** Choisir provider (OpenAI GPT-4 / Claude)
  - ⏱️ 1h | Comparer coûts
- [ ] **🔴** Créer compte et obtenir clé API
  - ⏱️ 30min | Stocker dans variables d'environnement
- [ ] **🔴** Configurer clé dans Spring Boot
  - ⏱️ 30min | `application.properties`

---

## 6.2 Backend - Service IA

- [ ] **🔴** Créer `LLMService`
  - ⏱️ 3h | Client HTTP vers API
- [ ] **🔴** Concevoir le prompt d'extraction
  - ⏱️ 4h | 
    ```
    "Analyse cette requête et extrais les critères disponibles: 
    [liste des critères de la BDD]. Réponds en JSON: 
    {tags: [...], confidence: 0.95, explanation: '...'}"
    ```
- [ ] **🔴** Implémenter mapping JSON → Tag IDs
  - ⏱️ 2h | Recherche par nom dans la BDD
- [ ] **🔴** Créer `SmartSearchService`
  - ⏱️ 2h | Orchestration: LLM → Tags → Recherche standard
- [ ] **🔴** Endpoint POST /api/smart-search
  - ⏱️ 2h | 
    - Request: `{"query": "café calme avec wifi"}`
    - Response: résultats + explication
- [ ] **🔴** Gérer les critères inconnus
  - ⏱️ 2h | Message: "Critère 'X' non disponible"
- [ ] **🟡** Implémenter le caching (Redis)
  - ⏱️ 3h | Cache des requêtes similaires
- [ ] **🟡** Fallback si API LLM down
  - ⏱️ 2h | Redirection vers recherche manuelle

## 6.4 Circuit Breaker & Resilience (Recommandé)

- [ ] **🟢** Ajouter Resilience4j (Circuit Breaker)
  - ⏱️ 2h | Protection contre indisponibilité LLM
    ```java
    @CircuitBreaker(name = "llm", fallbackMethod = "fallbackSearch")
    public SmartSearchResponse search(String query) { ... }
    ```
- [ ] **🟢** Implémenter méthode fallback
  - ⏱️ 1h | Extraction mots-clés alternative
- [ ] **🟢** Configurer retry avec backoff
  - ⏱️ 1h | 3 tentatives max, délai exponentiel

---

## 6.3 Frontend - Interface Smart Finder

- [ ] **🔴** Créer `SmartSearchComponent`
  - ⏱️ 3h | Input type chat, bouton microphone (optionnel)
- [ ] **🔴** Afficher l'extraction IA à l'utilisateur
  - ⏱️ 2h | "J'ai compris : café + calme + wifi"
- [ ] **🔴** Afficher les résultats
  - ⏱️ 1h | Réutiliser ListeLieuxComponent
- [ ] **🔴** Bouton "Affiner avec les filtres"
  - ⏱️ 1h | Lien vers recherche manuelle avec filtres pré-remplis
- [ ] **🟡** Suggestions de prompts
  - ⏱️ 1h | Chips: "Café calme pour travailler", "Bibliothèque ouverte le soir"
- [ ] **🟡** Historique des recherches IA
  - ⏱️ 2h | localStorage

---

## 6.4 Tests & Optimisation IA

- [ ] **🔴** Tester 20+ requêtes en langage naturel
  - ⏱️ 3h | Documenter précision/extraction
- [ ] **🔴** Mesurer latence moyenne
  - ⏱️ 1h | Objectif: < 2 secondes
- [ ] **🟡** Optimiser le prompt (few-shot)
  - ⏱️ 2h | Exemples dans le prompt
- [ ] **🟢** Documenter le module IA
  - ⏱️ 3h | Architecture, prompts, résultats tests

**✅ Livrable Phase 6** : Concierge Virtuel fonctionnel

---

# PHASE 7 : TESTS, DÉPLOIEMENT & DOCUMENTATION
### 🗓️ Semaine 12 | ⏱️ ~35h

## 7.1 Tests de Charge & Performance (Détaillés)

- [ ] **🔴** Créer scénario JMeter (100 users simultanés)
  - ⏱️ 3h | Requêtes complexes simultanées
  - Objectif: < 500ms par requête
- [ ] **🔴** Tester moteur recherche avec 5+ critères combinés
  - ⏱️ 2h | Vérifier temps réponse avec multiple JOINs
- [ ] **🔴** Vérifier avec EXPLAIN sur requêtes lentes
  - ⏱️ 1h | S'assurer qu'aucune requête ne fait full table scan
- [ ] **🔴** Tester cache si implémenté (Redis)
  - ⏱️ 1h | Hit rate > 30%
- [ ] **🟡** Test Lighthouse (Performance)
  - ⏱️ 1h | Score > 80 sur mobile

---

## 7.2 Tests Fonctionnels Complets

### Scénarios Utilisateur
- [ ] **🔴** Inscription → Recherche filtres → Détail → Avis
  - ⏱️ 1h
- [ ] **🔴** Recherche IA → Résultats → Affiner filtres
  - ⏱️ 1h

### Scénarios Propriétaire
- [ ] **🔴** Inscription Owner → Ajout lieu → Ajout critères → Consultation avis
  - ⏱️ 1h

### Scénarios Admin
- [ ] **🔴** Création critère → Modération avis
  - ⏱️ 30min

### Sécurité
- [ ] **🔴** Test accès non autorisé aux routes admin
  - ⏱️ 1h | Doit retourner 403
- [ ] **🔴** Test JWT invalide/expiré
  - ⏱️ 30min | Doit retourner 401

---

## 7.3 Déploiement

### Backend
- [ ] **🟡** Créer compte Railway/Render/Heroku
  - ⏱️ 30min
- [ ] **🟡** Configurer variables d'environnement
  - ⏱️ 1h | BDD_URL, JWT_SECRET, OPENAI_KEY
- [ ] **🟡** Déployer le backend
  - ⏱️ 1h

### Frontend
- [ ] **🟡** Créer compte Vercel/Netlify
  - ⏱️ 30min
- [ ] **🟡** Configurer build Angular
  - ⏱️ 30min | `ng build --configuration production`
- [ ] **🟡** Déployer le frontend
  - ⏱️ 30min

### Base de Données
- [ ] **🟡** Créer BDD cloud (PlanetScale/AWS RDS)
  - ⏱️ 1h
- [ ] **🟡** Exécuter le script SQL de création
  - ⏱️ 30min
- [ ] **🟡** Peupler avec données de test
  - ⏱️ 1h | 20+ lieux réalistes

---

## 7.4 Documentation Finale

### Code
- [ ] **🔴** README.md complet (backend)
  - ⏱️ 1h | Installation, configuration, API endpoints
- [ ] **🔴** README.md complet (frontend)
  - ⏱️ 1h | Installation, dépendances, build

### Rapport PFE
- [ ] **🔴** Introduction et Contexte
  - ⏱️ 2h
- [ ] **🔴** Analyse et Conception (ERD, wireframes)
  - ⏱️ 3h | Screenshots
- [ ] **🔴** Réalisation technique
  - ⏱️ 4h | Extraits de code, captures d'écran app
- [ ] **🔴** Tests et Résultats
  - ⏱️ 2h | Performances, fonctionnalités
- [ ] **🔴** Bilan et Perspectives
  - ⏱️ 1h
- [ ] **🔴** Table des matières + Pagination
  - ⏱️ 1h

### Soutenance
- [ ] **🔴** Slides de présentation (PowerPoint)
  - ⏱️ 4h | 15-20 slides
- [ ] **🔴** Préparer la démo (scénario)
  - ⏱️ 2h | 5-7 minutes de démo
- [ ] **🟢** Répéter la présentation
  - ⏱️ 1h

**✅ Livrable Phase 7** : Application déployée + Documentation complète

---

# 📊 TABLEAU RÉCAPITULATIF

| Phase | Semaines | Heures | Focus Principal | Livrable Clé |
|-------|----------|--------|-----------------|--------------|
| 1 | 1-2 | 38h | Architecture | Cahier des charges + ERD |
| 2 | 3-4 | 34h | Backend CRUD | API REST complète |
| 3 | 5-6 | 35h | **Moteur de recherche** | JPA Specifications + Ranking |
| 4 | 7-8 | 40h | **Frontend** | UI Mobile-First |
| 5 | 9 | 20h | **Sécurité** | JWT + Routes protégées |
| 6 | 10-11 | 50h | **Module IA** | Concierge Virtuel + Circuit Breaker |
| 7 | 12 | 37h | **Tests & Livraison** | App déployée + Rapport |
| **TOTAL** | **12** | **~254h** | | |

---

# 🎯 CHECKLIST FINALE - AVANT SOUTENANCE

## Fonctionnalités (Doivent marcher)
- [ ] L'application se lance sans erreur
- [ ] Moteur de recherche par filtres fonctionne
- [ ] Le Concierge Virtuel (IA) comprend et répond
- [ ] Authentification JWT protège les routes admin
- [ ] Système d'avis et notes fonctionne
- [ ] Interface responsive sur mobile
- [ ] API REST documentée (Swagger)

## Code (Doit être propre)
- [ ] Repository Git avec historique de commits
- [ ] Code commenté (JavaDoc/JSDoc)
- [ ] Pas de mots de passe en dur
- [ ] Pas de clés API en dur (variables d'environnement)
- [ ] Structure de packages cohérente

## Documentation (Doit être complète)
- [ ] Cahier des charges technique
- [ ] Diagramme ERD
- [ ] README.md (backend + frontend)
- [ ] Documentation API (Swagger/Postman)
- [ ] Rapport de projet PFE (Word/PDF)
- [ ] Slides de soutenance

## Déploiement (Doit être accessible)
- [ ] Backend déployé et fonctionnel
- [ ] Frontend déployé et accessible
- [ ] Base de données peuplée avec données réalistes
- [ ] URLs de production notées

---

## 📅 CALENDRIER TYPE - PLANNING HEBDOMADAIRE

```
LUNDI    : Backend (Spring Boot)    → 4-5h
MARDI    : Backend + Tests API      → 4-5h
MERCREDI : Frontend (Angular)       → 4-5h
JEUDI    : Frontend + UI            → 4-5h
VENDREDI : Intégration + Tests      → 4-5h
SAMEDI   : Documentation + Revue    → 2-3h
DIMANCHE : Repos 😴                 → 0h
```

**Objectif hebdomadaire** : ~20-25h de développement effectif

---

## ⚠️ POINTS DE VIGILANCE (Anti-Échecs)

1. **🔴 JPA Specifications** - C'est le cœur du projet. Ne pas essayer avec des requêtes @Query statiques.

2. **🔴 Mobile-First** - Tester sur mobile DES LE DÉBUT, pas à la fin.

3. **🔴 API LLM** - Avoir un fallback si l'API est down ou trop lente.

4. **🔴 CORS Configuration** - JAMAIS `allowedOrigins("*")` avec `allowCredentials(true)`. Toujours spécifier les origines exactes.

5. **🟡 JWT Security** - Ne pas reporter à la fin, intégrer dès la Phase 5.

6. **🟡 Index MySQL** - Sans index, le moteur de recherche sera lent avec beaucoup de données.

7. **🟡 Circuit Breaker** - Protéger l'intégration LLM pour éviter de bloquer l'app si l'API est down.

8. **🟢 Documentation** - Rédiger en PARALLÈLE, pas tout à la fin.

---

**BON COURAGE ! 🚀**

*Dernière mise à jour : Février 2026*
