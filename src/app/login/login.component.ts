import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MessageComponent } from '../message/message.component';
import { Message } from '../model/message';
import { ButtonInfos } from '../shared/model/designs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, 
    private dataService: DatabaseService, 
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private auth: AuthService) { }

  protected buttonColor: ButtonInfos = {
    color: 'var(--black)',
    colorActive: 'var(--white)',
    backgroundColorActive: 'var(--black)'
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.auth.isAuthenticated();
    },1)
    this.formGroup = this._formBuilder.group({
      login : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  connect(){
    const userInfo: User = {
      id: "",
      login: this.formGroup.value.login,
      password: this.formGroup.value.password,
      role:"",
      img: ""
    }
    this.dataService.login(userInfo).subscribe((navigate: Message) => {
      if(!navigate.error){
        this.router.navigate(['/home']);
      }
      else{
        this.bottomSheet.open(MessageComponent, {data: navigate.message});
        setTimeout(() => {
          this.bottomSheet.dismiss();
        }, 1500);
      }
    })
  }

}
