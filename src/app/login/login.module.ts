import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    InputsModule,
    ButtonsModule,
    BrowserModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatBottomSheetModule
  ]
})
export class LoginModule { }
