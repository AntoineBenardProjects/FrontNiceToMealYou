import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/model/table/user';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Message } from '../shared/model/params/message';
import { ButtonInfos, InputInfos } from '../shared/model/designs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { connexionButtonColorLoginComponent, signupButtonColorLoginComponent } from '../shared/model/design/buttonsDesign';
import { inputInfosLoginComonent } from '../shared/model/design/inputsDesign';

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
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected signupButtonColor: ButtonInfos = signupButtonColorLoginComponent;
  protected connexionButtonColor: ButtonInfos = connexionButtonColorLoginComponent;
  protected inputInfos: InputInfos = inputInfosLoginComonent;
/*  Algo  */
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
  protected setValue(event: any, params: string): void{
    if(params === 'Login')  this.userInfos.login = event.target.value;
    else if(params === 'Password')  this.userInfos.password = event.target.value;
  }
  protected navigateToRegister(): void{
    this.router.navigate(['/register']);
  }
  protected connexion(): void{
    const userInfo: User = {
      id: "",
      login: this.userInfos.login,
      password: this.userInfos.password,
      role:"",
      img: ""
    }
    this.dataService.login(userInfo).subscribe((navigate: any) => {
      if(!navigate.error){
        localStorage.setItem("role",navigate.params.role);
        localStorage.setItem("id",navigate.params.id);
        localStorage.setItem("login",navigate.params.login);
        localStorage.setItem("token",navigate.token);
        this.dataService.getImage(navigate.params.id).subscribe((img: string) =>{
          localStorage.setItem("img",img);
          this.router.navigate(['/home']);
        });
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
