import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { map, take } from 'rxjs/operators';
import { SnackbarUtil } from '../utils/snackbar.util';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarUtil);
  const router = inject(Router);
  const requiredPermission = route.data['permission'];

  return authService.currentUser.pipe(
    take(1),
    map(user => {
        console.log(user, 'user is');
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      const hasPermission = user.permissionIds?.includes(requiredPermission);
      if (!hasPermission) {
        console.log('You do not have permission to access this page');
        snackbar.error('You do not have permission to access this page');
        return false;
      }

      return true;
    })
  );
}; 