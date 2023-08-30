import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { DatabaseService } from './database.service';



@Injectable({
  providedIn: 'root'
})

export class AuthService{
    
  constructor(private dataService: DatabaseService) { }
  isAuthenticated(){
    const token = localStorage.getItem("token");
    let isLoggedIn: BehaviorSubject<string> = new BehaviorSubject<string>("ok");
    if(token != null){
      this.dataService.loginByToken(token).subscribe((res: any) => {
        if(res.error === undefined) isLoggedIn.next("ok");
        else {
          isLoggedIn.next("cancel");
        }
      });
    } else{
      isLoggedIn.next("cancel");
    }
    return isLoggedIn.asObservable();
  }

}
