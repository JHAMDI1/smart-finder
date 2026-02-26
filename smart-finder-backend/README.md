# Smart Finder - Backend

Application backend pour le PFE Smart Finder - Plateforme de recommandation d'espaces de coworking avec recherche intelligente par IA.

## 🚀 Technologies

- **Java 23** - Langage principal
- **Spring Boot 3.4.2** - Framework backend
- **Spring Security + JWT** - Authentification et sécurité
- **JPA/Hibernate** - Persistance des données
- **MySQL 9.1** - Base de données
- **Flyway** - Migrations de base de données
- **MapStruct** - Mapping DTO/Entity
- **Lombok** - Réduction boilerplate
- **OpenAI GPT-4o-mini** - Intelligence artificielle (Phase 6)
- **Resilience4j** - Circuit Breaker pour l'IA
- **Maven** - Gestion des dépendances

## 📁 Structure du Projet

```
smart-finder-backend/
├── src/main/java/com/smartfinder/
│   ├── auth/           # Authentification (JWT, login, register)
│   ├── avis/           # Système d'avis et notes
│   ├── critere/        # Gestion des critères de recherche
│   ├── lieu/           # Gestion des espaces de coworking
│   ├── smartsearch/    # Module IA - Concierge Virtuel
│   └── shared/         # Utilitaires partagés
├── src/main/resources/
│   ├── db/migration/   # Scripts Flyway (V1, V2, V3)
│   ├── application.properties
│   └── application-prod.properties
└── pom.xml
```

## 🛠️ Installation

### Prérequis

- Java 23+
- Maven 3.9+
- MySQL 9.1+
- Compte OpenAI (pour le module IA)

### Configuration

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd smart-finder-backend
   ```

2. **Configurer la base de données**
   ```sql
   CREATE DATABASE smartfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'smartfinder'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON smartfinder.* TO 'smartfinder'@'localhost';
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet (au même niveau que `pom.xml`) en copiant le modèle `.env.example` :
   ```properties
   # --- DATABASE ---
   DB_PASSWORD=your_password
   
   # --- JWT SECRET ---
   JWT_SECRET=your-jwt-secret-key-at-least-32-characters-long
   
   # --- DEEPSEEK API ---
   OPENAI_API_KEY=your-deepseek-api-key

   # --- CLOUDINARY (Images) ---
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Compiler et exécuter**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

## 📡 API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion (retourne JWT)

### Espaces (Lieux)
- `GET /api/v1/lieux` - Liste paginée
- `GET /api/v1/lieux/{id}` - Détail d'un espace
- `POST /api/v1/lieux` - Créer (authentifié)
- `PUT /api/v1/lieux/{id}` - Modifier (authentifié)
- `DELETE /api/v1/lieux/{id}` - Supprimer (authentifié)
- `POST /api/v1/lieux/search` - Recherche par filtres

### Critères
- `GET /api/v1/criteres` - Liste des critères actifs
- `GET /api/v1/criteres/{id}` - Détail d'un critère
- `POST /api/v1/criteres` - Créer (ADMIN uniquement)

### Avis
- `GET /api/v1/avis/lieu/{lieuId}` - Avis d'un espace
- `POST /api/v1/avis` - Ajouter un avis (authentifié)

### IA - Concierge Virtuel (Phase 6)
- `POST /api/v1/smart-search` - Recherche intelligente
  - Request: `{"userQuery": "espace calme avec fibre", ...}`
  - Response: Résultats + critères extraits par l'IA

## 🔒 Sécurité

- **JWT** - Tokens avec expiration 24h
- **BCrypt** - Hash des mots de passe
- **CORS** - Configuré pour `localhost:4200`
- **Rôles** - USER, OWNER, ADMIN
- **Routes protégées**:
  - `ADMIN` uniquement: POST/PUT/DELETE `/criteres`
  - Authentifié: POST `/avis`, CRUD `/lieux` (avec vérification ownership)

## 🗄️ Base de Données

### Migrations Flyway
- **V1__init_schema.sql** - Création des tables
- **V2__add_indexes.sql** - Optimisation (11 index)
- **V3__seed_data.sql** - Données initiales

### Tables principales
- `utilisateur` - Utilisateurs avec rôles
- `lieu` - Espaces de coworking
- `critere` - Tags/catégories de recherche
- `lieu_critere` - Association many-to-many
- `avis` - Notes et commentaires

### Utilisateurs de Test (Mock Data)
Au premier démarrage, le backend insère automatiquement des données de test (lieux, critères, avis) ainsi que les comptes suivants :

| Rôle | Email | Mot de passe | Description |
|---|---|---|---|
| **ADMIN** | `admin@smartfinder.com` | `admin123` | Accès complet, gestion des critères et modération |
| **OWNER** | `khalil@smartfinder.com` | `owner123` | Propriétaire des lieux créés par défaut, accès dashboard |
| **USER** | `marie@test.com` | `user1234` | Utilisateur simple, peut laisser des avis |
| **USER** | `thomas@test.com` | `user1234` | Utilisateur simple, peut laisser des avis |

## 🤖 Module IA (Phase 6)

### Fonctionnement
1. L'utilisateur envoie une requête en langage naturel
2. `LLMService` appelle OpenAI GPT-4o-mini
3. Le prompt extrait les critères (ambiance, équipements, services...)
4. `SmartSearchService` mappe vers les IDs de la BDD
5. Recherche standard avec les critères identifiés
6. Retour des résultats avec explication de l'IA

### Circuit Breaker
- Activation si l'API OpenAI est indisponible
- Fallback: recherche par mots-clés dans la description

## 📊 Performance

- **Index MySQL** - 11 index optimisés pour la recherche
- **Pagination** - Tous les endpoints de liste
- **Cache** - Prévu pour Redis (optionnel)

## 🧪 Tests

```bash
./mvnw test
```

## 📦 Déploiement

### Production
```bash
./mvnw clean package -DskipTests
java -jar target/smart-finder-*.jar --spring.profiles.active=prod
```

### Docker (optionnel)
```bash
docker build -t smart-finder-backend .
docker run -p 8080:8080 --env-file .env smart-finder-backend
```

## 📚 Documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## 👥 Équipe

Projet de fin d'études (PFE) - 2026

## 📝 Licence

Propriétaire - Tous droits réservés
