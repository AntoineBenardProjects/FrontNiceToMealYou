import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';





@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AdminRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputsModule,
    SelectsModule,
    FontAwesomeModule,
    GoogleMapsModule,
    ButtonsModule
  ]
})
export class AdminModule { }
