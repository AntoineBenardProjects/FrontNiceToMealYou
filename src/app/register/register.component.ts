import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { User } from '../model/users';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, private dataService: DatabaseService) { }

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
      // if(!res.error){
      //   this.formGroup.setValue({
      //     nom: "",
      //     prenom: ""
      //   });
      // }

      // this.bottomSheet.open(SuccessMessageComponent, {
      //   data: res.message,
      //   panelClass: "custom-width"
      // });
      // setTimeout(() => {
      //   this.bottomSheet.dismiss();
      // }, 1000);
    });
  }

}
