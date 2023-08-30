import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AddComponent } from './add.component';
import { AddRoutingModule } from './add-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';





@NgModule({
  declarations: [
    AddComponent,
  ],
  imports: [
    BrowserModule,
    AddRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputsModule,
    SelectsModule,
    FontAwesomeModule,
    GoogleMapsModule,
    ButtonsModule
  ],
  exports: [
    AddComponent
  ]
})
export class AddModule { }
