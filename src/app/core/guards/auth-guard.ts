import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/authService';

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['roles'];
    let hasAccess = false;
    
    this.authService.currentUser.subscribe(user => {
      if (user && expectedRole.includes(user.roleId)) {
        hasAccess = true;
      }
    });

    if (hasAccess) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
