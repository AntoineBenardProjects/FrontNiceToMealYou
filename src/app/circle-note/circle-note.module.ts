import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatListModule } from '@angular/material/list';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CircleNoteComponent } from './circle-note.component';


@NgModule({
  declarations: [
    CircleNoteComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgCircleProgressModule.forRoot({}),
    MatTooltipModule,
    MatListModule,
    FormsModule,
    ShowHorairesModule
  ],
  exports: [
    CircleNoteComponent
  ]
})
export class CircleNoteModule { }
