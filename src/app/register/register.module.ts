import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { MessageModule } from '../message/message.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { CardModule } from '../cards/card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RegisterRoutingModule,
    FontAwesomeModule,
    ButtonsModule,
    CardModule,
    InputsModule,
    SelectsModule,
    FormsModule,
    MessageModule
  ]
})
export class RegisterModule { }
