import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { FilterPageComponent } from './filter-page.component';
import { FilterPageRoutingModule } from './filter-page-routing.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { CardModule } from '../cards/card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { SelectPlaceModule } from '../select-place/select-place.module';
import { ProgressBarModule } from '../shared/design/progress-bar/progress-bar.module';




@NgModule({
  declarations: [
    FilterPageComponent,
  ],
  imports: [
    BrowserModule,
    SelectsModule,
    ButtonsModule,
    GoogleMapsModule,
    FilterPageRoutingModule,
    FontAwesomeModule,
    LeafletModule,
    InputsModule,
    SelectPlaceModule,
    ProgressBarModule,
    CardModule
  ]
})
export class FilterPageModule { }
