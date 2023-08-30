import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';




@NgModule({
  declarations: [
    MessageModule,
  ],
  imports: [
    BrowserModule,
    MatBottomSheetModule,
  ]
})
export class MessageModule { }
