# Smart Finder - Frontend

Application frontend Angular pour le PFE Smart Finder - Plateforme de recommandation d'espaces de coworking avec recherche intelligente par IA.

## 🚀 Technologies

- **Angular 19** - Framework frontend
- **TypeScript 5.7** - Langage
- **Tailwind CSS** - Framework CSS
- **RxJS** - Programmation réactive
- **Angular Router** - Navigation
- **HTTP Client** - Communication API
- **Standalone Components** - Architecture moderne

## 📁 Structure du Projet

```
smart-finder-frontend/
├── src/app/
│   ├── auth/                    # Authentification
│   │   ├── components/          # Login, Register
│   │   ├── services/            # AuthService
│   │   └── models/              # Interfaces utilisateur
│   ├── lieu/                    # Espaces de coworking
│   │   ├── components/          # LieuList, LieuDetail
│   │   ├── services/            # LieuService
│   │   └── models/              # Interfaces lieu
│   ├── critere/                 # Critères de recherche
│   │   ├── services/            # CritereService
│   │   └── models/              # Interfaces critère
│   ├── avis/                    # Système d'avis
│   │   └── services/            # AvisService
│   ├── smart-search/            # Module IA
│   │   └── components/          # SmartSearchComponent
│   ├── shared/                  # Composants partagés
│   │   ├── components/          # Navbar
│   │   ├── guards/              # AuthGuard, PublicGuard
│   │   └── interceptors/        # AuthInterceptor
│   └── environments/            # Configurations
├── src/styles.scss              # Styles globaux + Tailwind
├── tailwind.config.js           # Configuration Tailwind
└── angular.json                 # Configuration Angular
```

## 🛠️ Installation

### Prérequis

- Node.js 22+
- npm 10+
- Angular CLI 19.1.5

### Configuration

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd smart-finder-frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   
   Modifier `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api/v1'
   };
   ```

4. **Lancer l'application**
   ```bash
   ng serve
   # ou
   npm start
   ```

   Accéder à `http://localhost:4200`

## 📱 Fonctionnalités

### 🔐 Authentification
- Inscription avec choix de rôle (USER, OWNER)
- Connexion avec JWT
- Stockage local des tokens
- Guards de protection des routes
- Intercepteur HTTP automatique (Bearer token)

### 🔍 Recherche
- **Recherche par filtres** - Interface avec filtres par catégorie
- **Recherche intelligente IA** - Input naturel avec extraction automatique des critères
- Résultats paginés avec cartes d'informations

### 📍 Espaces (Lieux)
- Liste avec filtres responsive
- Détail complet avec critères et avis
- Design mobile-first

### ⭐ Avis
- Système de notation 1-5 étoiles
- Commentaires
- Note moyenne calculée automatiquement

### 🤖 Concierge Virtuel (Phase 6)
- Input type chat pour requêtes en langage naturel
- Exemples de prompts suggérés
- Affichage des critères extraits par l'IA
- Résultats avec scores de pertinence

## 🧪 Tests

```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e

# Lint
ng lint
```

## 📦 Build Production

```bash
ng build --configuration production
```

Sortie dans `dist/smart-finder-frontend/`

## 🚀 Déploiement

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## 👥 Équipe

Projet de fin d'études (PFE) - 2026

## 📝 Licence

Propriétaire - Tous droits réservés

