# 🗄️ Database Guide

Documentation complète de la base de données Smart Finder (MySQL).

---

## 📋 Table des Matières

- [Schema Overview](#schema-overview)
- [Tables](#tables)
- [Indexes](#indexes)
- [Migrations (Flyway)](#migrations-flyway)
- [Queries Examples](#queries-examples)
- [Optimization](#optimization)

---

## 🗂️ Schema Overview

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Utilisateur    │       │      Lieu       │       │    Critere      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ id (PK)         │◄──────┤ id (PK)         │
│ email (UQ)      │  1:N  │ nom             │  N:M  │ nom (UQ)        │
│ password_hash   │       │ adresse         │       │ description     │
│ nom             │       │ description     │       │ categorie       │
│ prenom          │       │ latitude        │       │ icon            │
│ role            │       │ longitude       │       │ actif           │
│ created_at      │       │ proprietaire_id │       │ created_at      │
└─────────────────┘       │ horaires        │       └────────┬────────┘
                          │ note_moyenne    │                │
                          │ created_at      │                │
                          └────────┬────────┘                │
                                   │                         │
                          ┌────────┴────────┐               │
                          │      Avis       │               │
                          ├─────────────────┤               │
                          │ id (PK)         │               │
                          │ lieu_id (FK)    │               │
                          │ utilisateur_id  │               │
                          │ note (1-5)      │               │
                          │ commentaire     │               │
                          │ created_at      │               │
                          └─────────────────┘               │
                                                            │
                                                   ┌────────┴────────┐
                                                   │  lieu_critere     │
                                                   ├─────────────────┤
                                                   │ lieu_id (FK)    │
                                                   │ critere_id (FK) │
                                                   │ PK(lieu,crit)   │
                                                   └─────────────────┘
```

---

## 📊 Tables

### 1. utilisateur

```sql
CREATE TABLE utilisateur (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role ENUM('USER', 'OWNER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGINT | PK, AI | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email utilisateur |
| password_hash | VARCHAR(255) | NOT NULL | Mot de passe haché (BCrypt) |
| nom | VARCHAR(100) | NOT NULL | Nom de famille |
| prenom | VARCHAR(100) | NOT NULL | Prénom |
| role | ENUM | DEFAULT 'USER' | USER, OWNER, ADMIN |
| created_at | TIMESTAMP | DEFAULT NOW() | Date création |
| updated_at | TIMESTAMP | Auto-update | Date modification |

---

### 2. lieu

```sql
CREATE TABLE lieu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(500) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    proprietaire_id BIGINT NOT NULL,
    horaires VARCHAR(255),
    note_moyenne DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_note_moyenne (note_moyenne DESC),
    INDEX idx_created (created_at DESC),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGINT | PK, AI | Identifiant |
| nom | VARCHAR(255) | NOT NULL | Nom du lieu |
| adresse | VARCHAR(500) | NOT NULL | Adresse complète |
| description | TEXT | NULL | Description détaillée |
| latitude | DECIMAL(10,8) | NULL | Latitude GPS |
| longitude | DECIMAL(11,8) | NULL | Longitude GPS |
| proprietaire_id | BIGINT | FK | Référence utilisateur |
| horaires | VARCHAR(255) | NULL | Horaires d'ouverture |
| note_moyenne | DECIMAL(2,1) | DEFAULT 0 | Moyenne des avis |

---

### 3. critere

```sql
CREATE TABLE critere (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    categorie VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_categorie (categorie),
    INDEX idx_actif_nom (actif, nom)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGINT | PK, AI | Identifiant |
| nom | VARCHAR(100) | UNIQUE | Nom unique du critère (ex: wifi) |
| description | VARCHAR(255) | NULL | Description explicative |
| categorie | VARCHAR(50) | NOT NULL | CONNECTIVITE, AMBIANCE, etc. |
| icon | VARCHAR(50) | NULL | Icône (classe CSS ou emoji) |
| actif | BOOLEAN | DEFAULT TRUE | Actif/Inactif |

**Catégories recommandées** :
- `CONNECTIVITE` : wifi, prises, usb
- `AMBIANCE` : calme, anime, cosy, lumineux
- `CONFORT` : tables, chaises, clim
- `SERVICE` : menu, cafe, nourriture
- `HORAIRES` : dimanche, tard, tot
- `ACCESSIBILITE` : pmr, parking, transport

---

### 4. lieu_critere (Join Table)

```sql
CREATE TABLE lieu_critere (
    lieu_id BIGINT NOT NULL,
    critere_id BIGINT NOT NULL,
    PRIMARY KEY (lieu_id, critere_id),
    
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (critere_id) REFERENCES critere(id) ON DELETE CASCADE,
    
    INDEX idx_lieu (lieu_id),
    INDEX idx_critere (critere_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5. avis

```sql
CREATE TABLE avis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lieu_id BIGINT NOT NULL,
    utilisateur_id BIGINT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_avis (lieu_id, utilisateur_id),
    INDEX idx_lieu_avis (lieu_id, created_at DESC),
    INDEX idx_utilisateur (utilisateur_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGINT | PK, AI | Identifiant |
| lieu_id | BIGINT | FK | Référence lieu |
| utilisateur_id | BIGINT | FK | Référence utilisateur |
| note | INT | CHECK 1-5 | Note de 1 à 5 |
| commentaire | TEXT | NULL | Commentaire texte |

**Contrainte UNIQUE** : Un utilisateur ne peut donner qu'un avis par lieu.

---

## 🔍 Indexes

### Index Summary

```sql
-- Performance indexes for search queries
CREATE INDEX idx_lieu_critere_lieu ON lieu_critere(lieu_id);
CREATE INDEX idx_lieu_critere_critere ON lieu_critere(critere_id);

-- Filter indexes
CREATE INDEX idx_critere_actif ON critere(actif);
CREATE INDEX idx_critere_categorie ON critere(categorie);

-- Sort indexes
CREATE INDEX idx_lieu_note_created ON lieu(note_moyenne DESC, created_at DESC);
```

### Why These Indexes?

| Index | Usage | Impact |
|-------|-------|--------|
| `idx_lieu_critere_lieu` | JOIN lieu_critere → lieux | Fast lookup by lieu |
| `idx_lieu_critere_critere` | JOIN for search filters | Fast lookup by critère |
| `idx_critere_actif` | Filter active criteria | Avoids table scan |
| `idx_lieu_note_created` | ORDER BY note/created | Index-only sorting |

---

## 🚀 Migrations (Flyway)

### Migration Files Structure

```
src/main/resources/db/migration/
├── V1__init_schema.sql
├── V2__add_indexes.sql
├── V3__seed_data.sql
└── V4__add_location_index.sql
```

### V1__init_schema.sql

```sql
-- Users table
CREATE TABLE utilisateur (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role ENUM('USER', 'OWNER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criteria table
CREATE TABLE critere (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    categorie VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Places table
CREATE TABLE lieu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(500) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    proprietaire_id BIGINT NOT NULL,
    horaires VARCHAR(255),
    note_moyenne DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Join table
CREATE TABLE lieu_critere (
    lieu_id BIGINT NOT NULL,
    critere_id BIGINT NOT NULL,
    PRIMARY KEY (lieu_id, critere_id),
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (critere_id) REFERENCES critere(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE avis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lieu_id BIGINT NOT NULL,
    utilisateur_id BIGINT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lieu_id) REFERENCES lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    UNIQUE KEY unique_avis (lieu_id, utilisateur_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### V2__add_indexes.sql

```sql
-- User indexes
CREATE INDEX idx_email ON utilisateur(email);
CREATE INDEX idx_role ON utilisateur(role);

-- Place indexes
CREATE INDEX idx_proprietaire ON lieu(proprietaire_id);
CREATE INDEX idx_note_moyenne ON lieu(note_moyenne DESC);
CREATE INDEX idx_created ON lieu(created_at DESC);

-- Criteria indexes
CREATE INDEX idx_categorie ON critere(categorie);
CREATE INDEX idx_actif ON critere(actif);
CREATE INDEX idx_actif_nom ON critere(actif, nom);

-- Join table indexes
CREATE INDEX idx_lieu ON lieu_critere(lieu_id);
CREATE INDEX idx_critere ON lieu_critere(critere_id);

-- Review indexes
CREATE INDEX idx_lieu_avis ON avis(lieu_id, created_at DESC);
CREATE INDEX idx_utilisateur_avis ON avis(utilisateur_id);
```

### V3__seed_data.sql

```sql
-- Seed criteria
INSERT INTO critere (nom, description, categorie, icon) VALUES
('wifi', 'Wifi gratuit et stable', 'CONNECTIVITE', 'wifi'),
('prises', 'Prises électriques disponibles', 'CONNECTIVITE', 'plug'),
('usb', 'Ports USB disponibles', 'CONNECTIVITE', 'usb'),
('calme', 'Ambiance calme et tranquille', 'AMBIANCE', 'volume-x'),
('anime', 'Ambiance animée', 'AMBIANCE', 'volume-2'),
('cosy', 'Ambiance cosy et confortable', 'AMBIANCE', 'sofa'),
('lumineux', 'Espace lumineux', 'AMBIANCE', 'sun'),
('tables', 'Tables spacieuses', 'CONFORT', 'table'),
('chaises', 'Chaises confortables', 'CONFORT', 'armchair'),
('clim', 'Climatisation', 'CONFORT', 'wind'),
('menu', 'Menu étudiant', 'SERVICE', 'utensils'),
('cafe', 'Café de qualité', 'SERVICE', 'coffee'),
('nourriture', 'Nourriture disponible', 'SERVICE', 'utensils-crossed'),
('vegan', 'Options vegan-friendly', 'SERVICE', 'leaf'),
('dimanche', 'Ouvert le dimanche', 'HORAIRES', 'calendar'),
('tard', 'Ouvert tard (après 20h)', 'HORAIRES', 'moon'),
('tot', 'Ouvert tôt', 'HORAIRES', 'sunrise'),
('pmr', 'Accessible PMR', 'ACCESSIBILITE', 'wheelchair'),
('parking', 'Parking à proximité', 'ACCESSIBILITE', 'car'),
('transport', 'Proche transports en commun', 'ACCESSIBILITE', 'bus');
```

---

## 📝 Queries Examples

### Search with Multiple Criteria (JPA Specifications)

```sql
-- Find places with wifi AND calme AND dimanche
SELECT DISTINCT l.*
FROM lieu l
JOIN lieu_critere lc ON l.id = lc.lieu_id
JOIN critere c ON lc.critere_id = c.id
WHERE c.nom IN ('wifi', 'calme', 'dimanche')
GROUP BY l.id
HAVING COUNT(DISTINCT c.id) = 3
ORDER BY l.note_moyenne DESC, l.created_at DESC
LIMIT 20 OFFSET 0;
```

### Calculate Average Rating

```sql
-- Update average rating for a place
UPDATE lieu l
SET note_moyenne = (
    SELECT AVG(note)
    FROM avis
    WHERE lieu_id = l.id
)
WHERE id = ?;
```

### Find Places by Owner

```sql
SELECT l.*, COUNT(a.id) as nb_avis
FROM lieu l
LEFT JOIN avis a ON l.id = a.lieu_id
WHERE l.proprietaire_id = ?
GROUP BY l.id;
```

### Search with Geo (if implemented)

```sql
-- Find places within 5km of a point
SELECT *,
    (6371 * acos(
        cos(radians(?)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(?)) +
        sin(radians(?)) * sin(radians(latitude))
    )) AS distance
FROM lieu
HAVING distance < 5
ORDER BY distance;
```

---

## ⚡ Optimization

### EXPLAIN Queries

```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT l.*
FROM lieu l
JOIN lieu_critere lc ON l.id = lc.lieu_id
WHERE lc.critere_id = 1;

-- Expected: type=ref, key=idx_lieu
```

### Performance Tips

| Tip | Impact |
|-----|--------|
| Use `EXPLAIN` before production | Identify slow queries |
| Composite indexes for multi-column filters | Faster combined filters |
| Limit JOIN results | Reduce memory usage |
| Use `COUNT(*)` over `COUNT(column)` | Faster counting |
| Partition large tables | Better query performance |

### Monitoring Queries

```sql
-- Slow query log (MySQL)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- Check running queries
SHOW FULL PROCESSLIST;
```

---

## 📚 Related Documentation

- [Backend Guide](../BACKEND_GUIDE.md) - JPA entities
- [Architecture Overview](../ARCHITECTURE.md) - Data flow
- [API Reference](../API_REFERENCE.md) - Data contracts

---

**Version** : 1.0  
**Last Updated** : Février 2026
