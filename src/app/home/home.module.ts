import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from '../cards/card.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingModule } from '../loading/loading.module';





@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    InputsModule,
    ButtonsModule,
    CardModule,
    LoadingModule,
    FontAwesomeModule
  ]
})
export class HomeModule { }
