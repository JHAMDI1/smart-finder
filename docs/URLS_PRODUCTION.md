# URLs de Production - Smart Finder

## 🔗 Liens de l'application déployée

### Backend API
- **URL** : `https://smart-finder-backend.onrender.com`
- **Swagger UI** : `https://smart-finder-backend.onrender.com/swagger-ui.html`
- **Health Check** : `https://smart-finder-backend.onrender.com/actuator/health`

### Frontend
- **URL** : `https://smart-finder-frontend.vercel.app`
- **Routes principales** :
  - `/` - Accueil (redirect /lieux)
  - `/lieux` - Liste des espaces
  - `/lieux/:id` - Détail d'un espace
  - `/smart-search` - Concierge Virtuel (IA)
  - `/login` - Connexion
  - `/register` - Inscription

### Base de données
- **Provider** : Railway / PlanetScale / Render
- **Nom** : smartfinder
- **Region** : Europe (Frankfurt)

---

## 📊 Statut des services

| Service | URL | Statut | Dernière vérification |
|---------|-----|--------|----------------------|
| Backend API | https://smart-finder-backend.onrender.com | 🟢 Online | 2026-02-26 |
| Frontend | https://smart-finder-frontend.vercel.app | 🟢 Online | 2026-02-26 |
| Database | - | 🟢 Online | 2026-02-26 |

---

## 🔐 Variables d'environnement (Render)

```
MYSQL_URL=jdbc:mysql://...
MYSQL_USER=...
MYSQL_PASSWORD=...
JWT_SECRET=...
OPENAI_API_KEY=...
CORS_ORIGINS=https://smart-finder-frontend.vercel.app
```

---

## 📝 Notes

- **Date de déploiement** : 2026-02-26
- **Version** : 1.0.0
- **Commit** : Phase 7 final

---

## 🔄 Mises à jour

| Date | Version | Changements |
|------|---------|-------------|
| 2026-02-26 | 1.0.0 | Déploiement initial |

