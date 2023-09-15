import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserPageComponent } from './user-page.component';
import { UserPageRoutingModule } from './user-page-routing.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';


@NgModule({
  declarations: [
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    UserPageRoutingModule,
    FontAwesomeModule,
    InputsModule,
    SelectsModule,
    ButtonsModule
  ]
})
export class UserPageModule {}
