import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundButtonComponent } from './round-button/round-button.component';
import { LinkCardComponent } from './link-card/link-card.component';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [RoundButtonComponent, LinkCardComponent,UploadButtonComponent, CheckboxComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [RoundButtonComponent, LinkCardComponent,UploadButtonComponent,CheckboxComponent]
})
export class ButtonsModule { }
