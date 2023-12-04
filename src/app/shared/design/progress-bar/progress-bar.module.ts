import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { RoundProgressBarComponent } from './round-progress-bar/round-progress-bar.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { RangeComponent } from './range/range.component';



@NgModule({
  declarations: [ProgressBarComponent, RoundProgressBarComponent, RangeSliderComponent, RangeComponent],
  imports: [
    CommonModule
  ],
  exports: [ProgressBarComponent, RoundProgressBarComponent, RangeSliderComponent, RangeComponent]
})
export class ProgressBarModule { }
