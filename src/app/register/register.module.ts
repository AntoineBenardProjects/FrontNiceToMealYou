import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { MessageModule } from '../message/message.module';
import { SelectsModule } from '../shared/design/selects/selects.module';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RegisterRoutingModule,
    ButtonsModule,
    InputsModule,
    SelectsModule,
    FormsModule,
    MessageModule
  ]
})
export class RegisterModule { }
