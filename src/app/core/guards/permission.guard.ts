import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarUtil } from '../utils/snackbar.util';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarUtil);
  const router = inject(Router);
  const requiredPermission = route.data['permission'];

  const currentUser = authService.currentUserValue;

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const hasPermission = currentUser.permissionIds?.includes(requiredPermission);

  if (!hasPermission) {
    snackbar.error('You do not have permission to access this page');
    return false;
  }

  return true;
}; 