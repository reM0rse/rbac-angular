import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { FullLayout } from './layout/full-layout/full-layout';
import { BlankLayout } from './layout/blank-layout/blank-layout';
import { Permission, Role } from './shared/utils/enum';
import { AuthGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission.guard';

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
        canActivate: [permissionGuard],
        data: { permission: Permission.view_user },
      },
      {
        path: 'role-management',
        loadComponent: () =>
          import('./features/role-management/role-management').then(
            (m) => m.RoleManagement
          ),
        canActivate: [AuthGuard],
        data: { role: Role.SuperAdmin},
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
