# Guide de Déploiement - Smart Finder

## 📋 Prérequis

- Compte Render (backend)
- Compte Vercel (frontend)
- Compte MySQL (Railway, PlanetScale, ou autre)
- Clé API OpenAI

---

## 🚀 Déploiement Backend (Render)

### Étape 1 : Créer la base de données MySQL

Option A : **Railway MySQL**
1. Créer un compte sur railway.app
2. New Project → Provision MySQL
3. Copier la DATABASE_URL

Option B : **PlanetScale**
1. Créer un compte sur planetscale.com
2. Créer une base de données
3. Créer un utilisateur et mot de passe

### Étape 2 : Déployer sur Render

1. Connecter son compte GitHub à Render
2. New Web Service → Choisir le repository
3. Configuration :
   - **Name** : smart-finder-backend
   - **Environment** : Java
   - **Build Command** : `./mvnw clean package -DskipTests`
   - **Start Command** : `java -jar target/smart-finder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

4. Variables d'environnement :
   ```
   MYSQL_URL=jdbc:mysql://host:3306/smartfinder
   MYSQL_USER=username
   MYSQL_PASSWORD=password
   JWT_SECRET=votre-secret-jwt-long-et-securise
   OPENAI_API_KEY=sk-votre-cle-openai
   CORS_ORIGINS=https://smart-finder-frontend.vercel.app
   ```

5. Cliquer sur **Create Web Service**

### Étape 3 : Vérifier le déploiement

- URL Render : `https://smart-finder-backend.onrender.com`
- Swagger UI : `https://smart-finder-backend.onrender.com/swagger-ui.html`

---

## 🎨 Déploiement Frontend (Vercel)

### Étape 1 : Configurer l'environnement de production

Modifier `src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://smart-finder-backend.onrender.com/api/v1'
};
```

### Étape 2 : Déployer sur Vercel

Option A : **Vercel CLI**
```bash
cd smart-finder-frontend
npm i -g vercel
vercel --prod
```

Option B : **GitHub Integration**
1. Connecter son compte GitHub à Vercel
2. Import Project → Choisir le repository
3. Configuration :
   - **Framework Preset** : Angular
   - **Build Command** : `ng build --configuration production`
   - **Output Directory** : `dist/smart-finder-frontend/browser`

4. Variables d'environnement (si nécessaire) :
   ```
   NG_CLI_ANALYTICS=false
   ```

5. Cliquer sur **Deploy**

### Étape 3 : Vérifier le déploiement

- URL Vercel : `https://smart-finder-frontend.vercel.app`

---

## 🗄️ Migrations Flyway

Les migrations s'exécutent automatiquement au démarrage de l'application si `spring.flyway.enabled=true`.

Pour vérifier :
1. Se connecter à la base de données
2. Vérifier la table `flyway_schema_history`
3. Vérifier que les tables sont créées

---

## 🔧 Configuration CORS en Production

Dans `application-prod.properties` :
```properties
app.cors.allowed-origins=https://smart-finder-frontend.vercel.app
```

**IMPORTANT** : Jamais `*` avec `allowCredentials=true` !

---

## 📊 Vérification Post-Déploiement

### Test Backend
```bash
curl https://votre-backend.onrender.com/api/v1/lieux
curl https://votre-backend.onrender.com/api/v1/criteres
```

### Test Frontend
- Ouvrir l'URL Vercel
- Vérifier la liste des lieux
- Tester la recherche par filtres
- Tester le login
- Tester la recherche IA

---

## 🔄 Mise à jour après déploiement

### Backend
Render déploie automatiquement sur push sur `main`.

### Frontend
Vercel déploie automatiquement sur push sur `main`.

---

## 📝 URLs à noter

| Service | URL |
|---------|-----|
| Backend API | `https://smart-finder-backend.onrender.com` |
| Swagger UI | `https://smart-finder-backend.onrender.com/swagger-ui.html` |
| Frontend | `https://smart-finder-frontend.vercel.app` |

---

## 🆘 Dépannage

### Problème : CORS errors
**Solution** : Vérifier que `CORS_ORIGINS` contient l'URL exacte du frontend (avec https)

### Problème : Base de données inaccessible
**Solution** : Vérifier `MYSQL_URL`, `MYSQL_USER`, `MYSQL_PASSWORD`

### Problème : API OpenAI non fonctionnelle
**Solution** : Vérifier `OPENAI_API_KEY` et les crédits sur le compte OpenAI

### Problème : Frontend ne se connecte pas au backend
**Solution** : Vérifier `apiUrl` dans `environment.prod.ts`

---

## 🎯 Checklist de validation

- [ ] Backend déployé et accessible
- [ ] Base de données créée et peuplée
- [ ] Frontend déployé et accessible
- [ ] CORS configuré correctement
- [ ] Authentification JWT fonctionnelle
- [ ] Recherche par filtres fonctionnelle
- [ ] Recherche IA (Smart Search) fonctionnelle
- [ ] Swagger UI accessible
- [ ] URLs de production notées dans ce document

---

**Date de déploiement** : ___________

**Déployé par** : ___________
