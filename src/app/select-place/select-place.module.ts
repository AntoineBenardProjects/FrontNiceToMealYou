import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SelectPlaceComponent } from './select-place.component';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';




@NgModule({
  declarations: [
    SelectPlaceComponent,
  ],
  imports: [
    BrowserModule,
    SelectsModule,
    ButtonsModule,
    InputsModule
  ],
  exports: [SelectPlaceComponent]
})
export class SelectPlaceModule { }
