# 💻 Frontend Development Guide

Guide complet pour le développement du frontend Smart Finder avec Angular.

---

## 📋 Table des Matières

- [Structure du Projet](#structure-du-projet)
- [Configuration](#configuration)
- [Services](#services)
- [Components](#components)
- [Routing](#routing)
- [State Management](#state-management)
- [Responsive Design](#responsive-design)
- [Tests](#tests)

---

## 📁 Structure du Projet

```
smart-finder-frontend/
├── src/
│   ├── app/
│   │   ├── core/                          # Singletons, global
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── api.service.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                        # Composants réutilisables
│   │   │   ├── components/
│   │   │   │   ├── star-rating/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── error-message/
│   │   │   │   └── lieu-card/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                      # Modules par feature
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.scss
│   │   │   │   ├── register/
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── lieux/
│   │   │   │   ├── lieu-list/
│   │   │   │   ├── lieu-card/
│   │   │   │   ├── lieu-detail/
│   │   │   │   ├── lieu-filters/
│   │   │   │   ├── lieu.service.ts
│   │   │   │   ├── lieu.model.ts
│   │   │   │   └── lieux.module.ts
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── smart-search/
│   │   │   │   └── search.module.ts
│   │   │   │
│   │   │   └── admin/
│   │   │       └── admin.module.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── layout.module.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── styles.scss
│   ├── index.html
│   └── main.ts
│
├── angular.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ⚙️ Configuration

### package.json - Dépendances

```json
{
  "name": "smart-finder-frontend",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "lint": "ng lint"
  },
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@angular/material": "^17.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0",
    "tailwindcss": "^3.4.0",
    "lucide-angular": "^0.300.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "@types/jasmine": "~5.1.0",
    "autoprefixer": "^10.4.16",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "postcss": "^8.4.32",
    "typescript": "~5.2.0"
  }
}
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### styles.scss

```scss
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer base {
  body {
    @apply font-sans antialiased bg-gray-50;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 text-white rounded-lg 
           hover:bg-primary-700 transition-colors 
           focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg
           hover:bg-gray-50 transition-colors
           focus:outline-none focus:ring-2 focus:ring-gray-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 
           hover:shadow-md transition-shadow;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}
```

### angular.json - Configuration Build

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "smart-finder-frontend": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/smart-finder-frontend",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "smart-finder-frontend:build:production"
            },
            "development": {
              "buildTarget": "smart-finder-frontend:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

---

## 🔧 Services

### Auth Service

```typescript
// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'OWNER';
}
```

### Lieu Service

```typescript
// features/lieux/lieu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  noteMoyenne?: number;
  criteres: Critere[];
  createdAt: string;
}

export interface Critere {
  id: number;
  nom: string;
  description?: string;
  categorie: string;
  icon?: string;
}

export interface SearchRequest {
  critereIds?: number[];
  page?: number;
  size?: number;
}

export interface SearchResponse {
  content: Lieu[];
  totalElements: number;
  totalPages: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class LieuService {
  private readonly API_URL = `${environment.apiUrl}/lieux`;
  
  // State management with RxJS
  private lieuxSubject = new BehaviorSubject<Lieu[]>([]);
  lieux$ = this.lieuxSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  search(request: SearchRequest): Observable<SearchResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.post<SearchResponse>(
      `${this.API_URL}/search`, 
      request
    );
  }

  getById(id: number): Observable<Lieu> {
    return this.http.get<Lieu>(`${this.API_URL}/${id}`);
  }

  create(lieu: Partial<Lieu>): Observable<Lieu> {
    return this.http.post<Lieu>(this.API_URL, lieu);
  }

  update(id: number, lieu: Partial<Lieu>): Observable<Lieu> {
    return this.http.put<Lieu>(`${this.API_URL}/${id}`, lieu);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
```

### Smart Search Service

```typescript
// features/search/smart-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lieu } from '../lieux/lieu.service';

export interface SmartSearchRequest {
  query: string;
}

export interface SmartSearchResponse {
  query: string;
  understood: {
    tags: string[];
    tagIds: number[];
    explanation: string;
  };
  results: Lieu[];
  unknownCriteria: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SmartSearchService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  smartSearch(query: string): Observable<SmartSearchResponse> {
    return this.http.post<SmartSearchResponse>(
      `${this.API_URL}/smart-search`,
      { query }
    );
  }
}
```

---

## 🎨 Components

### Login Component

```typescript
// features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Échec de la connexion';
        this.loading = false;
      }
    });
  }
}
```

```html
<!-- features/auth/login/login.component.html -->
<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div class="w-full max-w-md">
    <div class="card p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Connexion</h1>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            type="email" 
            formControlName="email"
            class="input-field"
            placeholder="votre@email.com">
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
               class="text-red-500 text-sm mt-1">
            Email invalide
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input 
            type="password" 
            formControlName="password"
            class="input-field"
            placeholder="••••••">
        </div>

        <!-- Error message -->
        <div *ngIf="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit -->
        <button 
          type="submit" 
          [disabled]="loading"
          class="btn-primary w-full flex justify-center">
          <span *ngIf="!loading">Se connecter</span>
          <span *ngIf="loading">Connexion...</span>
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Pas de compte ? 
        <a routerLink="/register" class="text-primary-600 hover:underline">
          S'inscrire
        </a>
      </p>
    </div>
  </div>
</div>
```

### Lieu List Component

```typescript
// features/lieux/lieu-list/lieu-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Lieu, LieuService, SearchRequest } from '../lieu.service';

@Component({
  selector: 'app-lieu-list',
  templateUrl: './lieu-list.component.html',
  styleUrls: ['./lieu-list.component.scss']
})
export class LieuListComponent implements OnInit {
  lieux: Lieu[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  constructor(private lieuService: LieuService) {}

  ngOnInit(): void {
    this.loadLieux();
  }

  loadLieux(): void {
    const request: SearchRequest = {
      page: this.currentPage,
      size: this.pageSize
    };

    this.lieuService.search(request).subscribe({
      next: (response) => {
        this.lieux = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLieux();
  }
}
```

```html
<!-- features/lieux/lieu-list/lieu-list.component.html -->
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <app-header></app-header>

  <div class="container mx-auto px-4 py-6">
    <!-- Filters -->
    <app-lieu-filters 
      (search)="onSearch($event)"
      class="mb-6">
    </app-lieu-filters>

    <!-- Results count -->
    <p class="text-gray-600 mb-4">
      {{ totalElements }} lieu(x) trouvé(s)
    </p>

    <!-- Loading -->
    <div *ngIf="loading" class="flex justify-center py-12">
      <app-loading-spinner></app-loading-spinner>
    </div>

    <!-- Error -->
    <div *ngIf="error" class="text-center py-12">
      <app-error-message [message]="error"></app-error-message>
    </div>

    <!-- Results grid -->
    <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <app-lieu-card 
        *ngFor="let lieu of lieux" 
        [lieu]="lieu"
        (click)="navigateToDetail(lieu.id)">
      </app-lieu-card>
    </div>

    <!-- Pagination -->
    <div *ngIf="totalPages > 1" class="flex justify-center mt-8 space-x-2">
      <button 
        *ngFor="let page of [].constructor(totalPages); let i = index"
        (click)="onPageChange(i)"
        [class.bg-primary-600]="currentPage === i"
        [class.text-white]="currentPage === i"
        class="px-3 py-1 rounded border">
        {{ i + 1 }}
      </button>
    </div>
  </div>
</div>
```

### Smart Search Component

```typescript
// features/search/smart-search/smart-search.component.ts
import { Component } from '@angular/core';
import { SmartSearchService, SmartSearchResponse } from '../smart-search.service';

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent {
  query = '';
  loading = false;
  result: SmartSearchResponse | null = null;
  error: string | null = null;

  suggestions = [
    'Café calme pour travailler',
    'Bibliothèque ouverte le dimanche',
    'Espace avec wifi et prises'
  ];

  constructor(private smartSearchService: SmartSearchService) {}

  onSearch(): void {
    if (!this.query.trim()) return;

    this.loading = true;
    this.error = null;

    this.smartSearchService.smartSearch(this.query).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  useSuggestion(suggestion: string): void {
    this.query = suggestion;
    this.onSearch();
  }
}
```

---

## 🛡️ Routing & Guards

### App Routing Module

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/lieux/lieux.module')
      .then(m => m.LieuxModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'lieux',
    loadChildren: () => import('./features/lieux/lieux.module')
      .then(m => m.LieuxModule)
  },
  {
    path: 'smart-search',
    loadChildren: () => import('./features/search/search.module')
      .then(m => m.SearchModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### Auth Guard

```typescript
// core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}
```

---

## 🔌 Interceptors

### JWT Interceptor

```typescript
// core/interceptors/jwt.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)

```
sm: 640px   - Mobile landscape
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Large desktop
2xl: 1536px - Extra large
```

### Mobile-First Examples

```html
<!-- Card responsive -->
<div class="card p-4 md:p-6 lg:p-8">
  <h2 class="text-lg md:text-xl lg:text-2xl font-bold">Titre</h2>
  <p class="text-sm md:text-base text-gray-600">Description</p>
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <app-lieu-card *ngFor="let lieu of lieux" [lieu]="lieu"></app-lieu-card>
</div>

<!-- Navigation mobile -->
<nav class="fixed bottom-0 left-0 right-0 bg-white border-t md:relative md:border-t-0 md:bg-transparent">
  <!-- Mobile: bottom nav, Desktop: top nav -->
</nav>
```

---

## 🧪 Tests

### Component Test Example

```typescript
// lieu-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LieuListComponent } from './lieu-list.component';

describe('LieuListComponent', () => {
  let component: LieuListComponent;
  let fixture: ComponentFixture<LieuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LieuListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 📚 Next Steps

- [Backend Guide](../BACKEND_GUIDE.md) - API integration
- [Smart Search](../SMART_SEARCH.md) - IA module integration
- [Database Guide](../DATABASE.md) - Data models

---

**Version** : 1.0  
**Last Updated** : Février 2026
