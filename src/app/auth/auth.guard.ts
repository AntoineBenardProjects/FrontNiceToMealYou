import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}
  
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      let response: Subject<boolean> = new Subject();
      const sub = this.authService.isAuthenticated();
      sub.subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn){
          response.next(true);
        } else {
          response.next(false);
          //this.router.navigate(['/login']);
        }
      });
    return response;
  }
  
}
