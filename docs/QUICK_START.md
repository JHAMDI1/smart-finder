# 🚀 Quick Start - Smart Finder

> Guide de démarrage rapide pour développeurs

---

## 📋 Prérequis

### Logiciels Requis

| Logiciel | Version | Lien |
|----------|---------|------|
| Node.js | 18+ | [Télécharger](https://nodejs.org/) |
| Java JDK | 17+ | [Télécharger](https://adoptium.net/) |
| MySQL | 8.0+ | [Télécharger](https://dev.mysql.com/) |
| Git | Dernière | [Télécharger](https://git-scm.com/) |

### IDE Recommandés

- **Backend** : IntelliJ IDEA (Ultimate ou Community)
- **Frontend** : VS Code avec extensions Angular

---

## 🎯 Installation en 5 Minutes

### Étape 1 : Cloner le Repository

```bash
git clone https://github.com/votre-org/smart-finder.git
cd smart-finder
```

### Étape 2 : Configurer la Base de Données

```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE smartfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Créer un utilisateur (optionnel mais recommandé)
mysql -u root -p -e "CREATE USER 'smartfinder'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON smartfinder.* TO 'smartfinder'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Étape 3 : Démarrer le Backend

```bash
cd smart-finder-backend

# Vérifier Java
java -version  # Doit afficher Java 17+

# Compiler et lancer
./mvnw clean install
./mvnw spring-boot:run

# L'API est disponible sur http://localhost:8080
```

### Étape 4 : Démarrer le Frontend

```bash
cd smart-finder-frontend

# Vérifier Node
node --version  # Doit afficher v18+
npm --version

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# L'application est disponible sur http://localhost:4200
```

### Étape 5 : Vérifier l'Installation

```bash
# Test API
curl http://localhost:8080/api/v1/criteres

# Test Frontend
open http://localhost:4200
```

---

## 🔧 Configuration

### Backend - `application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smartfinder?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: smartfinder
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

jwt:
  secret: votre-secret-key-super-securise-de-32-caracteres
  expiration: 86400000  # 24 heures

openai:
  api-key: sk-votre-cle-api-openai
```

### Frontend - `environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  appName: 'Smart Finder'
};
```

---

## 🎬 Scénarios de Test Rapide

### 1. Créer un Critère (Admin)

```bash
curl -X POST http://localhost:8080/api/v1/criteres \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "wifi",
    "description": "Wifi gratuit et stable",
    "categorie": "CONNECTIVITE",
    "icon": "wifi"
  }'
```

### 2. S'inscrire

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nom": "Test",
    "prenom": "User",
    "role": "USER"
  }'
```

### 3. Se Connecter

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Créer un Lieu (avec token)

```bash
curl -X POST http://localhost:8080/api/v1/lieux \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "nom": "Café Test",
    "adresse": "123 Rue Test, Paris",
    "description": "Un café sympa",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "critereIds": [1]
  }'
```

---

## 🐛 Dépannage Rapide

### Problème : Port 8080 déjà utilisé

```bash
# Trouver et tuer le processus
lsof -i :8080
kill -9 <PID>

# Ou changer le port
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Problème : MySQL refuse la connexion

```bash
# Vérifier MySQL
sudo systemctl status mysql

# Redémarrer
sudo systemctl restart mysql

# Vérifier les credentials
cat ~/.mysql_history
```

### Problème : npm install échoue

```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### Problème : CORS errors

Vérifier que le backend a la configuration CORS correcte :
- Origines autorisées doivent inclure `http://localhost:4200`
- Voir [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) section CORS

---

## 📚 Prochaines Étapes

1. **[Lire ARCHITECTURE.md](./ARCHITECTURE.md)** - Comprendre le système
2. **[Lire BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Développer le backend
3. **[Lire FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Développer le frontend
4. **[Consulter API_REFERENCE.md](./API_REFERENCE.md)** - Intégrer les API

---

## 🎯 Checklist de Vérification

- [ ] Node.js 18+ installé
- [ ] Java 17+ installé
- [ ] MySQL 8.0+ installé et running
- [ ] Base de données `smartfinder` créée
- [ ] Backend démarre sur port 8080
- [ ] Frontend démarre sur port 4200
- [ ] API répond correctement (test avec curl)
- [ ] Frontend communique avec backend (pas d'erreur CORS)

---

## 💡 Astuces

### Accès rapide aux logs

```bash
# Backend
tail -f smart-finder-backend/logs/application.log

# Frontend
# Les logs s'affichent dans le terminal ng serve
```

### Rebuild rapide

```bash
# Backend (hot reload activé par défaut)
./mvnw spring-boot:run

# Frontend (hot reload automatique)
ng serve
```

### Base de données - Reset

```bash
# Drop et recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS smartfinder; CREATE DATABASE smartfinder;"

# Relancer le backend pour recréer les tables
./mvnw spring-boot:run
```

---

**Durée estimée** : 15 minutes  
**Difficulté** : Facile  
**Support** : Voir [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
