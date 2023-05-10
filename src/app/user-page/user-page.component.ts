import { Component } from '@angular/core';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';
import { Liked } from '../model/liked';
import { Restaurant } from '../model/restaurant';
import { Station } from '../model/station';
import { StationOfUser } from '../model/stationOfUser';
import { DatabaseService } from '../services/database.service';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../model/users';
import { Message } from '../model/message';
import { Observable, map } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MessageComponent } from '../message/message.component';
import { PlacesService } from '../services/places.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  constructor(private data: DatabaseService,
    private _formBuilder: UntypedFormBuilder, 
    private bottomSheet: MatBottomSheet,
    private place: PlacesService
    ){}

  loginForm: UntypedFormGroup = new UntypedFormGroup({});
  passwordForm: UntypedFormGroup = new UntypedFormGroup({});

  public id: string = localStorage.getItem("id");
  public img: string = localStorage.getItem("img");
  public login: string = localStorage.getItem("login");
  public cardParams: CardParams[] = [];
  public circleNoteParams: CircleNoteParams;
  public selected: string[] = [];
  public searchTerm: string = "";
  public placesLiked: Restaurant[] = [];


  public allStations: Station[] = [];
  public filteredData: Station[] = [];

  ngOnInit(){
    this.loginForm = this._formBuilder.group({
      oldLogin : ['', [this.validateOldLogin.bind(this)]],
      newLogin: ['']
    });
    this.passwordForm = this._formBuilder.group({
      oldPassword : [''],
      newPassword: [''],
      retypeNewpassword: ['', [this.validateRetypePassword.bind(this)]]
    });
    this.data.getLikesOfUser(this.id).subscribe((likes: Liked[]) => {
      likes.forEach((like: Liked) => {
        this.data.getPlaceById(like.id_place).subscribe((place: Restaurant) => {
          this.placesLiked.push(place);
        });
      });
    });
    this.data.getStationsOfUser(this.id).subscribe((station: StationOfUser[]) => {
      station.forEach((element: StationOfUser) => {
        this.selected.push(element.name_station);
      });
    });
    this.data.getAllStations().subscribe((station: Station[]) => {
      this.allStations = station;
    });
  }

  validateOldLogin(control: AbstractControl){
    if (control.value.length > 0 && control.value !==  this.login) {
      return { invalidLogin: true };
    }
    return null;
  }

  getFile(event: any){
    if(event != null){
      const user: User = {
        id: this.id,
        img: event.img,
        password: "",
        role: "",
        login: ""
      }
      const file = event.infos;
      console.log(event.infos)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        console.error('File should be a png or a jpeg');
      } else if (file.size > 2e+6) {
        console.error('File is too large. Over 2MB');
      } else {
        console.log('File is valid');
      }
      this.data.setImage(user).subscribe((res:Message) => {
        if(!res.error){
          this.img = event.img;
          localStorage.setItem("img", event.img);
          this.data.setImage(user).subscribe((token: any) => {
            this.place.setImageChange();
          });
        }
      });
    }
  }

  test(e: any){
    console.log(e);
  }

  validateRetypePassword(control: AbstractControl){
    if(control.value !== this.passwordForm.value.newPassword){
      return { notSamePassword: true };
    }
    return null;
  }

  setLogin(){
    const user: User = {
      id: this.id,
      role: localStorage.getItem("role"),
      password: "",
      login: this.loginForm.value.newLogin,
      img: this.img
    }
    this.data.setLogin(user).subscribe(() => {
      localStorage.setItem("login",user.login);
      this.login = user.login;
    });
  }

  setPassword(){
    const user: User = {
      id: this.id,
      role: localStorage.getItem("role"),
      password: this.passwordForm.value.oldPassword,
      login: this.login,
      img: this.img
    }
    this.data.checkPassword(user).subscribe((res: Message) => {
      if(!res.error) {
        user.password = this.passwordForm.value.newPassword;
        this.data.setPassword(user);
      }
      else{
        this.bottomSheet.open(MessageComponent, {data: res.message});
        setTimeout(() => {
          this.bottomSheet.dismiss();
        }, 1500)
      }
    });
  }

  filter(searchTerm: string) {
    if(searchTerm.length === 0) this.filteredData = [];
    else{
      this.filteredData = this.allStations.filter((element: Station) => {
        const name: string = element.name.toLowerCase();
        if(name.includes(searchTerm.toLowerCase()))  return true;
        else  return false;
      });
    }
  }

  select(element: any){
    let indexToSuppress = null;
    this.selected.forEach((station,index) => {
      if(station === element) indexToSuppress = index;
    });
    if(indexToSuppress != null) this.selected.splice(indexToSuppress,1);
    else  this.selected.push(element);

    let stationOfUser: StationOfUser[] = [];
    this.selected.forEach((element: string) => {
      const infos: StationOfUser = {
        id: "",
        id_user: this.id,
        name_station: element
      }
      stationOfUser.push(infos);
    });

    this.data.deleteStationOfUser(this.id).subscribe(res => {
      stationOfUser.forEach((element: StationOfUser) => {
        this.data.addStationOfUser(element);
      });
    });
  }
}
