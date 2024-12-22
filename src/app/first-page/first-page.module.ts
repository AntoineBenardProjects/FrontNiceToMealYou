import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from '../cards/card.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FirstPageRoutingModule } from './first-page-routing.module';
import { FirstPageComponent } from './first-page.component';





@NgModule({
  declarations: [
    FirstPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FirstPageRoutingModule,
    BrowserAnimationsModule,
    InputsModule,
    ButtonsModule,
    CardModule,
    FontAwesomeModule
  ]
})
export class FirstPageModule { }
