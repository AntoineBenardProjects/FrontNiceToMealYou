import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { LogoutComponent } from './logout.component';




@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule
  ]
})
export class LogoutModule { }
