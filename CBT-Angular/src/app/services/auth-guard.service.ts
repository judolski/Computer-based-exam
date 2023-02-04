import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) { }

  canActivate(next:ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable <boolean> | boolean {
    if(!this.authService.isLoggedIn ) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
