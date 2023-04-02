import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoisirsPageComponent } from './loisirs-page.component';
import { LoisirsPageRoutingModule } from './loisirs-page-routing.module';




@NgModule({
  declarations: [
    LoisirsPageComponent,
  ],
  imports: [
    BrowserModule,
    LoisirsPageRoutingModule,
  ]
})
export class LoisirsPageModule { }
