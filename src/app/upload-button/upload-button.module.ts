import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UploadButtonComponent } from './upload-button.component';



@NgModule({
  declarations: [
    UploadButtonComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    FontAwesomeModule,
    MatButtonModule,
  ],
  exports: [UploadButtonComponent]
})
export class UploadButtonModule {}
