import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';





@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AboutRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ButtonsModule
  ]
})
export class AboutModule { }
