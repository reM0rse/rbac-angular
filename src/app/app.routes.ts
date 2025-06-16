import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { FullLayout } from './layout/full-layout/full-layout';
import { BlankLayout } from './layout/blank-layout/blank-layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/full-layout/full-layout').then((m) => m.FullLayout),
    children: [
      {
        path: 'user-management',
        loadComponent: () =>
          import('./features/user-management/user-management').then(
            (m) => m.UserManagement
          ),
      },
      {
        path: 'role-management',
        loadComponent: () =>
          import('./features/role-management/role-management').then(
            (m) => m.RoleManagement
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
];
