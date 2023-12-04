import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserPageComponent } from './user-page.component';
import { UserPageRoutingModule } from './user-page-routing.module';
import { InputsModule } from '../shared/design/inputs/inputs.module';
import { SelectsModule } from '../shared/design/selects/selects.module';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';
import { CardModule } from '../cards/card.module';
import { LoadingModule } from '../loading/loading.module';


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
    LoadingModule,
    CardModule,
    ButtonsModule
  ]
})
export class UserPageModule {}
