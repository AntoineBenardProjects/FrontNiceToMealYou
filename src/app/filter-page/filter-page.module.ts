import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CardModule } from '../card/card.module';
import { NavbarModule } from '../navbar/navbar.module';
import { LoadingModule } from '../loading/loading.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FilterPageComponent } from './filter-page.component';
import { FilterPageRoutingModule } from './filter-page-routing.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { GoogleMapsModule } from '@angular/google-maps';




@NgModule({
  declarations: [
    FilterPageComponent,
  ],
  imports: [
    BrowserModule,
    NavbarModule,
    SelectsModule,
    ButtonsModule,
    GoogleMapsModule,
    FilterPageRoutingModule
  ]
})
export class FilterPageModule { }
