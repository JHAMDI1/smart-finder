# 📋 Cahier des Charges Technique
## Smart Finder - Application de Recommandation d'Espaces de Travail

---

## 📌 Informations du Projet

- **Projet** : Smart Finder
- **Type** : Projet de Fin d'Études (PFE)
- **Durée** : 3 mois (12 semaines)
- **Équipe** : Binôme
- **Technologies** : Angular, Spring Boot, MySQL, API LLM
- **Date** : 2026

---

## 📑 Table des Matières

1. [Contexte et Objectifs](#1-contexte-et-objectifs)
2. [Acteurs du Système](#2-acteurs-du-système)
3. [Spécifications Fonctionnelles](#3-spécifications-fonctionnelles)
4. [Module IA - Concierge Virtuel](#4-module-ia---concierge-virtuel)
5. [Architecture et Modélisation](#5-architecture-et-modélisation)
6. [Exigences Non-Fonctionnelles](#6-exigences-non-fonctionnelles)
7. [Planning et Livrables](#7-planning-et-livrables)

---

# 1. Contexte et Objectifs

## 1.1 Problématique

Dans le contexte actuel du télétravail et des révisions à domicile, de nombreuses personnes (travailleurs, étudiants, freelances) ont besoin de trouver des espaces adaptés pour travailler ou étudier en dehors de leur domicile. Les solutions existantes comme Google Maps ou TripAdvisor ne répondent pas précisément à cette problématique car :

- **Google Maps** : Généraliste, ne filtre pas par critères spécifiques au télétravail (wifi, prises, calme)
- **TripAdvisor** : Axé tourisme/restauration, pas adapté aux besoins de travail

## 1.2 Solution Proposée

**Smart Finder** est une plateforme intelligente qui recense et recommande des lieux (cafés, bibliothèques, espaces de coworking) adaptés au télétravail selon des critères précis et personnalisables.

## 1.3 Objectifs du Projet

- [ ] Créer une base de données centralisée d'espaces de travail
- [ ] Développer un moteur de recherche par critères/tags (Wifi, Prises, Calme, etc.)
- [ ] Implémenter un système d'avis et de ranking
- [ ] Intégrer un **Concierge Virtuel IA** pour la recherche en langage naturel
- [ ] Assurer une expérience mobile-first

## 1.4 Technologies Fondamentales

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | Angular + TypeScript | Framework moderne, typé, maintenable |
| Backend | Spring Boot + JPA | Robustesse, Criteria API pour requêtes dynamiques |
| Base de données | MySQL | Relations complexes, Many-to-Many |
| IA / LLM | API OpenAI/Claude | Traitement du langage naturel |
| Styling | Tailwind CSS | Mobile-first, utility-first |

### Technologies Complémentaires (Optionnelles)
- **Google Maps API** : Cartographie et géolocalisation des lieux
- **Redis** : Cache des recherches fréquentes pour optimiser les performances
- **Docker** : Conteneurisation pour le déploiement

---

# 2. Acteurs du Système

## 2.1 Vue d'Ensemble des Acteurs

```
┌─────────────────────────────────────────────────────────────┐
│                    ACTEURS SMART FINDER                     │
├───────────────┬───────────────┬─────────────────────────────┤
│  UTILISATEUR  │  PROPRIÉTAIRE │         ADMINISTRATEUR      │
│  (Travailleur/│   (Gérant de  │                             │
│   Étudiant)   │    lieu)      │                             │
└───────────────┴───────────────┴─────────────────────────────┘
```

## 2.2 Utilisateur (Travailleur / Étudiant)

**Rôle** : Utilisateur final recherchant un espace de travail

### Permissions
- [ ] Créer un compte et s'authentifier
- [ ] Rechercher des lieux par critères (tags)
- [ ] Utiliser le **Concierge Virtuel** (recherche IA en langage naturel)
- [ ] Consulter les détails d'un lieu (critères, avis, photos)
- [ ] Soumettre un avis et une note sur un lieu visité
- [ ] Modifier/supprimer ses propres avis
- [ ] Sauvegarder ses recherches favorites (optionnel)

### Parcours Utilisateur Type
```
1. Connexion → 2. Recherche (filtres ou IA) → 3. Consultation résultats 
→ 4. Détail d'un lieu → 5. Visite → 6. Soumission d'avis
```

## 2.3 Propriétaire (Gérant d'Établissement)

**Rôle** : Propriétaire d'un café, bibliothèque, espace de coworking

### Permissions
- [ ] Créer un compte et s'authentifier
- [ ] Ajouter son établissement (nom, adresse, description, coordonnées GPS)
- [ ] **Mettre à jour les informations de son établissement**
- [ ] **Associer des critères/tags à son établissement** (Wifi, Prises, Calme, etc.)
- [ ] Consulter les avis et notes de son établissement
- [ ] Répondre aux avis (optionnel)

### Gestion des Critères par le Propriétaire
Le propriétaire peut :
- Sélectionner les critères existants qui s'appliquent à son établissement
- Demander l'ajout d'un nouveau critère (soumis à validation Admin)
- Mettre à jour les critères en cas de changement (ex: installation du Wifi)

## 2.4 Administrateur

**Rôle** : Super-utilisateur gérant la plateforme

### Permissions
- [ ] Toutes les permissions Utilisateur et Propriétaire
- [ ] **Gérer la base globale des critères/tags**
  - Ajouter de nouveaux critères (ex: "Vegan-friendly") sans redéployer le code
  - Modifier les descriptions et catégories des critères
  - Supprimer des critères obsolètes
- [ ] Modérer les avis (supprimer les avis inappropriés)
- [ ] Gérer les utilisateurs (activer/désactiver des comptes)
- [ ] Accéder aux statistiques d'utilisation

### Pourquoi la gestion dynamique des critères est critique
Sans cette fonctionnalité, chaque ajout de critère nécessiterait :
1. Modification du code source
2. Redéploiement de l'application
3. Interruption du service

→ L'Admin doit pouvoir ajouter des critères via l'interface web uniquement.

## 2.5 Modérateur Communautaire (Optionnel - Réflexion)

**Concept** : Utilisateurs très actifs qui valident les modifications suggérées

### Avantages potentiels
- Décharger l'Admin des tâches de validation répétitives
- Encourager l'engagement communautaire
- Améliorer la qualité des données par la communauté

### Implémentation possible
- Badge "Super Contributeur" après N avis utiles
- Permissions de validation des nouveaux critères suggérés
- Validation des modifications de lieux par les propriétaires

---

# 3. Spécifications Fonctionnelles

## 3.1 Gestion des Lieux

### 3.1.1 CRUD Lieux (Propriétaire)

| Action | Endpoint | Description |
|--------|----------|-------------|
| CREATE | POST /api/lieux | Ajouter un nouvel établissement |
| READ | GET /api/lieux/{id} | Consulter un établissement |
| UPDATE | PUT /api/lieux/{id} | Modifier son établissement |
| DELETE | DELETE /api/lieux/{id} | Supprimer son établissement |

### 3.1.2 Attributs d'un Lieu

```java
Lieu {
  id: Long
  nom: String              // Nom de l'établissement
  adresse: String           // Adresse complète
  description: String      // Description détaillée
  latitude: Double          // Coordonnées GPS
  longitude: Double        // Coordonnées GPS
  proprietaire: Utilisateur// Référence au propriétaire
  criteres: List<Critere>   // Tags associés (Many-to-Many)
  avis: List<Avis>          // Avis des utilisateurs
  noteMoyenne: Double      // Calculée automatiquement
  horaires: String         // Ex: "Lun-Ven: 8h-20h"
  photos: List<String>     // URLs des images (optionnel)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 3.2 Système de Critères/Tags (Cœur du Projet)

### 3.2.1 Catégories de Critères

| Catégorie | Critères Exemples |
|-----------|-------------------|
| **Connectivité** | Wifi gratuit, Prises électriques, USB ports |
| **Ambiance** | Calme, Animé, Cosy, Lumineux |
| **Confort** | Tables spacieuses, Chaises confortables, Climatisation |
| **Services** | Menu étudiant, Café de qualité, Nourriture, Vegan-friendly |
| **Horaires** | Ouvert le dimanche, Ouvert tard (après 20h), Ouvert tôt |
| **Accessibilité** | Accessible PMR, Parking à proximité, Transports en commun |

### 3.2.2 Entité Critere

```java
Critere {
  id: Long
  nom: String              // Ex: "wifi", "prises", "calme"
  description: String      // Ex: "Wifi gratuit et stable"
  categorie: String        // Ex: "CONNECTIVITE", "AMBIANCE"
  icon: String             // Icône (emoji ou classe CSS)
  actif: Boolean          // Actif/Inactif (gestion Admin)
  createdAt: DateTime
}
```

### 3.2.3 Table de Jointure Many-to-Many

```sql
lieu_critere {
  lieu_id: Long (FK)
  critere_id: Long (FK)
  PRIMARY KEY (lieu_id, critere_id)
}
```

## 3.3 Moteur de Recherche par Attributs

### 3.3.1 Interface de Recherche Angular

**Composant Filtres Dynamiques** :
```typescript
// Interface utilisateur
- Panneau latéral (mobile: bottom sheet)
- Checkboxes groupées par catégorie
- Compteur de résultats en temps réel
- Bouton "Réinitialiser les filtres"
- Sauvegarde des préférences (localStorage)
```

**Wireframe Mobile-First** :
```
┌─────────────────────────────┐
│ 🔍 Smart Finder          ⚙️ │
├─────────────────────────────┤
│ [Cherchez un lieu...     🔍]│
├─────────────────────────────┤
│ ▼ Connectivité (2)          │
│ ☑️ Wifi gratuit             │
│ ☑️ Prises électriques       │
│ ☐ USB ports                 │
├─────────────────────────────┤
│ ▼ Ambiance (1)              │
│ ☑️ Calme                    │
│ ☐ Animé                     │
│ ☐ Cosy                      │
├─────────────────────────────┤
│ 🏢 12 lieux trouvés         │
│ [Appliquer] [Réinitialiser] │
└─────────────────────────────┘
```

### 3.3.2 Backend - Requêtes Dynamiques avec JPA Specifications

**Pourquoi pas de @Query statique ?**

Le problème : L'utilisateur peut combiner aléatoirement **2, 5 ou 10 filtres différents**.

Avec une requête statique `@Query`, il faudrait créer une méthode pour chaque combinaison possible :
- `findByWifi()`
- `findByWifiAndPrises()`
- `findByWifiAndPrisesAndCalme()`
- ... (combinaison explosion)

**Solution : JPA Specifications (Criteria API)**

```java
// Construction dynamique de la requête
Specification<Lieu> spec = Specification.where(null);

if (userWantsWifi) {
    spec = spec.and(LieuSpecifications.hasWifi());
}
if (userWantsPrises) {
    spec = spec.and(LieuSpecifications.hasPrises());
}
if (userWantsCalme) {
    spec = spec.and(LieuSpecifications.hasAmbiance("calme"));
}

// Exécution
List<Lieu> results = lieuRepository.findAll(spec);
```

### 3.3.3 API de Recherche

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| /api/lieux/search | POST | Recherche avec filtres dynamiques |

**Request Body** :
```json
{
  "critereIds": [1, 3, 7, 12],
  "page": 0,
  "size": 20,
  "sortBy": "relevance"  // ou "rating", "distance"
}
```

**Response** :
```json
{
  "content": [...],
  "totalElements": 156,
  "totalPages": 8,
  "currentPage": 0
}
```

## 3.4 Système d'Avis et Ranking

### 3.4.1 Entité Avis

```java
Avis {
  id: Long
  lieu: Lieu                // Many-to-One
  utilisateur: Utilisateur  // Many-to-One
  note: Integer            // 1-5 étoiles
  commentaire: String       // Texte libre
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 3.4.2 Calcul de la Note Moyenne

**Formule** :
```java
noteMoyenne = ROUND(SUM(note) / COUNT(avis), 1)
// Ex: (5+4+5+3+4) / 5 = 4.2
```

**Implémentation JPA** :
```java
@Formula("(SELECT AVG(a.note) FROM avis a WHERE a.lieu_id = id)")
private Double noteMoyenne;
```

### 3.4.3 Algorithme de Ranking (Tri des Résultats)

**Ordre de priorité** (décroissant pour tous) :

1. **Nombre de critères correspondants** (pertinence)
   - Un lieu avec 5/5 critères sélectionnés avant un lieu avec 2/5

2. **Note moyenne** (qualité)
   - En cas d'égalité sur les critères, le mieux noté d'abord

3. **Nombre d'avis** (popularité/confiance)
   - En cas d'égalité, celui avec le plus d'avis d'abord

4. **Date de création** (récent)
   - En cas d'égalité, le plus récent d'abord

**Implémentation** :
```java
// Dans le service de recherche
return lieuRepository.findAll(spec, Sort.by(
    Sort.Order.desc("pertinence"),      // Custom calculation
    Sort.Order.desc("noteMoyenne"),
    Sort.Order.desc("nbAvis"),
    Sort.Order.desc("createdAt")
));
```

---

# 4. Module IA - Concierge Virtuel

## 4.1 Concept

Au lieu de cocher des cases, l'utilisateur tape en langage naturel :

> **Exemple** : *"Je cherche un café calme ouvert le dimanche avec des prises pour bosser"*

→ L'IA extrait les intentions → Convertit en tags → Lance la recherche

## 4.2 Architecture du Module IA

```
Utilisateur (Input texte)
    ↓
Frontend Angular → POST /api/smart-search
    ↓
Backend Spring Boot
    ↓
LLMService (Appel API OpenAI/Claude)
    ↓
Prompt Engineering → Extraction JSON
    ↓
Mapping JSON → Tag IDs (Base de données)
    ↓
Recherche standard avec les tags extraits
    ↓
Résultats + Explication à l'utilisateur
```

## 4.3 Prompt Engineering

### Prompt d'Extraction d'Intentions

```
Tu es un assistant intelligent pour une application de recherche d'espaces de travail.

Analyse la requête utilisateur suivante et extrais les critères/tags pertinents.

Requête : "{userQuery}"

Critères disponibles en base de données :
- wifi (wifi gratuit)
- prises (prises électriques disponibles)
- calme (ambiance calme et tranquille)
- dimanche (ouvert le dimanche)
- ... (liste complète)

Réponds UNIQUEMENT en JSON avec ce format :
{
  "tags": ["wifi", "prises", "calme", "dimanche"],
  "confidence": 0.95,
  "explanation": "L'utilisateur cherche un endroit calme avec wifi et prises, ouvert le dimanche",
  "unknownCriteria": []  // Critères mentionnés mais non disponibles
}

Si un critère mentionné n'existe pas dans la base, ajoute-le à "unknownCriteria".
```

### Exemple de Réponse LLM

**Input** : *"Un endroit cosy pour lire le weekend avec du bon café"*

**Output** :
```json
{
  "tags": ["cosy", "weekend", "cafe"],
  "confidence": 0.88,
  "explanation": "Ambiance cosy, ouvert le weekend, établissement avec café",
  "unknownCriteria": []
}
```

## 4.4 API Smart Search

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| /api/smart-search | POST | Recherche par langage naturel |

**Request** :
```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec des prises pour bosser"
}
```

**Response** :
```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec des prises pour bosser",
  "understood": {
    "tags": ["wifi", "prises", "calme", "dimanche"],
    "tagIds": [1, 3, 5, 12],
    "explanation": "Café avec ambiance calme, ouvert le dimanche, équipé en prises électriques et wifi"
  },
  "results": [...],
  "unknownCriteria": [],
  "suggestions": ["Essayez aussi avec 'vegan-friendly' ou 'tables spacieuses'"]
}
```

## 4.5 Gestion des Critères Inconnus

**Scénario** : L'utilisateur demande un critère qui n'existe pas encore

**Exemple** :
> *"Je cherche un café avec terrasse chauffée et prises"

**Réponse du système** :
```json
{
  "understood": {
    "tags": ["prises"],
    "tagIds": [3]
  },
  "unknownCriteria": ["terrasse chauffée"],
  "message": "Nous n'avons pas encore de filtre 'terrasse chauffée'. Nous avons cherché avec vos autres critères. Suggestion : essayez 'terrasse' ou 'extérieur'",
  "results": [...]
}
```

## 4.6 Optimisations

### Caching des Requêtes Fréquentes
- Utiliser **Redis** ou cache mémoire pour stocker les résultats des requêtes identiques/similaires
- Réduire les coûts API et la latence

### Fallback en cas d'erreur LLM
- Si l'API LLM est indisponible → redirection vers la recherche par filtres manuels
- Message utilisateur : *"Le service IA est temporairement indisponible, utilisez les filtres manuels"*

---

# 5. Architecture et Modélisation

## 5.1 Diagramme de Classes (Entités)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Utilisateur   │       │      Lieu       │       │     Critere     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id: Long        │       │ id: Long        │       │ id: Long        │
│ email: String   │       │ nom: String     │       │ nom: String     │
│ nom: String     │1     *│ adresse: String │*     *│ description: Str│
│ prenom: String  │◄──────│ description: Str│◄──────┤ categorie: Str  │
│ role: Enum      │       │ latitude: Double│      │ icon: String    │
│ password: String│       │ longitude: Double│     │ actif: Boolean  │
│ createdAt: Date │       │ noteMoyenne: Dbl│       └─────────────────┘
└─────────────────┘       │ createdAt: Date │              ▲
         │                └─────────────────┘              │
         │                         │                      │
         │                         │                      │
         │                    ┌────┴────┐                 │
         │                    │  Avis   │                 │
         │                    ├─────────┤                 │
         │                    │ id: Long│                 │
         └────────────────►│ note: Int    │
                              │ commentaire   │
                              │ createdAt: Date│
                              └─────────┘
                              
┌─────────────────┐
│  LieuCritere    │  (Table de jointure Many-to-Many)
├─────────────────┤
│ lieu_id: Long   │◄─── FK vers Lieu
│ critere_id: Long│◄─── FK vers Critere
└─────────────────┘
```

## 5.2 Modèle Relationnel (MySQL)

```sql
-- Table Utilisateur
CREATE TABLE utilisateur (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role ENUM('USER', 'OWNER', 'ADMIN') DEFAULT 'USER',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table Lieu
CREATE TABLE lieu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(500) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    proprietaire_id BIGINT NOT NULL,
    horaires VARCHAR(255),
    note_moyenne DECIMAL(2, 1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_note_moyenne (note_moyenne)
);

-- Table Critere
CREATE TABLE critere (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    categorie VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categorie (categorie),
    INDEX idx_actif (actif)
);

-- Table de jointure Lieu <-> Critere (Many-to-Many)
CREATE TABLE lieu_critere (
    lieu_id BIGINT NOT NULL,
    critere_id BIGINT NOT NULL,
    PRIMARY KEY (lieu_id, critere_id),
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (critere_id) REFERENCES critere(id) ON DELETE CASCADE,
    INDEX idx_lieu (lieu_id),
    INDEX idx_critere (critere_id)
);

-- Table Avis
CREATE TABLE avis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lieu_id BIGINT NOT NULL,
    utilisateur_id BIGINT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    UNIQUE KEY unique_avis (lieu_id, utilisateur_id), -- Un avis par utilisateur par lieu
    INDEX idx_lieu_avis (lieu_id),
    INDEX idx_utilisateur_avis (utilisateur_id)
);
```

## 5.3 Pourquoi JPA Specifications est Obligatoire

### Problème des Requêtes Statiques

Avec une requête JPQL statique :
```java
@Query("SELECT l FROM Lieu l JOIN l.criteres c WHERE c.nom IN :criteres")
List<Lieu> findByCriteres(@Param("criteres") List<String> criteres);
```

**Limitations** :
- Nombre de critères fixé dans la requête
- Impossible de combiner AND/OR dynamiquement
- Une méthode par combinaison possible

### Solution : Criteria API / Specifications

```java
public class LieuSpecifications {
    
    public static Specification<Lieu> hasCritere(String critereNom) {
        return (root, query, cb) -> {
            Join<Lieu, Critere> critereJoin = root.join("criteres");
            return cb.equal(critereJoin.get("nom"), critereNom);
        };
    }
    
    public static Specification<Lieu> hasCriteres(List<String> criteresNoms) {
        return (root, query, cb) -> {
            Join<Lieu, Critere> critereJoin = root.join("criteres");
            return critereJoin.get("nom").in(criteresNoms);
        };
    }
    
    public static Specification<Lieu> noteGreaterThan(Double minNote) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("noteMoyenne"), minNote);
    }
}

// Utilisation dynamique
Specification<Lieu> spec = Specification.where(null);
if (filtres.getWifi()) spec = spec.and(hasCritere("wifi"));
if (filtres.getPrises()) spec = spec.and(hasCritere("prises"));
if (filtres.getMinNote() != null) spec = spec.and(noteGreaterThan(filtres.getMinNote()));

List<Lieu> results = lieuRepository.findAll(spec);
```

**Avantages** :
- ✅ Construction dynamique selon les choix de l'utilisateur
- ✅ Combinaison illimitée de filtres
- ✅ Type-safe (vérifié à la compilation)
- ✅ Pas de concatenation de strings SQL (sécurité)

---

# 6. Exigences Non-Fonctionnelles

## 6.1 Mobile-First (UI/UX)

### Pourquoi Tailwind CSS est critique

L'application est utilisée **"dans la rue sur smartphone"** :
- Recherche rapide en déplacement
- Interface tactile optimisée
- Temps de chargement rapides

### Principes Mobile-First

| Aspect | Exigence |
|--------|----------|
| **Responsive** | Design qui s'adapte mobile → tablette → desktop |
| **Touch targets** | Boutons/filtres minimum 44px de hauteur |
| **Navigation** | Bottom navigation bar sur mobile |
| **Performance** | First Contentful Paint < 2s |
| **Offline** | Service Worker pour cache offline (optionnel) |

### Classes Tailwind Typiques

```html
<!-- Mobile-first card -->
<div class="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
  <h2 class="text-lg md:text-xl font-bold">Nom du Lieu</h2>
  <div class="flex flex-wrap gap-2 mt-2">
    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Wifi</span>
    <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Calme</span>
  </div>
</div>
```

## 6.2 Performances SQL

### Pourquoi les Index sont Cruciaux

Les requêtes de recherche impliquent **plusieurs JOIN** :
```sql
SELECT l.* FROM lieu l
JOIN lieu_critere lc ON l.id = lc.lieu_id
JOIN critere c ON lc.critere_id = c.id
WHERE c.nom IN ('wifi', 'prises', 'calme')
GROUP BY l.id
HAVING COUNT(DISTINCT c.id) = 3
```

**Sans index** : Full table scan → **O(n×m)** opérations
**Avec index** : Index seek → **O(log n)** opérations

### Index Recommandés

```sql
-- Index sur les clés étrangères (JOIN fréquents)
CREATE INDEX idx_lieu_critere_lieu ON lieu_critere(lieu_id);
CREATE INDEX idx_lieu_critere_critere ON lieu_critere(critere_id);
CREATE INDEX idx_avis_lieu ON avis(lieu_id);
CREATE INDEX idx_lieu_proprietaire ON lieu(proprietaire_id);

-- Index sur les colonnes de filtrage
CREATE INDEX idx_critere_nom ON critere(nom);
CREATE INDEX idx_critere_actif ON critere(actif);
CREATE INDEX idx_lieu_note ON lieu(note_moyenne);

-- Index composite pour les recherches fréquentes
CREATE INDEX idx_lieu_note_created ON lieu(note_moyenne DESC, created_at DESC);
```

## 6.3 Sécurité - JWT

### Protection des Routes Sensibles

**Routes à protéger** :
- `POST /api/criteres` → Admin uniquement
- `PUT /api/criteres/{id}` → Admin uniquement
- `DELETE /api/criteres/{id}` → Admin uniquement

### Architecture JWT

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │   Spring    │      │   JWT       │
│  (Angular)  │◄────►│   Security  │◄────►│   Filter    │
└─────────────┘      └─────────────┘      └─────────────┘
                           │                      │
                           ▼                      ▼
                    ┌─────────────┐      ┌─────────────┐
                    │  @PreAuthorize│     │  Validation │
                    │("hasRole('ADMIN')")│  Signature  │
                    └─────────────┘      └─────────────┘
```

### Implémentation

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lieux/**").permitAll()
                .requestMatchers("/api/criteres/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}

@RestController
@RequestMapping("/api/criteres")
public class CritereController {
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Critere> createCritere(@RequestBody CritereDTO dto) {
        // Seul l'admin peut créer
    }
}
```

---

# 7. Planning et Livrables

## 7.1 Planning Prévisionnel (12 Semaines)

| Phase | Semaines | Objectifs Clés |
|-------|----------|----------------|
| **Phase 1** | 1-2 | Cahier des charges, Modélisation BDD, Setup environnement |
| **Phase 2** | 3-4 | Entités JPA, Repositories, API REST de base |
| **Phase 3** | 5-6 | **Moteur de recherche** (JPA Specifications), **Ranking**, Avis |
| **Phase 4** | 7-8 | Frontend Angular, UI Mobile-First, Intégration API |
| **Phase 5** | 9 | **Sécurité JWT**, Authentification, Autorisation |
| **Phase 6** | 10-11 | **Module IA - Concierge Virtuel**, Tests, Optimisation |
| **Phase 7** | 12 | Tests de charge, Déploiement, Documentation finale |

### Détail des 5 Phases Clés (Exigé)

```
┌────────────────────────────────────────────────────────────┐
│ PHASE 1 : Modélisation & Socle (Semaines 1-2)            │
├────────────────────────────────────────────────────────────┤
│ • Maquettage UI Mobile-First                             │
│ • Diagramme ERD et schéma SQL                            │
│ • Setup Angular + Spring Boot                            │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 2 : Le Moteur de Recherche (Semaines 3-4)          │
├────────────────────────────────────────────────────────────┤
│ • Implémentation JPA Specifications                        │
│ • API de recherche dynamique                             │
│ • Indexation MySQL                                       │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 3 : Ranking & Avis (Semaines 5-6)                  │
├────────────────────────────────────────────────────────────┤
│ • Système d'avis et notes                                │
│ • Algorithme de ranking multi-critères                   │
│ • Tests de performance                                   │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 4 : IA Smart Finder (Semaines 7-8)                 │
├────────────────────────────────────────────────────────────┤
│ • Intégration API LLM                                    │
│ • Prompt Engineering                                     │
│ • Interface recherche naturelle                          │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 5 : Optimisation & Recettage (Semaines 9-12)       │
├────────────────────────────────────────────────────────────┤
│ • Tests de charge sur la BDD                             │
│ • Optimisation requêtes                                  │
│ • Déploiement production                                 │
│ • Documentation finale                                   │
└────────────────────────────────────────────────────────────┘
```

## 7.2 Livrables Attendus

### Code Source
- [ ] Repository GitHub avec historique des commits
- [ ] Structure claire : `frontend/` et `backend/`
- [ ] Fichier README.md avec instructions d'installation

### Documentation Technique
- [ ] **Cahier des charges** (ce document)
- [ ] **Diagramme ERD** de la base de données
- [ ] **Documentation API** (Swagger/OpenAPI ou collection Postman)

### Application Déployée
- [ ] Backend déployé et accessible (Heroku/Railway/Render)
- [ ] Frontend déployé et accessible (Vercel/Netlify)
- [ ] Base de données peuplée avec données de test réalistes

### Rapport de Projet
- [ ] Introduction et Contexte
- [ ] Analyse des besoins et Conception
- [ ] Réalisation technique (captures d'écran)
- [ ] Tests et Résultats
- [ ] Bilan et Perspectives

### Soutenance
- [ ] Slides de présentation
- [ ] Démo fonctionnelle de l'application

---

## 7.3 Évaluation des Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Complexité JPA Specifications | Moyenne | Haute | Formation préalable, documentation Spring |
| Latence API LLM | Moyenne | Moyenne | Mise en cache, fallback filtres manuels |
| Performance BDD avec JOINs | Moyenne | Haute | Indexation, pagination, optimisation requêtes |
| Retards de développement | Moyenne | Haute | Planning buffer, priorisation fonctionnalités |

---

# 📎 Annexes

## A. Glossaire

| Terme | Définition |
|-------|------------|
| **Tag / Critère** | Attribut caractérisant un lieu (ex: "wifi", "calme") |
| **Many-to-Many** | Relation où plusieurs lieux peuvent avoir plusieurs critères |
| **JPA Specifications** | Pattern Spring Data pour requêtes dynamiques |
| **JWT** | JSON Web Token, standard d'authentification |
| **LLM** | Large Language Model (ex: GPT-4, Claude) |
| **Mobile-First** | Approche design où le mobile est prioritaire |

## B. Ressources Recommandées

- [Spring Data JPA - Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [OpenAI API Documentation](https://platform.openai.com/docs/introduction)
- [Angular - Reactive Forms](https://angular.io/guide/reactive-forms)

---

**Document version 1.0** | *Smart Finder - Cahier des Charges Technique*
