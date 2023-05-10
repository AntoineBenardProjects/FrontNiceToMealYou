import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BarsPageComponent } from './bars-page.component';
import { BarsPageRoutingModule } from './bars-page-routing.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatListModule } from '@angular/material/list';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CardModule } from '../card/card.module';
import { NavbarModule } from '../navbar/navbar.module';
import { LoadingModule } from '../loading/loading.module';


@NgModule({
  declarations: [
    BarsPageComponent
  ],
  imports: [
    BrowserModule,
    BarsPageRoutingModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgCircleProgressModule.forRoot({}),
    MatTooltipModule,
    MatListModule,
    FormsModule,
    ShowHorairesModule,
    CardModule,
    LoadingModule,
    NavbarModule
  ]
})
export class BarsPageModule { }
