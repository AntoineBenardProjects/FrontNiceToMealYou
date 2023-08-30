import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundSelectComponent } from './round-select/round-select.component';



@NgModule({
  declarations: [RoundSelectComponent],
  imports: [
    CommonModule
  ],
  exports: [RoundSelectComponent]
})
export class SelectsModule { }
