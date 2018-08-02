import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Check loggin in')
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn:boolean) => {
        if (!isLoggedIn){
          // not logged in so redirect to login page with the return url and return false
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
          return false
        }
        return true
      })
    )
  }
}
