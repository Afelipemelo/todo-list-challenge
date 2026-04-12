import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'category-management',
    loadComponent: () => import('./pages/category-management/category-management.page').then( m => m.CategoryManagementPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];

