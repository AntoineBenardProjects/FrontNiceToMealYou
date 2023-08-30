import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ShowedModule } from './showed/showed.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddModule } from './add/add.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PlacesService } from './services/places.service';
import { StorageService } from './services/storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoisirsPageModule } from './loisirs-page/loisirs-page.module';
import { EditModule } from './edit/edit.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { LogoutModule } from './logout/logout.module';
import { FooterComponent } from './footer/footer.component';
import { UserPageModule } from './user-page/user-page.module';
import { ThemeService } from './services/theme.service';
import { NavbarModule } from './navbar/navbar.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { FilterPageModule } from './filter-page/filter-page.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    HomeModule,
    FilterPageModule,
    EditModule,
    ShowedModule,
    LoisirsPageModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    AddModule,
    MatDialogModule,
    FontAwesomeModule,
    LoginModule,
    RegisterModule,
    LogoutModule,
    UserPageModule,
    GoogleMapsModule
  ],
  providers: [PlacesService, StorageService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
