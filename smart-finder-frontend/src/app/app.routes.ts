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
    path: 'lieux', 
    loadComponent: () => import('./lieu/components/lieu-list/lieu-list.component').then(m => m.LieuListComponent)
  },
  { 
    path: '**', 
    redirectTo: '/lieux' 
  }
];
