import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../model/message';
import { Bar } from '../model/bar';
import { Restaurant } from '../model/restaurant';
import { Address } from '../model/address';
import { Comment } from '../model/comment';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { Liked } from '../model/liked';
import { Station } from '../model/station';
import { StationInPlace } from '../model/stationInPlace';
import { User } from '../model/users';
import { Ligne } from '../model/ligne';
import { LigneInStation } from '../model/ligneInStation';
import { PlacesService } from './places.service';
import { StationOfUser } from '../model/stationOfUser';
import { CardParams } from '../model/cardParams';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient,private router: Router,private placesService: PlacesService) { }


  private serverUrl = "http://localhost:3000";

  private header: any = {
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  private httpOptions : any    = {
    headers: new HttpHeaders(this.header)
  };

  setId(){
    let id: string ="";
    for(let i = 0; i < 15; i++){
      id += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return id;
  }

  setAuthorizationHeader(){
    this.header.Authorization = localStorage.getItem("token");
    this.httpOptions  = {
      headers: new HttpHeaders(this.header)
    };
  }

  private placesUrl: string = "/places";
  getAllPlaces(){
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.placesUrl,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  getPlaceById(id: string){
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.placesUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: any) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res[0]);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  getPlacesByStation(station: string,id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.placesUrl + "/station/" + encodeURIComponent(station),this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getPlacesByLigne(ligne: string,id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.placesUrl + "/ligne/" + encodeURIComponent(ligne) +"?idPlace=" +id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getAllInfosOfPlace(id: string){
    let toReturn: Subject<any> = new Subject();
    let statInPlace: Station[] = [];
      let lignesInStat: Ligne[] = [];
      let params: any = {
        pictures: [],
        stationsInPlace: [],
        lignesInStation: [],
        addresses: [],
        horaires: [],
      }
    this.getStationsOfPlace(id).subscribe(res => {
      statInPlace.push(...res);
      params.stationsInPlace = statInPlace;
      this.getPicturesOfPlace(id).subscribe((pic:Pictures[]) => {
        params.pictures = pic;
        this.getAddressOfPlace(id).subscribe((addresses: Address[]) =>{
          params.addresses = addresses;
          this.getHorairesOfPlace(id).subscribe((horaires: Horaires[]) => {
            params.horaires = horaires;
            res.forEach((station: Station,index: number) => {
              this.getLignesOfStation(station.name).subscribe((ligne: Ligne[]) => {
                lignesInStat.push(...ligne);
                params.lignesInStation = lignesInStat;
                if(index === res.length -1){
                  toReturn.next(params);
                } 
              });
            });
          });
        });
      });
    });

    return toReturn;
  }
  ////////////////////////////////////////  Bars ////////////////////////////////////////
  private barUrl = "/bar";

  getBarById(id: string){
    let promise: Subject<Message | Bar> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  getAllBars(){
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  getBestNotesBar(tested: boolean,type_note: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();

    const requestParam: any = {
      tested: tested,
      type_note: type_note
    }
    let request: string = JSON.stringify(requestParam);
    this.httpClient.get(this.serverUrl + this.barUrl + "/best/" + request,this.httpOptions)
    .subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getBarByType(type: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl + "/type/" + type,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getBarByArrondissement(arrondissement: number){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl + "/arrondissement/" + arrondissement.toString(),this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getBarsByStation(station: string,id: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl + "/station/" + encodeURIComponent(station) +"?idPlace=" +id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getBarsByLigne(ligne: string,id: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.barUrl + "/ligne/" + encodeURIComponent(ligne) +"?idPlace=" +id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  addBar(bar: Bar, allHoraires: Horaires[], allPictures: Pictures[], allComments: Comment[],allAddress: Address[]){
    let toReturn: Subject<Message> = new Subject();
    
    bar.id = this.setId();
    allHoraires.forEach((horaires: Horaires) => {
      horaires.id_place = bar.id;
      this.addHoraires(horaires);
    });
    allPictures.forEach((picture: Pictures) => {
      picture.id_place = bar.id;
      this.addPicture(picture);
    });
    allComments.forEach((comment: Comment) => {
      comment.id_place = bar.id;
      this.addComment(comment);
    });
    allAddress.forEach((address: Address) => {
      address.id_place = bar.id;
      this.addAddress(address);
    });
    this.httpClient.post<Bar>(this.serverUrl + this.barUrl,bar,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le bar à été ajouté."});
      }
      else  toReturn.next({error: true, message: "Le bar n'a pas pu être ajouté."});
    });

    return toReturn;
  }

  updateBar(bar: Bar, allHoraires: Horaires[], allPictures: Pictures[], allComments: Comment[], allAddress: Address[], stationsInPlace: StationInPlace[]){
    let toReturn: Subject<Message> = new Subject();
    this.deletePicture(bar.id).subscribe(res => {
      allPictures.forEach((element: Pictures) => {
        this.addPicture(element);
      });
    })
    
    this.deleteComment(bar.id).subscribe(res => {
      allComments.forEach((element: Comment) => {
        this.addComment(element);
      });
    })
    
    this.deleteStationInPlace(bar.id).subscribe(res => {
      stationsInPlace.forEach((element: StationInPlace) => {
        this.addStationinPlace(element);
      });
    })
    
    allHoraires.forEach((element: Horaires) => {
      this.updateHoraires(element);
    });
    allAddress.forEach((element: Address) => {
      this.updateAddress(element);
    });

    this.setAuthorizationHeader();
    this.httpClient.patch<Bar>(this.serverUrl + this.barUrl,bar,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }

  deleteBar(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Bar>(this.serverUrl + this.barUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }


  
  ////////////////////////////////////////  Restaurants ////////////////////////////////////////
  private restaurantUrl = "/restaurants";
  getRestaurantById(id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        res.forEach((place: Restaurant) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getAllRestaurants(){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Restaurant) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getBestNotesRestaurant(tested: boolean,type_note: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();

    const requestParam: any = {
      tested: tested,
      type_note: type_note
    }
    let request: string = JSON.stringify(requestParam);
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/best/" + request,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        return promise.next(res)        
      }
      else{
        console.log(res.error);
      }
    });
    return promise.asObservable();
  }
  getRestaurantsByType(type: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/type/" + type,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        res.forEach((place: Restaurant) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getRestaurantsByArrondissement(arrondissement: number){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/arrondissement/" + arrondissement.toString(),this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Restaurant) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getRestaurantsByStation(station: string,id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/station/" + encodeURIComponent(station) +"?idPlace=" +id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getRestaurantsByLigne(ligne: string,id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/ligne/" + encodeURIComponent(ligne) +"?idPlace=" +id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((place: Bar) => {
          if(place.facade == null || place.facade.length === 0){
            place.facade = this.placesService.getTypeFacade(place.type);
          }
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  addRestaurant(restaurant: Restaurant, allHoraires: Horaires[], allPictures: Pictures[], allComments: Comment[], allAddress: Address[]){
    let toReturn: Subject<Message> = new Subject();
    restaurant.id = this.setId();
    allHoraires.forEach((horaires: Horaires) => {
      horaires.id_place = restaurant.id;
      this.addHoraires(horaires);
    });
    allPictures.forEach((picture: Pictures) => {
      picture.id_place = restaurant.id;
      this.addPicture(picture);
    });
    allComments.forEach((comment: Comment) => {
      comment.id_place = restaurant.id;
      this.addComment(comment);
    });
    allAddress.forEach((address: Address) => {
      address.id_place = restaurant.id;
      this.addAddress(address);
    });
    this.httpClient.post<Restaurant>(this.serverUrl + this.restaurantUrl,restaurant,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le restaurant à été ajouté."});
      }
      else  toReturn.next({error: true, message: "Le restaurant n'a pas pu être ajouté."});
    });
    return toReturn;
  }

  updateRestaurant(restaurant: Restaurant, allHoraires: Horaires[], allPictures: Pictures[], allComments: Comment[], allAddress: Address[], stationsInPlace: StationInPlace[]){
    let toReturn: Subject<Message> = new Subject();

    this.deletePicture(restaurant.id).subscribe(res => {
      allPictures.forEach((element: Pictures) => {
        this.addPicture(element);
      });
    });
    
    this.deleteComment(restaurant.id).subscribe(res => {
      allComments.forEach((element: Comment) => {
        this.addComment(element);
      });
    });
    
    this.deleteStationInPlace(restaurant.id).subscribe(res => {
      stationsInPlace.forEach((element: StationInPlace) => {
        this.addStationinPlace(element);
      });
    });
    
    allHoraires.forEach((element: Horaires) => {
      this.updateHoraires(element);
    });
    allAddress.forEach((element: Address) => {
      this.updateAddress(element);
    });
    this.setAuthorizationHeader();
    this.httpClient.patch<Restaurant>(this.serverUrl + this.restaurantUrl,restaurant,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }

  deleteRestaurant(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Restaurant>(this.serverUrl + this.restaurantUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Address ////////////////////////////////////////
  private addressUrl = "/address";
  getAddressOfPlace(id: string){
    let promise: Subject<Address[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.addressUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addAddress(address: Address){
    let toReturn: Subject<Message> = new Subject();
    address.id = this.setId();
    this.httpClient.post<Address>(this.serverUrl + this.addressUrl,address,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "L'adresse à été ajouté."});
      }
      else  toReturn.next({error: true, message: "L'adresse n'a pas pu être ajouté."});
    });
    return toReturn;
  }
  updateAddress(address: Address){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.patch<Address>(this.serverUrl + this.addressUrl,address,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  deleteAddress(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Address>(this.serverUrl + this.addressUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Comment ////////////////////////////////////////
  private commentUrl = "/comment";
  getCommentOfPlace(id: string){
    let promise: Subject<Message | Comment[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.commentUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  addComment(comment: Comment){
    let toReturn: Subject<Message> = new Subject();
    comment.id = this.setId();
    this.httpClient.post<Comment>(this.serverUrl + this.commentUrl,comment,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le commentaire à été ajouté."});
      }
      else  toReturn.next({error: true, message: "Le commentaire n'a pas pu être ajouté."});
    });
    return toReturn;
  }
  deleteComment(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Comment>(this.serverUrl + this.commentUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Horaires ////////////////////////////////////////
  private horairesUrl = "/horaires";
  getHorairesOfPlace(id: string){
    let promise: Subject<Message | Horaires[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.horairesUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  addHoraires(horaires: Horaires){
    let toReturn: Subject<Message> = new Subject();
    horaires.id = this.setId();
    this.httpClient.post<Horaires>(this.serverUrl + this.horairesUrl,horaires,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les horaires ont été ajoutés."});
      }
      else  toReturn.next({error: true, message: "Les horaires n'ont pas pu être ajoutés."});
    });
    return toReturn;
  }
  updateHoraires(horaires: Horaires){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.patch<Horaires>(this.serverUrl + this.horairesUrl,horaires,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  deleteHoraires(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Horaires>(this.serverUrl + this.horairesUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Lignes ////////////////////////////////////////
  private lignesUrl = "/ligne";
  getAllLignes(){
    let promise: Subject<Ligne[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.lignesUrl,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  ////////////////////////////////////////  Pictures ////////////////////////////////////////
  private picUrl = "/pictures";
  getPicturesOfPlace(id: string){
    let promise: Subject<Pictures[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.picUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getAllPictures(){
    let promise: Subject<Pictures[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.picUrl,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) promise.next(res);
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addPicture(pictures: Pictures){
    let toReturn: Subject<Message> = new Subject();
    pictures.id = this.setId();
    this.httpClient.post<Pictures>(this.serverUrl + this.picUrl,pictures,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les horaires ont été ajoutés."});
      }
      else  toReturn.next({error: true, message: "Les horaires n'ont pas pu être ajoutés."});
    });
    return toReturn;
  }
  deletePicture(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<Pictures>(this.serverUrl + this.picUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Place liked ////////////////////////////////////////
  private likeUrl = "/place_like";
  getLikesOfUser(id: string){
    let promise: Subject<Liked[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.likeUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addLike(like: Liked){
    let toReturn: Subject<Message> = new Subject();
    like.id = this.setId();
    this.httpClient.post<Liked>(this.serverUrl + this.likeUrl,like,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le like a été ajouté."});
      }
      else  toReturn.next({error: true, message: "Le like n'a pas pu être ajouté."});
    });
    return toReturn;
  }
  deleteLike(like: Liked){
    let toReturn: Subject<Message> = new Subject();
    const params: string = JSON.stringify(like);
    this.setAuthorizationHeader();
    this.httpClient.delete<Liked>(this.serverUrl + this.likeUrl+'?infos='+encodeURIComponent(params),this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Stations ////////////////////////////////////////
  private stationUrl = "/station";
  getAllStations(){
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        // let allStations: Station[] = [];
        // res.forEach((station: string) => {
        //   allStations.push({name:station});
        // });
        promise.next(res as Station);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }

  ////////////////////////////////////////  Stations in place ////////////////////////////////////////
  private stationInPlaceUrl = "/station_in_place";
  getStationsOfPlace(id: string){
    let promise: Subject<Station[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationInPlaceUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        let stations: Station[] = [];
        res.forEach((element:any) => {
          stations.push({
            name: element.name_station
          })
        });
        promise.next(stations);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addStationinPlace(stationInfos: StationInPlace){
    let toReturn: Subject<Message> = new Subject();
    stationInfos.id = this.setId();
    this.httpClient.post<StationInPlace>(this.serverUrl + this.stationInPlaceUrl,stationInfos,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les horaires ont été ajoutés."});
      }
      else  toReturn.next({error: true, message: "Les horaires n'ont pas pu être ajoutés."});
    });
    return toReturn;
  }
  deleteStationInPlace(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<StationInPlace>(this.serverUrl + this.stationInPlaceUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Ligne in station ////////////////////////////////////////
  private ligneInStationUrl = "/ligne_in_station";
  getStationsOfLigne(nameLigne: string){
    let promise: Subject<Message | LigneInStation> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationInPlaceUrl + "/" + nameLigne,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  getLignesOfStation(nameStation: string){
    let promise: Subject<Ligne[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.ligneInStationUrl + "/station/"+encodeURIComponent(nameStation),this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        let lignes: Ligne[] = [];
        res.forEach((element:any) => {
          lignes.push({
            name: element.name_ligne
          });
        });
        promise.next(lignes);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  ////////////////////////////////////////  Ligne in station ////////////////////////////////////////
  private stationOfUserUrl = "/station_of_user";
  getStationsOfUser(idUser: string){
    let promise: Subject<StationOfUser[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationOfUserUrl + "/" + idUser,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addStationOfUser(stationInfos: StationOfUser){
    let toReturn: Subject<Message> = new Subject();
    stationInfos.id = this.setId();
    this.httpClient.post<StationOfUser>(this.serverUrl + this.stationOfUserUrl,stationInfos,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les horaires ont été ajoutés."});
      }
      else  toReturn.next({error: true, message: "Les horaires n'ont pas pu être ajoutés."});
    });
    return toReturn;
  }
  deleteStationOfUser(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<StationOfUser>(this.serverUrl + this.stationOfUserUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
      }    });
    return toReturn;
  }

  ////////////////////////////////////////  Custom ////////////////////////////////////////
  private customUrl = "/custom";
  getPlacesOfFavoriteStations(idUser: string){
    let promise: Subject<any[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/placeInStation/" + idUser,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getRestaurantsOfStation(id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/restaurantOfStation/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getBarsOfStation(id: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/barOfStation/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getRestaurantsOfLigne(id: string){
    let promise: Subject<Restaurant[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/restaurantOfLigne/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getBarsOfLigne(id: string){
    let promise: Subject<Bar[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/barOfLigne/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getLignesOfPlace(id: string){
    let promise: Subject<Ligne[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.customUrl + "/ligneOfPlace/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getRestaurantsOfMultipleStations(stations: Station[]){
    let promise: Subject<any[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post(this.serverUrl + this.customUrl + "/restaurantsOfMultipleStations",stations,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getBarsOfMultipleStations(stations: Station[]){
    let promise: Subject<any[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post(this.serverUrl + this.customUrl + "/barsOfMultipleStations",stations,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getRestaurantsOfMultipleLignes(lignes: Ligne[]){
    let promise: Subject<Ligne[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post(this.serverUrl + this.customUrl + "/restaurantsOfMultipleLignes",lignes,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  getBarsOfMultipleLignes(lignes: Ligne[]){
    let promise: Subject<Ligne[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post(this.serverUrl + this.customUrl + "/barsOfMultipleLignes",lignes,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        res.forEach((element: any) => {
          element.facade = this.placesService.getTypeFacade(element.type);
        });
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }

  ////////////////////////////////////////  Connexion/User ////////////////////////////////////////
  private connectionUrl = "/auth"

  checkPassword(userInfo: User){
    let toReturn: Subject<Message> = new Subject();
    let params: string = JSON.stringify(userInfo);

    this.httpClient.get(this.serverUrl + this.connectionUrl +"/login"+'?user='+encodeURIComponent(params),this.httpOptions).subscribe((res: any) => {
      if(res.error !== true){
        toReturn.next({
          error: false,
          message: ""
        });
      } else{
        toReturn.next({
          error: true,
          message: res.message
        });
      }
    });

    return toReturn.asObservable();
  }
  login(userInfo: User){
    let toReturn: Subject<Message> = new Subject();

    let params: string = JSON.stringify(userInfo);

    this.httpClient.get(this.serverUrl + this.connectionUrl +"/login"+'?user='+encodeURIComponent(params),this.httpOptions).subscribe((res: any) => {
      if(res.error !== true){
        localStorage.setItem("token", res.token);
        toReturn.next({
          error: false,
          message: ""
        });
      } else{
        toReturn.next({
          error: true,
          message: res.message
        });
      }
    });

    return toReturn.asObservable();
  }
  loginByToken(token: string){
    let log: Subject<User> = new Subject();
    const objectToken = {
      token: token
    }
    this.httpClient.post(this.serverUrl + this.connectionUrl + "/token", objectToken,this.httpOptions).subscribe((res: any) => {
      log.next(res);
    });

    return log;
  }

  signup(user: User){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    user.id = this.setId();
    this.httpClient.post(this.serverUrl + this.connectionUrl,user,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next({error: false, message: "L'utilisateur à été ajouté."});
      }
      else  toReturn.next({error: true, message: "L'utilisateur n'a pas pu être ajouté."});
    });

    return toReturn;
  }
  setPassword(user: User){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post<User>(this.serverUrl + this.connectionUrl + "/password",user,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  setLogin(user: User){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post<User>(this.serverUrl + this.connectionUrl + "/login",user,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  getImage(id: string){
    let toReturn: Subject<string> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.connectionUrl + "/image/"+id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res.img);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  setImage(user: User){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post<User>(this.serverUrl + this.connectionUrl + "/image",user,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  updateUser(user: User){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.patch<User>(this.serverUrl + this.connectionUrl + "/" + user.id,user,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return toReturn;
  }
  deleteUser(id: string){
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete<User>(this.serverUrl + this.connectionUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null) toReturn.next({error: false, message: res.message});
      else {
        toReturn.next({error: true, message: res.message});
        console.log(res.error);
      }    });
    return toReturn;
  }

}
