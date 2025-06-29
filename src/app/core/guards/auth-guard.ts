import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { map, take } from 'rxjs/operators';
import { Role } from '../../shared/utils/enum';
import { SnackbarUtil } from '../utils/snackbar.util';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarUtil);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      if (requiredRole && user.role !== requiredRole) {
        snackbar.error('Access denied: Required role is ' + requiredRole + ' but user has ' + user.role);
        return false;
      }

      return true;
    })
  );
};
