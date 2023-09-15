import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Message } from '../model/message';
import { PlacesService } from '../services/places.service';
import { User } from '../model/user';
import { InputInfos, SelectInfos, ButtonInfos } from '../shared/model/designs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  constructor(private data: DatabaseService,
    private place: PlacesService
    ){}

  private id: string = localStorage.getItem("id");
  protected img: string = localStorage.getItem("img");
  protected login: string = localStorage.getItem("login");
  private selected: string[] = [];
  protected userForm: UserForm = {
    login: "",
    newLogin: "",
    password: "",
    newPassword: ""
  }

  protected backgroundColor: string = 'var(--white)';
  protected normalInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--black)",
    backgroundColor: "var(--white)",
    borderColor: "var(--black)",
    borderColorActive: "var(--black)",
    hoverBackgroundColor: "var(--black)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--black)",
  }
  protected validInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--thirdColor)",
    backgroundColor: "var(--white)",
    borderColor: "var(--thirdColor)",
    borderColorActive: "var(--thirdColor)",
    hoverBackgroundColor: "var(--thirdColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--thirdColor)",
  }
  protected invalidInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--secondColor)",
    backgroundColor: "var(--white)",
    borderColor: "var(--secondColor)",
    borderColorActive: "var(--secondColor)",
    hoverBackgroundColor: "var(--secondColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--secondColor)",
  }
  protected validSelectInfos: SelectInfos = {
    backgroundColor: 'var(--white)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--white)',
    optionBackgroundColor: 'var(--black)',
    hoverBackgroundColor: 'var(--thirdColor)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--thirdColor)',
    width: 10,
    topHoverBackgroundColor: "var(--thirdColor)",
    topHoverColor: "var(--white)",
    topHoverBorderColor: "var(--thirdColor)"
  }
  protected invalidSelectInfos: SelectInfos = {
    backgroundColor: 'var(--white)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--white)',
    optionBackgroundColor: 'var(--black)',
    hoverBackgroundColor: 'var(--secondColor)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--secondColor)',
    width: 10,
    topHoverBackgroundColor: "var(--secondColor)",
    topHoverColor: "var(--white)",
    topHoverBorderColor: "var(--secondColor)"
  }
  protected validButton: ButtonInfos = {
    color: 'var(--white)',
    colorActive: 'var(--thirdColor)',
    backgroundColor: 'var(--thirdColor)',
    backgroundColorActive: 'var(--white)',
    fontWeight: 1000
  }
  protected invalidButton: ButtonInfos = {
    color: 'var(--white)',
    colorActive: 'var(--secondColor)',
    backgroundColor: 'var(--secondColor)',
    backgroundColorActive: 'var(--white)',
    fontWeight: 1000
  }
  protected uploadButtonInfos: ButtonInfos = {
    color: 'var(--white)',
    backgroundColor: 'var(--black)'
  }
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected errorMessage: string = "";
  protected showError: boolean = false;
  protected error: boolean = false;

  ngOnInit(){}

  setValue(event: any, params: string){
    if(params === 'login'){
      this.userForm.newLogin = event.target.value;
      this.checkLogin();
    }
    else if(params === 'password'){
      this.userForm.password = event.target.value;
      this.checkPassword();
    }
    else if(params === 'newPassword'){
      this.userForm.newPassword = event.target.value;
      this.checkPassword();
    }
  }

  removeImg(){
    this.data.setImage(this.id, "").subscribe((res:Message) => {
      if(!res.error){
        this.img = "";
        localStorage.setItem("img", "");
      }
    });
  }

  getFile(event: string){
    if(event.length != null){
      this.data.setImage(this.id, event).subscribe((res:Message) => {
        if(!res.error){
          this.img = event;
          localStorage.setItem("img", event);
        }
      });
    }
  }

  test(e: any){
    console.log(e);
  }

  protected passwordChecked: boolean = false;
  checkPassword(){
    const user: User = {
      id: this.id,
      password: this.userForm.password,
      login: this.login,
      role: '',
      img: ""
    }
    let checkPassword: Subject<boolean> = new Subject();

    checkPassword.subscribe((check: boolean) => {
      if(check){
        if(this.userForm.newPassword.length > 3)  this.passwordChecked = true;
        else{
          this.passwordChecked = false;
          this.errorMessage = "Mot de passe trop court";
        }
      } else{
        this.passwordChecked = false;
        this.errorMessage = "Veuillez donner l'ancien mot de passe";
      }
    });
    this.data.checkPassword(user).subscribe((res: Message) => {
      if(!res.error){
        checkPassword.next(true);
      } else{
        checkPassword.next(false);
      }
    });
  }

  protected loginChecked: boolean = false;
  checkLogin(){
    let checkLogin: Subject<boolean> = new Subject();
    checkLogin.subscribe((check: boolean) => {
      console.log(check);
      if(check){
        if(this.userForm.newLogin.length > 2)  this.loginChecked = true;
        else{
          this.loginChecked = false;
        }
      } else{
        this.loginChecked = false;
      }
    });
    this.data.getValidName(this.userForm.newLogin).subscribe((res: boolean) => {
      checkLogin.next(res);
    });
  }

  setLogin(){
    if(this.loginChecked){
      this.data.setLogin(this.id,this.userForm.login).subscribe(() => {
        localStorage.setItem("login",this.userForm.login);
        this.login = this.userForm.login;
      });
      this.error = false;
      this.errorMessage = "Login modifié";
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    } else{
      this.userForm.newLogin.length > 2 ? this.errorMessage = "Ce login est déjà pris" : this.errorMessage = "Le login doit faire plus de 2 caractères";
      this.error = true;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
    }
    
  }

  setPassword(){
    if(this.passwordChecked){
      this.data.setPassword(this.id,this.userForm.newPassword);
      this.error = false;
      this.errorMessage = "Mot de passe modifié";
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    } else{
      if(this.userForm.newPassword.length > 3){
        this.userForm.password.length === 0 ? this.errorMessage = "Veuillez donner l'ancien mot de passe" : this.errorMessage = "Le mot de passe est incorrect";
      } else this.errorMessage = "Le mot de passe doit faire plus de 3 caractères";
      this.error = true;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }

  select(element: any){
    let indexToSuppress = null;
    this.selected.forEach((station,index) => {
      if(station === element) indexToSuppress = index;
    });
    if(indexToSuppress != null) this.selected.splice(indexToSuppress,1);
    else  this.selected.push(element);
  }
}

interface UserForm{
  login: string,
  newLogin: string,
  password: string,
  newPassword: string
}