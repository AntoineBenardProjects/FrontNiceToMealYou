import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PlaceCardComponent } from './place-card/place-card.component';
import { TypeCardComponent } from './type-card/type-card.component';
import { StationCardComponent } from './station-card/station-card.component';
import { ProgressBarModule } from '../shared/design/progress-bar/progress-bar.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { PlaceCardFaceComponent } from './place-card/place-card-face/place-card-face.component';
import { UserCardComponent } from './user-card/user-card.component';



@NgModule({
  declarations: [
    PlaceCardComponent,
    TypeCardComponent,
    StationCardComponent,
    PlaceCardFaceComponent,
    UserCardComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    ButtonsModule,
    ProgressBarModule
  ],
  exports: [
    TypeCardComponent,
    PlaceCardComponent,
    StationCardComponent,
    UserCardComponent
  ]
})
export class CardModule { }
