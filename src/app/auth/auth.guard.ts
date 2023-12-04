import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      let response: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
      this.authService.isAuthenticated().subscribe((isLoggedIn: string) => {
        if(isLoggedIn !== "cancel"){
          response.next(true);
        }
        else{
          this.router.navigate(['/firstPage']);
          response.next(false);
        }
      });
    return response;
  }
  
}
