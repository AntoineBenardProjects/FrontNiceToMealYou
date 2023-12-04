import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddModule } from './add/add.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PlacesService } from './services/places.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UserPageModule } from './user-page/user-page.module';
import { ThemeService } from './services/theme.service';
import { FilterPageModule } from './filter-page/filter-page.module';
import { FirstPageModule } from './first-page/first-page.module';
import { EditModule } from './edit/edit.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseService } from './services/database.service';
import { FollowModule } from './follow/follow.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    FilterPageModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    AddModule,
    MatDialogModule,
    FontAwesomeModule,
    LoginModule,
    RegisterModule,
    UserPageModule,
    EditModule,
    FirstPageModule,
    AdminModule,
    FollowModule
  ],
  providers: [PlacesService, ThemeService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
