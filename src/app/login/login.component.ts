import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { MessageComponent } from '../message/message.component';
import { Message } from '../model/message';
import { ButtonInfos } from '../shared/model/designs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('error', [
      state('show', style({
        height: 'calc(2vh + 20px)'
      })),
      state('hidden', style({
        height: '0'
      })),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
  ]
})
export class LoginComponent implements OnInit {

  constructor( 
    private dataService: DatabaseService, 
    private router: Router,
    private auth: AuthService) { }

    protected signupButtonColor: ButtonInfos = {
      color: 'var(--white)',
      borderColor: 'var(--white)',
      borderColorActive: 'var(--white)',
      colorActive: 'var(--black)',
      backgroundColorActive: 'var(--white)'
    }
    protected connexionButtonColor: ButtonInfos = {
      color: 'var(--black)',
      borderColor: 'var(--black)',
      borderColorActive: 'var(--black)',
      colorActive: 'var(--white)',
      backgroundColorActive: 'var(--black)'
    }
    protected userInfos: User = {
      id: "",
      login: "",
      password: "",
      role: "User",
      img: ""
    };
    protected validName: boolean = false;
    protected validPassword: boolean = false;
    protected message: string = "";
    protected showMessage: string="hidden";
    protected valid: boolean = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.auth.isAuthenticated();
    },1);
  }

  setValue(event: any, params: string){
    if(params === 'Login')  this.userInfos.login = event.target.value;
    else if(params === 'Password')  this.userInfos.password = event.target.value;
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }

  connexion(){
    const userInfo: User = {
      id: "",
      login: this.userInfos.login,
      password: this.userInfos.password,
      role:"",
      img: ""
    }
    this.dataService.login(userInfo).subscribe((navigate: Message) => {
      if(!navigate.error){
        this.router.navigate(['/home']);
      }
      else{
        this.message = navigate.message;
        this.showMessage = "show";
        setTimeout(() => {
          this.showMessage = "hidden";
        },2000);
      }
    })
  }

}
