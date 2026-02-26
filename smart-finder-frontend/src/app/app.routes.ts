import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth.guard';
import { ownerGuard } from './shared/guards/owner.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/lieux',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [publicGuard],
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
    path: 'smart-search',
    loadComponent: () => import('./smart-search/components/smart-search/smart-search.component').then(m => m.SmartSearchComponent)
  },
  {
    path: 'owner/dashboard',
    canActivate: [authGuard, ownerGuard],
    loadComponent: () => import('./owner/components/owner-dashboard/owner-dashboard').then(m => m.OwnerDashboard)
  },
  {
    path: 'owner/lieux/nouveau',
    canActivate: [authGuard, ownerGuard],
    loadComponent: () => import('./owner/components/lieu-form/lieu-form').then(m => m.LieuForm)
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: '**',
    redirectTo: '/lieux'
  }
];
