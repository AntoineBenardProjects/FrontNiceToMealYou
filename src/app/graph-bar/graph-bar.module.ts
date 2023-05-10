import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GraphBarComponent } from './graph-bar.component';


@NgModule({
  declarations: [
    GraphBarComponent
  ],
  imports: [
    BrowserModule,
    MatTooltipModule,
  ],
  exports: [
    GraphBarComponent
  ]
})

export class GraphBarModule {}
