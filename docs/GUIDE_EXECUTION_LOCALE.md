# Guide d'Exécution Locale - Smart Finder

Ce guide explique comment exécuter le projet Smart Finder sur votre machine locale.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### 1. Java 23
```bash
# Vérifier l'installation
java -version
# Doit afficher : openjdk version "23" ou supérieur
```

**Installation si non présent :**
- Windows : Télécharger sur [oracle.com](https://www.oracle.com/java/technologies/downloads/) ou utiliser [SDKMAN](https://sdkman.io/)
- Mac : `brew install openjdk@23`
- Linux : `sudo apt install openjdk-23-jdk`

### 2. Node.js 22
```bash
# Vérifier l'installation
node -v
# Doit afficher : v22.x.x
```

**Installation si non présent :**
- Télécharger sur [nodejs.org](https://nodejs.org/)
- Ou utiliser [nvm](https://github.com/nvm-sh/nvm) : `nvm install 22`

### 3. MySQL 9.1+
```bash
# Vérifier l'installation
mysql --version
# Doit afficher : mysql Ver 9.x
```

**Installation :**
- Windows : [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Mac : `brew install mysql@9`
- Linux : `sudo apt install mysql-server-9.0`

### 4. Angular CLI
```bash
npm install -g @angular/cli@19.1.5
ng version
```

### 5. Maven (optionnel, wrapper inclus)
```bash
# Vérifier (optionnel)
mvn -version
```

---

## 🗄️ Étape 1 : Configurer la Base de Données

### 1.1 Démarrer MySQL

**Windows (en tant qu'administrateur) :**
```powershell
net start MySQL90
```

**Mac/Linux :**
```bash
sudo systemctl start mysql
# ou
brew services start mysql
```

### 1.2 Créer la base de données

Connectez-vous à MySQL :
```bash
mysql -u root -p
```

Créez la base de données et l'utilisateur :
```sql
-- Créer la base de données
CREATE DATABASE smartfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer l'utilisateur
CREATE USER 'smartfinder'@'localhost' IDENTIFIED BY 'smartfinder123';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON smartfinder.* TO 'smartfinder'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Quitter
EXIT;
```

---

## 🔧 Étape 2 : Configurer le Backend

### 2.1 Naviguer vers le dossier backend

```bash
cd smart-finder-backend
```

### 2.2 Créer le fichier de configuration locale

Créez le fichier `src/main/resources/application-local.properties` :

```properties
# =====================================================
# Configuration Locale - Smart Finder Backend
# =====================================================

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smartfinder
spring.datasource.username=smartfinder
spring.datasource.password=smartfinder123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Flyway (migrations automatiques)
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# JWT Configuration
jwt.secret=smart-finder-secret-key-for-jwt-signing-must-be-at-least-32-characters
jwt.expiration=86400000

# OpenAI (Module IA - Phase 6)
# Remplacez par votre clé API OpenAI réelle
openai.api.key=sk-votre-cle-api-openai-ici
openai.model=gpt-4o-mini

# Server
server.port=8080

# Logging
logging.level.com.smartfinder=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# CORS (développement)
app.cors.allowed-origins=http://localhost:4200
```

**⚠️ Important :** Remplacez `sk-votre-cle-api-openai-ici` par votre vraie clé API OpenAI.

### 2.3 Compiler le projet

```bash
# Utiliser Maven Wrapper (recommandé)
./mvnw clean install

# Ou si Maven est installé globalement
mvn clean install
```

**Sur Windows PowerShell :**
```powershell
.\mvnw.cmd clean install
```

**Première compilation :** Cela peut prendre 5-10 minutes (téléchargement des dépendances).

---

## 🚀 Étape 3 : Démarrer le Backend

### Option A : Avec Maven (recommandé pour le développement)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

**Windows :**
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

### Option B : Avec le JAR compilé

```bash
cd target
java -jar smart-finder-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

### Vérifier que le backend fonctionne

1. **API Health Check :**
   ```
   http://localhost:8080/api/v1/lieux
   ```

2. **Swagger UI :**
   ```
   http://localhost:8080/swagger-ui.html
   ```

3. **Console logs :** Vous devriez voir :
   ```
   Started SmartFinderApplication in X.XXX seconds
   Flyway : Migrating schema `smartfinder`
   ```

---

## 🎨 Étape 4 : Configurer le Frontend

### 4.1 Naviguer vers le dossier frontend

```bash
cd smart-finder-frontend
```

### 4.2 Installer les dépendances

```bash
npm install
```

**Première installation :** Cela peut prendre 3-5 minutes.

### 4.3 Vérifier la configuration

Le fichier `src/environments/environment.ts` doit contenir :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

**Note :** Cette configuration est déjà en place dans le projet.

---

## 🖥️ Étape 5 : Démarrer le Frontend

### 5.1 Lancer le serveur de développement

```bash
ng serve
```

Ou :
```bash
npm start
```

### 5.2 Accéder à l'application

Ouvrez votre navigateur et allez à :
```
http://localhost:4200
```

**Note :** L'application redémarre automatiquement quand vous modifiez le code.

---

## 🧪 Étape 6 : Tester l'Application

### 6.1 Tester la recherche par filtres

1. Allez sur `http://localhost:4200/lieux`
2. Vous devriez voir la liste des espaces de coworking
3. Essayez les filtres (WiFi, Parking, etc.)

### 6.2 Tester l'authentification

1. Cliquez sur "Connexion" dans la navbar
2. Créez un compte ou connectez-vous avec :
   - Email : `user@example.com`
   - Mot de passe : (celui défini dans la BDD)

### 6.3 Tester le Concierge Virtuel (IA)

1. Allez sur `http://localhost:4200/smart-search`
2. Tapez : "Espace calme avec fibre pour travailler"
3. L'IA devrait extraire les critères et afficher les résultats

### 6.4 Vérifier la base de données

```bash
mysql -u smartfinder -p
```

```sql
USE smartfinder;
SELECT * FROM lieu;
SELECT * FROM critere;
SELECT * FROM utilisateur;
```

---

## 🛠️ Dépannage

### Problème 1 : "Port 8080 already in use"

**Solution :**
```bash
# Trouver le processus
lsof -i :8080
# ou Windows
netstat -ano | findstr :8080

# Tuer le processus
kill -9 <PID>
# ou Windows
taskkill /PID <PID> /F
```

Ou changez le port dans `application-local.properties` :
```properties
server.port=8081
```

### Problème 2 : "Access denied for user 'smartfinder'@'localhost'"

**Solution :**
```bash
mysql -u root -p
```

```sql
DROP USER IF EXISTS 'smartfinder'@'localhost';
CREATE USER 'smartfinder'@'localhost' IDENTIFIED BY 'smartfinder123';
GRANT ALL PRIVILEGES ON smartfinder.* TO 'smartfinder'@'localhost';
FLUSH PRIVILEGES;
```

### Problème 3 : "Cannot connect to MySQL"

**Solution :**
```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Redémarrer MySQL
sudo systemctl restart mysql
```

### Problème 4 : Erreur CORS

**Solution :** Vérifiez que le backend et frontend utilisent bien les ports 8080 et 4200.

### Problème 5 : Module IA ne fonctionne pas

**Solution :** Vérifiez votre clé API OpenAI dans `application-local.properties`.

Testez la clé :
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-votre-cle"
```

---

## 📝 Commandes Récapitulatives

### Démarrer tout (3 terminaux)

**Terminal 1 - MySQL :**
```bash
sudo systemctl start mysql
```

**Terminal 2 - Backend :**
```bash
cd smart-finder-backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

**Terminal 3 - Frontend :**
```bash
cd smart-finder-frontend
ng serve
```

### Arrêter tout

- **Backend :** `Ctrl+C` dans le terminal
- **Frontend :** `Ctrl+C` dans le terminal
- **MySQL :** `sudo systemctl stop mysql`

---

## 🎯 Checklist de Validation

- [ ] Java 23 installé et configuré
- [ ] Node.js 22 installé
- [ ] MySQL démarré et base "smartfinder" créée
- [ ] `application-local.properties` créé avec bonnes valeurs
- [ ] Backend compilé sans erreur (`./mvnw clean install`)
- [ ] Backend démarré sur `localhost:8080`
- [ ] Frontend dépendances installées (`npm install`)
- [ ] Frontend démarré sur `localhost:4200`
- [ ] Liste des lieux visible sur `http://localhost:4200/lieux`
- [ ] Connexion/Inscription fonctionne
- [ ] Recherche par filtres fonctionne
- [ ] Concierge Virtuel (IA) fonctionne (si clé API configurée)

---

## 📚 Ressources Utiles

- **Swagger UI (API Docs) :** http://localhost:8080/swagger-ui.html
- **H2 Console (si utilisé) :** http://localhost:8080/h2-console
- **Angular DevTools :** Extension Chrome/Firefox
- **MySQL Workbench :** GUI pour la base de données

---

Bonne exécution ! 🚀

En cas de problème, consultez la section **Dépannage** ou vérifiez les logs dans les terminaux.
