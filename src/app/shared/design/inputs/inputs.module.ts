import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { TextfieldComponent } from './textfield/textfield.component';



@NgModule({
  declarations: [SearchBarComponent,InputComponent, TextfieldComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SearchBarComponent,InputComponent,TextfieldComponent]
})
export class InputsModule { }
