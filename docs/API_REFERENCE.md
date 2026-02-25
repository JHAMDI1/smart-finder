# 🔌 API Reference

Documentation complète des endpoints API REST.

---

## 📋 Base URL

```
Development: http://localhost:8080/api/v1
Production:  https://api.smart-finder.com/api/v1
```

---

## 🔐 Authentication

Toutes les routes protégées nécessitent un JWT token dans le header :

```
Authorization: Bearer <token>
```

### Auth Endpoints (Public)

#### POST /auth/register

Créer un nouveau compte.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "role": "USER"
  }
}
```

#### POST /auth/login

Authentification.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "role": "USER"
  }
}
```

---

## 📍 Lieux (Places)

### GET /lieux

Lister tous les lieux (paginé).

**Query Parameters:**
- `page` (int): Page number (default: 0)
- `size` (int): Items per page (default: 20)
- `sort` (string): Sort field (default: createdAt,desc)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "nom": "Café de la Paix",
      "adresse": "12 Rue de la Paix, Paris",
      "description": "Café calme avec wifi",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "horaires": "Lun-Ven: 8h-20h",
      "noteMoyenne": 4.5,
      "criteres": [
        {
          "id": 1,
          "nom": "wifi",
          "description": "Wifi gratuit",
          "categorie": "CONNECTIVITE",
          "icon": "wifi"
        }
      ],
      "createdAt": "2026-01-15T10:30:00"
    }
  ],
  "totalElements": 156,
  "totalPages": 8,
  "number": 0,
  "size": 20
}
```

### GET /lieux/{id}

Récupérer un lieu par ID.

**Response (200):**
```json
{
  "id": 1,
  "nom": "Café de la Paix",
  "adresse": "12 Rue de la Paix, Paris",
  "description": "Café calme avec wifi",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "horaires": "Lun-Ven: 8h-20h",
  "noteMoyenne": 4.5,
  "criteres": [...],
  "avis": [
    {
      "id": 1,
      "note": 5,
      "commentaire": "Super café !",
      "utilisateur": {
        "id": 2,
        "nom": "Smith",
        "prenom": "Jane"
      },
      "createdAt": "2026-01-20T14:30:00"
    }
  ],
  "createdAt": "2026-01-15T10:30:00"
}
```

### POST /lieux

Créer un nouveau lieu (OWNER/ADMIN uniquement).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "nom": "Mon Café",
  "adresse": "45 Avenue des Champs-Élysées, Paris",
  "description": "Café moderne avec espace coworking",
  "latitude": 48.8698,
  "longitude": 2.3079,
  "horaires": "Lun-Sam: 7h-22h, Dim: 9h-20h",
  "critereIds": [1, 3, 5, 12]
}
```

**Response (201):**
```json
{
  "id": 42,
  "nom": "Mon Café",
  "adresse": "45 Avenue des Champs-Élysées, Paris",
  "description": "Café moderne avec espace coworking",
  "latitude": 48.8698,
  "longitude": 2.3079,
  "horaires": "Lun-Sam: 7h-22h, Dim: 9h-20h",
  "noteMoyenne": 0.0,
  "criteres": [...],
  "createdAt": "2026-02-25T10:17:00"
}
```

### PUT /lieux/{id}

Mettre à jour un lieu (propriétaire ou admin).

**Request:**
```json
{
  "nom": "Mon Café Updated",
  "adresse": "45 Avenue des Champs-Élysées, Paris",
  "description": "Description mise à jour",
  "critereIds": [1, 3, 5, 12, 15]
}
```

**Response (200):** Lieu mis à jour

### DELETE /lieux/{id}

Supprimer un lieu (propriétaire ou admin).

**Response (204):** No content

---

## 🔍 Search

### POST /lieux/search

Recherche avancée avec filtres (JPA Specifications).

**Request:**
```json
{
  "critereIds": [1, 3, 5],
  "minNote": 4.0,
  "page": 0,
  "size": 20,
  "sortBy": "relevance"
}
```

**Response (200):**
```json
{
  "content": [...],
  "totalElements": 23,
  "totalPages": 2,
  "number": 0
}
```

**Sort Options:**
- `relevance` - Pertinence (nombre de critères matchés)
- `rating` - Note moyenne décroissante
- `newest` - Plus récent d'abord
- `distance` - Plus proche d'abord (si géoloc activée)

---

## 🤖 Smart Search

### POST /smart-search

Recherche en langage naturel avec IA.

**Request:**
```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec wifi"
}
```

**Response (200):**
```json
{
  "query": "Je cherche un café calme ouvert le dimanche avec wifi",
  "understood": {
    "tags": ["wifi", "calme", "dimanche"],
    "tagIds": [1, 5, 12],
    "explanation": "Café avec ambiance calme, ouvert le dimanche, équipé en wifi"
  },
  "results": [...],
  "unknownCriteria": [],
  "fallback": false
}
```

---

## 🏷️ Critères (Tags)

### GET /criteres

Lister tous les critères actifs.

**Response (200):**
```json
[
  {
    "id": 1,
    "nom": "wifi",
    "description": "Wifi gratuit et stable",
    "categorie": "CONNECTIVITE",
    "icon": "wifi",
    "actif": true
  },
  {
    "id": 3,
    "nom": "prises",
    "description": "Prises électriques disponibles",
    "categorie": "CONNECTIVITE",
    "icon": "plug",
    "actif": true
  }
]
```

### GET /criteres/{id}

Récupérer un critère par ID.

### POST /criteres ⭐ Admin Only

Créer un nouveau critère.

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "nom": "vegan",
  "description": "Options vegan-friendly",
  "categorie": "SERVICE",
  "icon": "leaf"
}
```

### PUT /criteres/{id} ⭐ Admin Only

Mettre à jour un critère.

### DELETE /criteres/{id} ⭐ Admin Only

Supprimer un critère.

---

## ⭐ Avis (Reviews)

### GET /lieux/{lieuId}/avis

Lister les avis d'un lieu.

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "note": 5,
      "commentaire": "Excellent café, très calme !",
      "utilisateur": {
        "id": 2,
        "nom": "Smith",
        "prenom": "Jane"
      },
      "createdAt": "2026-01-20T14:30:00"
    }
  ],
  "totalElements": 12
}
```

### POST /lieux/{lieuId}/avis

Ajouter un avis (authentification requise).

**Request:**
```json
{
  "note": 5,
  "commentaire": "Super endroit pour travailler !"
}
```

**Response (201):**
```json
{
  "id": 45,
  "note": 5,
  "commentaire": "Super endroit pour travailler !",
  "utilisateur": {
    "id": 3,
    "nom": "Doe",
    "prenom": "John"
  },
  "createdAt": "2026-02-25T10:20:00"
}
```

**Contrainte:** Un utilisateur ne peut donner qu'un avis par lieu.

### PUT /avis/{id}

Modifier son propre avis.

### DELETE /avis/{id}

Supprimer son propre avis (ou admin peut supprimer n'importe quel avis).

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation failed",
  "instance": "/api/v1/lieux",
  "errors": [
    {
      "field": "nom",
      "message": "Le nom est obligatoire"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "type": "about:blank",
  "title": "Forbidden",
  "status": 403,
  "detail": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Lieu with id 999 not found"
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | GET successful |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate (email, unique constraint) |
| 500 | Server Error | Unexpected error |

---

## 🧪 Testing with cURL

### Search

```bash
curl -X POST http://localhost:8080/api/v1/lieux/search \
  -H "Content-Type: application/json" \
  -d '{
    "critereIds": [1, 3, 5],
    "page": 0,
    "size": 10
  }'
```

### Smart Search

```bash
curl -X POST http://localhost:8080/api/v1/smart-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "café calme avec wifi"
  }'
```

---

**Version** : 1.0  
**Last Updated** : Février 2026
