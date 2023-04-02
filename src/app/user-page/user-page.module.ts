import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CircleNoteModule } from '../circle-note/circle-note.module';
import { CardModule } from '../card/card.module';
import { UserPageComponent } from './user-page.component';
import { UserPageRoutingModule } from './user-page-routing.module';


@NgModule({
  declarations: [
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    UserPageRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    NgCircleProgressModule.forRoot({}),
    MatListModule,
    MatTooltipModule,
    ShowHorairesModule,
    CircleNoteModule,
    CardModule
  ]
})
export class UserPageModule {
  constructor(library: FaIconLibrary){
    library.addIcons(
      faSquare,
      faCheckSquare,
    );
  }
}
