# 📚 Smart Finder - Documentation du Projet

Bienvenue dans la documentation complète du projet **Smart Finder** - Application de recommandation d'espaces de travail avec IA.

---

## 📑 Table des Matières

### 🚀 Pour Commencer
- [Quick Start](./QUICK_START.md) - Mise en route en 15 minutes
- [Architecture Overview](./ARCHITECTURE.md) - Vue d'ensemble du système

### 🛠️ Guides de Développement
- [Backend Guide](./BACKEND_GUIDE.md) - Développement Spring Boot
- [Frontend Guide](./FRONTEND_GUIDE.md) - Développement Angular
- [Database Guide](./DATABASE.md) - Schéma et migrations

### 📋 Spécifications
- [API Reference](./API_REFERENCE.md) - Endpoints et DTOs
- [User Stories](./USER_STORIES.md) - Cas d'usage par acteur

### 🤖 Module IA
- [Smart Search](./SMART_SEARCH.md) - Documentation du Concierge Virtuel
- [Prompt Engineering](./PROMPT_ENGINEERING.md) - Guide des prompts

### 🚢 Déploiement
- [Deployment Guide](./DEPLOYMENT.md) - Mise en production
- [Environment Setup](./ENV_SETUP.md) - Configuration des environnements

### 🔧 Référence
- [Troubleshooting](./TROUBLESHOOTING.md) - Problèmes courants et solutions
- [Glossary](./GLOSSARY.md) - Terminologie du projet

---

## 🗂️ Structure de la Documentation

```
docs/
├── README.md                 # Ce fichier
├── QUICK_START.md           # Démarrage rapide
├── ARCHITECTURE.md          # Architecture complète
├── BACKEND_GUIDE.md         # Guide backend
├── FRONTEND_GUIDE.md        # Guide frontend
├── DATABASE.md              # Documentation BDD
├── API_REFERENCE.md         # Référence API
├── USER_STORIES.md          # Users stories
├── SMART_SEARCH.md          # Module IA
├── PROMPT_ENGINEERING.md    # Prompts LLM
├── DEPLOYMENT.md            # Guide déploiement
├── ENV_SETUP.md             # Setup environnement
├── TROUBLESHOOTING.md       # Dépannage
├── GLOSSARY.md              # Glossaire
├── diagrams/                # Diagrams architecture
│   ├── erd.png
│   ├── system-context.png
│   └── deployment.png
└── adr/                     # Architecture Decision Records
    ├── ADR-001-jpa-specifications.md
    ├── ADR-002-feature-based-packages.md
    └── ADR-003-jwt-security.md
```

---

## 🎯 Documentation par Rôle

### 👨‍💻 Développeur Backend
1. Commencez par [QUICK_START.md](./QUICK_START.md)
2. Lisez [ARCHITECTURE.md](./ARCHITECTURE.md) section Backend
3. Suivez [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
4. Référez-vous à [API_REFERENCE.md](./API_REFERENCE.md)

### 👩‍💻 Développeur Frontend
1. Commencez par [QUICK_START.md](./QUICK_START.md)
2. Lisez [ARCHITECTURE.md](./ARCHITECTURE.md) section Frontend
3. Suivez [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)
4. Intégrez avec [API_REFERENCE.md](./API_REFERENCE.md)

### 🗄️ DBA / Architecte données
1. Lisez [DATABASE.md](./DATABASE.md)
2. Consultez [ARCHITECTURE.md](./ARCHITECTURE.md) section Data
3. Révisez les [ADR](./adr/)

### 🤖 Intégrateur IA
1. Lisez [SMART_SEARCH.md](./SMART_SEARCH.md)
2. Étudiez [PROMPT_ENGINEERING.md](./PROMPT_ENGINEERING.md)
3. Référez-vous aux exemples dans `src/main/resources/prompts/`

### 🚀 DevOps
1. Lisez [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Suivez [ENV_SETUP.md](./ENV_SETUP.md)
3. Consultez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📊 Status de la Documentation

| Document | Status | Dernière Mise à Jour |
|----------|--------|---------------------|
| QUICK_START.md | ✅ Complète | Février 2026 |
| ARCHITECTURE.md | ✅ Complète | Février 2026 |
| BACKEND_GUIDE.md | ✅ Complète | Février 2026 |
| FRONTEND_GUIDE.md | ✅ Complète | Février 2026 |
| DATABASE.md | ✅ Complète | Février 2026 |
| API_REFERENCE.md | ✅ Complète | Février 2026 |
| USER_STORIES.md | ✅ Complète | Février 2026 |
| SMART_SEARCH.md | ✅ Complète | Février 2026 |
| PROMPT_ENGINEERING.md | ✅ Complète | Février 2026 |
| DEPLOYMENT.md | ✅ Complète | Février 2026 |
| ENV_SETUP.md | ✅ Complète | Février 2026 |
| TROUBLESHOOTING.md | ✅ Complète | Février 2026 |
| GLOSSARY.md | ✅ Complète | Février 2026 |

---

## 🔄 Workflow de Contribution

### Pour mettre à jour la documentation :

1. **Identifier** le document concerné
2. **Modifier** en suivant les conventions Markdown
3. **Mettre à jour** le status dans ce README
4. **Commit** avec message : `docs: update [nom-du-document]`

### Conventions de rédaction :

- Utiliser des emojis pour les sections : 📋 🎯 ✅ ❌
- Inclure des exemples de code pour tous les guides techniques
- Maintenir la table des matières à jour
- Utiliser des tableaux pour les références rapides

---

## 📞 Support

En cas de questions :
1. Consulter d'abord [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Vérifier les [ADR](./adr/) pour les décisions architecturales
3. Contacter l'équipe via le canal de communication du projet

---

**Version** : 1.0  
**Dernière mise à jour** : Février 2026  
**Projet** : Smart Finder PFE
