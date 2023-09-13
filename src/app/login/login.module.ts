import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { MessageModule } from '../message/message.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    InputsModule,
    ButtonsModule,
    BrowserModule,
    LoginRoutingModule,
    MessageModule,
    FormsModule
  ]
})
export class LoginModule { }
