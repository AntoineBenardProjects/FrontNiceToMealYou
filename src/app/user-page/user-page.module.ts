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
import { CardModule } from '../card/card.module';
import { UserPageComponent } from './user-page.component';
import { UserPageRoutingModule } from './user-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NavbarModule } from '../navbar/navbar.module';
import { UploadButtonModule } from '../upload-button/upload-button.module';


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
    MatInputModule,
    MatButtonModule,
    NgCircleProgressModule.forRoot({}),
    MatListModule,
    MatTooltipModule,
    ShowHorairesModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    FormsModule,
    CardModule,
    UploadButtonModule
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
