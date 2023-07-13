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
import { CardComponent } from './card.component';
import { CardRoutingModule } from './card-routing.module';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ProgressBarModule } from '../shared/design/progress-bar/progress-bar.module';



@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    FontAwesomeModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgCircleProgressModule.forRoot({}),
    MatTooltipModule,
    MatListModule,
    FormsModule,
    ShowHorairesModule,
    ProgressBarModule,
    CardRoutingModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
