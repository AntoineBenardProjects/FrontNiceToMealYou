import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { User } from '../model/user';
import { DatabaseService } from '../services/database.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, private dataService: DatabaseService,private bottomSheet: MatBottomSheet,) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      login : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  create(){
    const newUser: User = {
      id: "",
      login: this.formGroup.value.login,
      password: this.formGroup.value.password,
      role: "User",
      img: ""
    }

    this.dataService.signup(newUser).subscribe(res => {
      this.formGroup.setValue({
        nom: "",
        prenom: ""
      });
      if(res.error){
        this.bottomSheet.open(MessageComponent, {data: res.message});
        setTimeout(() => {
          this.bottomSheet.dismiss();
        }, 1500);
      }

      
    });
  }

}
