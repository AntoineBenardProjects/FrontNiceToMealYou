import { Component } from '@angular/core';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';
import { DatabaseService } from '../services/database.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Message } from '../model/message';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MessageComponent } from '../message/message.component';
import { PlacesService } from '../services/places.service';
import { User } from '../model/user';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  constructor(private data: DatabaseService,
    private _formBuilder: UntypedFormBuilder, 
    private bottomSheet: MatBottomSheet,
    private place: PlacesService
    ){}

  loginForm: UntypedFormGroup = new UntypedFormGroup({});
  passwordForm: UntypedFormGroup = new UntypedFormGroup({});

  public id: string = localStorage.getItem("id");
  public img: string = localStorage.getItem("img");
  public login: string = localStorage.getItem("login");
  public cardParams: CardParams[] = [];
  public circleNoteParams: CircleNoteParams;
  public selected: string[] = [];
  public searchTerm: string = "";


  ngOnInit(){
    this.loginForm = this._formBuilder.group({
      oldLogin : ['', [this.validateOldLogin.bind(this)]],
      newLogin: ['']
    });
    this.passwordForm = this._formBuilder.group({
      oldPassword : [''],
      newPassword: [''],
      retypeNewpassword: ['', [this.validateRetypePassword.bind(this)]]
    });
  }

  validateOldLogin(control: AbstractControl){
    if (control.value.length > 0 && control.value !==  this.login) {
      return { invalidLogin: true };
    }
    return null;
  }

  getFile(event: any){
    if(event != null){
      const user: User = {
        id: this.id,
        img: event.img,
        password: "",
        role: "",
        login: ""
      }
      const file = event.infos;
      console.log(event.infos)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        console.error('File should be a png or a jpeg');
      } else if (file.size > 2e+6) {
        console.error('File is too large. Over 2MB');
      } else {
        console.log('File is valid');
      }
      this.data.setImage(user).subscribe((res:Message) => {
        if(!res.error){
          this.img = event.img;
          localStorage.setItem("img", event.img);
          this.data.setImage(user).subscribe((token: any) => {
            this.place.setImageChange();
          });
        }
      });
    }
  }

  test(e: any){
    console.log(e);
  }

  validateRetypePassword(control: AbstractControl){
    if(control.value !== this.passwordForm.value.newPassword){
      return { notSamePassword: true };
    }
    return null;
  }

  setLogin(){
    const user: User = {
      id: this.id,
      role: localStorage.getItem("role"),
      password: "",
      login: this.loginForm.value.newLogin,
      img: this.img
    }
    this.data.setLogin(user).subscribe(() => {
      localStorage.setItem("login",user.login);
      this.login = user.login;
    });
  }

  setPassword(){
    const user: User = {
      id: this.id,
      role: localStorage.getItem("role"),
      password: this.passwordForm.value.oldPassword,
      login: this.login,
      img: this.img
    }
    this.data.checkPassword(user).subscribe((res: Message) => {
      if(!res.error) {
        user.password = this.passwordForm.value.newPassword;
        this.data.setPassword(user);
      }
      else{
        this.bottomSheet.open(MessageComponent, {data: res.message});
        setTimeout(() => {
          this.bottomSheet.dismiss();
        }, 1500)
      }
    });
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
