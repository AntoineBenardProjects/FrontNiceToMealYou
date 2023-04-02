import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RestaurantsPageComponent } from './restaurants-page.component';
import { RestaurantsPageRoutingModule } from './restaurants-page-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CardModule } from '../card/card.module';




@NgModule({
  declarations: [
    RestaurantsPageComponent,
  ],
  imports: [
    BrowserModule,
    RestaurantsPageRoutingModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    NgCircleProgressModule.forRoot({}),
    MatTooltipModule,
    ShowHorairesModule,
    FormsModule,
    CardModule
  ]
})
export class RestaurantsPageModule { }
