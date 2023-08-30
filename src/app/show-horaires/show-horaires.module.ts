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
import { ShowHorairesComponent } from './show-horaires.component';


@NgModule({
  declarations: [
    ShowHorairesComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    NgCircleProgressModule.forRoot({}),
    MatListModule,
    MatTooltipModule
  ],
  exports: [
    ShowHorairesComponent
  ]
})
export class ShowHorairesModule {
  constructor(library: FaIconLibrary){
    library.addIcons(
      faSquare,
      faCheckSquare,
    );
  }
}
