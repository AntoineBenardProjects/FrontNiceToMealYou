import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';



@Injectable({
  providedIn: 'root'
})

export class AuthService{
    
  constructor(private dataService: DatabaseService) { }

  isAuthenticated(){
    let isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    const token = localStorage.getItem("token");

    if(token != null){
      this.dataService.loginByToken(token).subscribe(res => {
        if(res) isLoggedIn.next(true);
        else  isLoggedIn.next(false);
      });
    } else{
      isLoggedIn.next(false);
    }
    return isLoggedIn.asObservable();
  }

}
