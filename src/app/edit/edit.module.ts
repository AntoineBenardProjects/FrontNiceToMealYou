import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';
import { EditComponent } from './edit.component';
import { EditRoutingModule } from './edit-routing.module';
import { ProgressBarModule } from '../shared/design/progress-bar/progress-bar.module';





@NgModule({
  declarations: [
    EditComponent,
  ],
  imports: [
    BrowserModule,
    EditRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputsModule,
    SelectsModule,
    FontAwesomeModule,
    GoogleMapsModule,
    ProgressBarModule,
    ButtonsModule
  ]
})
export class EditModule { }
