import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Message } from '../model/message';
import { Comment, RestaurantsGrades } from '../model/comment';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { PlacesService } from './places.service';
import { Restaurant } from '../model/places';
import { PlaceOfUser, User } from '../model/user';
import { Coords, Station } from '../model/transports';

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
        promise.next(res);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }


  
  ////////////////////////////////////////  Restaurants ////////////////////////////////////////
  private restaurantUrl = "/restaurant";
  getRestaurantById(id: string){
    let promise: Subject<Restaurant> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
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
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  getPlaceDetails(id:string){
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/details/"+id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  verifyExistingRestaurant(name: string, address: string){
    let promise: Subject<Message | Restaurant> = new Subject();
    this.setAuthorizationHeader();
    const params = JSON.stringify({
      name: name,
      address: address
    });
    this.httpClient.get(this.serverUrl + this.restaurantUrl + "/verify/" + encodeURIComponent(params),this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res[0]);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  addRestaurant(restaurant: Restaurant){
    let toReturn: Subject<Message> = new Subject();
    restaurant.id = this.setId();
    this.httpClient.post<Restaurant>(this.serverUrl + this.restaurantUrl,restaurant,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le restaurant à été ajouté."});
      }
      else  toReturn.next({error: true, message: "Le restaurant n'a pas pu être ajouté."});
    });
    return toReturn;
  }
  updateRestaurant(restaurant: Restaurant){
    let toReturn: Subject<Message> = new Subject();
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

  ////////////////////////////////////////  Comment ////////////////////////////////////////
  private commentUrl = "/comment";
  getCommentOfPlaceByUser(idPlace: string, idUser: string, category?: string){
    let promise: Subject<Message | Comment> = new Subject();
    this.setAuthorizationHeader();
    const params = JSON.stringify({
      id_place: idPlace,
      id_user: idUser,
      category: category
    });
    this.httpClient.get(this.serverUrl + this.commentUrl + "/" + encodeURIComponent(params),this.httpOptions).subscribe((res:any) => {
      // console.log(res);
      if(res.error == null){
        promise.next(res[0]);
      }
      else{
        promise.next({error: true, message: res.message});
        console.log(res.error);
      }
    });
    return promise;
  }
  addCommentRestaurants(comment: RestaurantsGrades){
    let toReturn: Subject<Message> = new Subject();
    this.httpClient.post<RestaurantsGrades>(this.serverUrl + this.commentUrl + "/restaurants",comment,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les notes ont été ajoutées."});
      }
      else  toReturn.next({error: true, message: "Les notes n'ont pas pu être ajoutées."});
    });
    return toReturn;
  }
  updateCommentRestaurants(comment: RestaurantsGrades){
    let toReturn: Subject<Message> = new Subject();
    this.httpClient.patch<RestaurantsGrades>(this.serverUrl + this.commentUrl + "/restaurants",comment,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Les notes ont été modifées."});
      }
      else  toReturn.next({error: true, message: "Les notes n'ont pas pu être modifées."});
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
  getHorairesOfPlace(id: string, id_user: string){
    let promise: Subject<Message | Horaires[]> = new Subject();
    this.setAuthorizationHeader();
    let params = JSON.stringify({
      idPlace: id,
      idUser: id_user
    });
    this.httpClient.get(this.serverUrl + this.horairesUrl + "/" + encodeURIComponent(params),this.httpOptions).subscribe((res:any) => {
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


  ////////////////////////////////////////  Pictures ////////////////////////////////////////
  private picUrl = "/pictures";
  getPicturesOfPlaceByUser(idPlace: string, idUser: string){
    let promise: Subject<Pictures[]> = new Subject();
    this.setAuthorizationHeader();
    const params: string = JSON.stringify({
      idPlace: idPlace,
      idUser: idUser
    })
    this.httpClient.get(this.serverUrl + this.picUrl + "/" + encodeURIComponent(params),this.httpOptions).subscribe((res:any) => {
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
  getValidName(name: string){
    let toReturn: Subject<Message | number> = new Subject();

    this.httpClient.get(this.serverUrl + this.connectionUrl +"/used/"+name,this.httpOptions).subscribe((res: any) => {
      if(res.error !== true){
        toReturn.next(res);
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
    // this.setAuthorizationHeader();
    user.id = this.setId();
    this.httpClient.post<User>(this.serverUrl + this.connectionUrl + "/signup",user,this.httpOptions).subscribe((res:any) => {
      console.log(res)
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
  getPlaceOfUser(id: string){
    let promise: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.connectionUrl + "/place/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        console.log(res.error);
      }
    });
    return promise;
  }
  addPlaceOfUser(place: PlaceOfUser){
    let toReturn: Subject<Message> = new Subject();
    this.httpClient.post<PlaceOfUser>(this.serverUrl + this.connectionUrl + "/place",place,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "Le lieu a été ajouté."});
      }
      else  toReturn.next({error: true, message: "le lieu n'a pas pu être ajouté."});
    });
    return toReturn;
  }

  ////////////////////////////////////////  Station ////////////////////////////////////////
  private stationUrl: string = "/station";
  getStationOfPlaceByCoords(location: Coords,region: string){
    let toReturn: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    const coords: string = JSON.stringify({
      location: location,
      region: region
    });
    this.httpClient.get(this.serverUrl + this.stationUrl + "/coords/" + encodeURIComponent(coords),this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getLignesOfStation(id: string){
    let toReturn: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/ligne/station/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getStationOfPlaceById(id: string){
    let toReturn: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/id/" + id,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getAllRegion(){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + "/region",this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getTransportsOfRegion(region: string){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/transport/" + region,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getLignesOfRegionByTransport(region: string, transport: string){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    const body: any = {
      region: region,
      transport: transport
    }
    this.httpClient.post(this.serverUrl + this.stationUrl + "/ligne/transport",body,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getLignesOfRegion(region: string){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/ligne/region/" + region,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getStationsOfLigne(ligne: string){
    let toReturn: Subject<Station[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/station/ligne/" + ligne,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getPlacesIdByLigne(ligne: string){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/ligne/" + ligne,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  getPlacesIdByStation(station: Station){
    let toReturn: Subject<string[]> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + this.stationUrl + "/station/" + encodeURIComponent(JSON.stringify(station)),this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        toReturn.next(res);
      }
      else {
        console.log(res);
      }
    });
    return toReturn;
  }
  addStationOfPlace(id_place: string, id_station){
    let toReturn: Subject<Message> = new Subject();
    let params = {
      id_place: id_place,
      id_station: id_station
    };
    this.httpClient.post<Station>(this.serverUrl + this.stationUrl + "/near", params,this.httpOptions).subscribe(res => {
      if(res != null){
        toReturn.next({error: false, message: "La station a été ajoutée."});
      }
      else  toReturn.next({error: true, message: "La station n'a pas pu être ajoutée."});
    });
    return toReturn;
  }
  getIdOfStationByRegAndName(name: string, reg: string){
    let toReturn: Subject<string | Message> = new Subject();
    let params = JSON.stringify({
      name: name,
      reg: reg
    });
    this.httpClient.get<Station>(this.serverUrl + this.stationUrl + "/RegAndName/" + encodeURIComponent(params),this.httpOptions).subscribe((res: any) => {
      if(res != null){
        toReturn.next(res);
      }
      else  toReturn.next({error: true, message: "L'id n'a pas pu être trouvé"});
    });
    return toReturn;
  }
}
