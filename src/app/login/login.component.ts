import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/users';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(private _formBuilder: UntypedFormBuilder, private dataService: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem("token");
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
    this.dataService.login(userInfo).subscribe((navigate: boolean) => {
      if(navigate)  this.router.navigate(['/home']);
    })
  }

}
