import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/lieux', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'lieux', 
    loadComponent: () => import('./lieu/components/lieu-list/lieu-list.component').then(m => m.LieuListComponent)
  },
  { 
    path: 'lieux/:id', 
    loadComponent: () => import('./lieu/components/lieu-detail/lieu-detail.component').then(m => m.LieuDetailComponent)
  },
  { 
    path: '**', 
    redirectTo: '/lieux' 
  }
];
