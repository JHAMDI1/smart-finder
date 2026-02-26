# 🏢 Smart Finder

> **Projet de Fin d'Études** — Plateforme intelligente de recherche d'espaces de coworking, cafés et bibliothèques.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![DeepSeek](https://img.shields.io/badge/IA-DeepSeek-7C3AED?logo=openai&logoColor=white)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancement](#-lancement)
- [API Documentation](#-api-documentation)
- [Structure du Projet](#-structure-du-projet)
- [Comptes de Test](#-comptes-de-test)
- [Auteurs](#-auteurs)

---

## ✨ Fonctionnalités

### 🔍 Recherche Multicritère
- Filtres dynamiques groupés par catégorie (Connectivité, Ambiance, Confort, etc.)
- Barre de recherche textuelle avec filtrage en temps réel
- Pagination et compteur de résultats

### 🤖 Concierge Virtuel IA (DeepSeek)
- Interface chat conversationnel
- Extraction automatique de critères depuis le langage naturel
- Résultats pertinents basés sur l'analyse sémantique de la requête

### 👤 Authentification & Rôles
- Inscription / Connexion avec JWT
- 3 rôles : **USER**, **OWNER**, **ADMIN**
- Guards Angular pour la protection des routes

### 🏢 Espace Propriétaire (OWNER)
- Dashboard de gestion des établissements
- Formulaire d'ajout/modification avec sélection de critères
- Suppression de lieux

### 🛡️ Dashboard Administrateur (ADMIN)
- CRUD complet des critères
- Modération des avis
- Vue d'ensemble des lieux et statistiques

### ⭐ Système d'Avis
- Notation par étoiles (1-5)
- Commentaires optionnels
- Moyenne recalculée automatiquement

---

## 🏗 Architecture

```
┌─────────────────┐     HTTP/JWT      ┌──────────────────────┐
│                 │ ◄───────────────► │                      │
│   Angular 19    │                   │  Spring Boot 3.2     │
│   (Frontend)    │                   │  (Backend API)       │
│                 │                   │                      │
│  - SSR/Hydra.   │                   │  - Auth (JWT)        │
│  - TailwindCSS  │                   │  - CRUD Lieux        │
│  - Standalone   │                   │  - SearchService     │
│  - Guards       │                   │  - SmartSearch (IA)  │
│                 │                   │  - Avis              │
└─────────────────┘                   └──────────┬───────────┘
                                                 │
                                      ┌──────────▼───────────┐
                                      │   MySQL 8.x          │
                                      │   (Flyway migrations)│
                                      └──────────────────────┘
                                                 │
                                      ┌──────────▼───────────┐
                                      │   DeepSeek API       │
                                      │   (LLM Service)      │
                                      └──────────────────────┘
```

**Patterns utilisés :** DTO, Repository, Specification, JWT Stateless, GlobalExceptionHandler, Module-per-Feature.

---

## 🛠 Technologies

| Couche | Technologie | Version |
|--------|------------|---------|
| **Frontend** | Angular + TailwindCSS | 19.x |
| **Backend** | Spring Boot + Spring Security | 3.2.0 |
| **BDD** | MySQL + Flyway | 8.x |
| **Auth** | JWT (jjwt) | 0.12.3 |
| **IA** | DeepSeek API (OpenAI-compatible) | — |
| **Docs API** | SpringDoc OpenAPI (Swagger) | 2.3.0 |
| **Build** | Maven / npm | — |

---

## 📦 Prérequis

- **Java** 17+
- **Node.js** 18+ et **npm** 9+
- **MySQL** 8.x (via XAMPP ou autre)
- **Maven** 3.9+ (ou utiliser `./mvnw`)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/smart-finder.git
cd smart-finder
```

### 2. Configurer la base de données

Créer la base de données MySQL :

```sql
CREATE DATABASE IF NOT EXISTS smartfinder;
```

> La base est automatiquement configurée via Flyway + DataInitializer au premier lancement.

### 3. Configurer le backend

Modifier `smart-finder-backend/src/main/resources/application.properties` si nécessaire :

```properties
# Adaptez selon votre config MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/smartfinder
spring.datasource.username=root
spring.datasource.password=

# Clé API DeepSeek (pour le module IA)
openai.api.key=VOTRE_CLE_DEEPSEEK
```

### 4. Installer les dépendances frontend

```bash
cd smart-finder-frontend
npm install
```

---

## ▶️ Lancement

### Backend (port 8080)

```bash
cd smart-finder-backend
mvn spring-boot:run
```

### Frontend (port 4200)

```bash
cd smart-finder-frontend
npm start
```

Ouvrir le navigateur sur **http://localhost:4200**

---

## 📖 API Documentation

La documentation Swagger est auto-générée et disponible à :

- **Swagger UI** : [http://localhost:8080/api/v1/swagger-ui/index.html](http://localhost:8080/api/v1/swagger-ui/index.html)
- **OpenAPI JSON** : [http://localhost:8080/api/v1/v3/api-docs](http://localhost:8080/api/v1/v3/api-docs)

### Endpoints Principaux

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/auth/register` | Inscription | ❌ |
| `POST` | `/auth/login` | Connexion → token JWT | ❌ |
| `GET` | `/lieux` | Liste des lieux | ❌ |
| `GET` | `/lieux/{id}` | Détail d'un lieu | ❌ |
| `POST` | `/lieux/search` | Recherche par filtres | ❌ |
| `POST` | `/lieux` | Créer un lieu | 🔑 OWNER |
| `PUT` | `/lieux/{id}` | Modifier un lieu | 🔑 OWNER |
| `DELETE` | `/lieux/{id}` | Supprimer un lieu | 🔑 OWNER |
| `GET` | `/lieux/{id}/avis` | Avis d'un lieu | ❌ |
| `POST` | `/lieux/{id}/avis` | Donner un avis | 🔑 USER |
| `POST` | `/smart-search` | Recherche IA | ❌ |
| `GET` | `/criteres` | Liste des critères | ❌ |
| `POST` | `/criteres` | Créer un critère | 🔑 ADMIN |

---

## 📁 Structure du Projet

```
smart-finder/
├── smart-finder-backend/
│   └── src/main/java/com/smartfinder/
│       ├── auth/           # Authentification JWT + rôles
│       ├── lieu/           # CRUD Lieux + Search (Specifications)
│       ├── critere/        # CRUD Critères
│       ├── avis/           # Système d'avis
│       ├── smartsearch/    # Module IA (DeepSeek)
│       ├── shared/         # Exceptions globales
│       └── config/         # DataInitializer
│
├── smart-finder-frontend/
│   └── src/app/
│       ├── auth/           # Login/Register components
│       ├── lieu/           # Liste + Détail lieux
│       ├── critere/        # Services + modèles critères
│       ├── avis/           # Composant AvisList
│       ├── smart-search/   # Chat IA
│       ├── owner/          # Dashboard propriétaire
│       ├── admin/          # Dashboard admin
│       └── shared/         # Navbar, Guards, Interceptors
│
└── CHECKLIST.md            # Suivi de progression PFE
```

---

## 🔐 Comptes de Test

Le `DataInitializer` crée automatiquement ces comptes au lancement :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@smartfinder.com` | `admin123` | ADMIN |
| `owner@smartfinder.com` | `owner123` | OWNER |
| `user@smartfinder.com` | `user123` | USER |

---

## 👥 Auteurs

- **Khalil** — Étudiant PFE

---

## 📄 Licence

Ce projet est développé dans le cadre d'un Projet de Fin d'Études (PFE). Usage académique uniquement.
