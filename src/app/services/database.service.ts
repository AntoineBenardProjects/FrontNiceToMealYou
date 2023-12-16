import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Message } from '../shared/model/params/message';
import { Comment } from '../shared/model/table/comment';
import { Horaires } from '../shared/model/table/horaires';
import { Pictures } from '../shared/model/table/pictures';
import { PlacesService } from './places.service';
import { City, Place } from '../shared/model/table/places';
import { Follow, PlaceOfUser, User } from '../shared/model/table/user';
import { Coords, Ligne, Station } from '../shared/model/table/transports';
import { Type, TypeOfPlace } from '../shared/model/table/type';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient,private router: Router,private placesService: PlacesService) { }


  private localUrl = "http://localhost:3000";

  private serverUrl = this.localUrl;
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
    localStorage.getItem("token") != null ? this.header.Authorization = localStorage.getItem("token") : this.header.Authorization = "";
    this.httpOptions  = {
      headers: new HttpHeaders(this.header)
    };
  }

  private get(url: string): any{
    let promise: Subject<any> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.get(this.serverUrl + url,this.httpOptions).subscribe((res:any) => {
      if(res.error == null){
        promise.next(res);
      }
      else{
        promise.next({error: res.error, message: res.message});
      }
    })
    return promise;
  }
  private add(url: string, params: any): Subject<Message>{
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.post(this.serverUrl + url,params,this.httpOptions).subscribe((res: any) => {
      toReturn.next({error: res.error, message: res.message});
    });
    return toReturn;
  }
  private update(url: string, params: any): Subject<any>{
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.patch(this.serverUrl + url,params,this.httpOptions).subscribe((res:any) => {
      if(res.error != null) toReturn.next({error: res.error, message: res.message});
      else  toReturn.next(res);
    });
    return toReturn;
  }
  private delete(url: string): Subject<Message>{
    let toReturn: Subject<Message> = new Subject();
    this.setAuthorizationHeader();
    this.httpClient.delete(this.serverUrl + url,this.httpOptions).subscribe((res:any) => {
      toReturn.next({error: res.error, message: res.message});
    });
    return toReturn;
  }


  ////////////////////////////////////////  Place ////////////////////////////////////////
  private placeUrl = "/place";
  private restaurantUrl = "/restaurant";
  private barUrl = "/bar";
  private loisirUrl = "/loisir";
  private magasinUrl = "/magasin";
  private serviceUrl = "/service";
  private cityUrl = "/city";
  private commentUrl = "/comment";
  private picUrl = "/pictures";
  private horairesUrl = "/horaires";
  private connectionUrl = "/auth"
  private typeUrl = "/type";
  private stationUrl: string = "/station";
  private databaseUrl: string = "/database";
  private followUrl: string = "/follow";
  getAllPlacesName(){
    let url: string = this.placeUrl + "/all";
    return this.get(url);
  }
  getAllPlacesByCategory(category: string){
    let url: string = "";
    switch(category){
      case 'Restaurant':
        url = this.restaurantUrl;
      break;
      case 'Bar':
        url = this.barUrl;
      break;
      case 'Loisir':
        url = this.loisirUrl;
      break;
      case 'Service':
        url = this.serviceUrl;
      break;
      case 'Magasin':
        url = this.magasinUrl;
      break;
      case 'Autre':
        url = "/other";
      break;
      case '':
        url = this.placeUrl + "/visible";
      break;
    }
    return this.get(url);
  }
  getAllVisiblePlacesOfUser(id_user: string){
    let url: string = this.placeUrl + "/visible/" + id_user;
    return this.get(url);
  }
  getPlacesOfUser(id_user: string){
    const url: string = this.connectionUrl + "/place/" + id_user;
    return this.get(url);
  }
  getStatsOfType(type: Type){
    const params = {
      id: type.id,
      category: type.category
    }
    const url: string = this.placeUrl + "/stats/type/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  verifyExistingPlace(place: Place){
    const params = {
      name: place.name,
      address: place.address,
      category: place.category
    };
    const url: string = this.placeUrl + "/verify/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getPlaceInfos(id_place: string,id_user: string){
    const params = {
      id_user: id_user,
      id_place: id_place
    }
    const url: string = this.placeUrl + "/infos/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  addPlaceByCategory(place: Place){
    let url: string = "";
    switch(place.category){
      case 'Restaurant':
        url = this.restaurantUrl;
      break;
      case 'Bar':
        url = this.barUrl;
      break;
      case 'Loisir':
        url = this.loisirUrl;
      break;
      case 'Service':
        url = this.serviceUrl;
      break;
      case 'Magasin':
        url = this.magasinUrl;
      break;
      case 'Autre':
        url = this.placeUrl;
      break;
    }
    return this.add(url,place);
  }
  updatePlaceByCategory(place: Place){
    let url: string = "";
    switch(place.category){
      case 'Restaurant':
        url = this.restaurantUrl;
      break;
      case 'Bar':
        url = this.barUrl;
      break;
      case 'Loisir':
        url = this.loisirUrl;
      break;
      case 'Service':
        url = this.serviceUrl;
      break;
      case 'Magasin':
        url = this.magasinUrl;
      break;
      case 'Autre':
        url = this.placeUrl;
      break;
    }
    return this.update(url,place);
  }
  getPlacesSuggestionsOfUser(id: string){
    const url: string = this.placeUrl + "/suggestion/place/" + id;
    return this.get(url);
  }
  deletePlaces(ids: string[]){
    const url: string = this.placeUrl + "/multiple/" + encodeURIComponent(JSON.stringify(ids));
    return this.delete(url);
  }
  ////////////////////////////////////////  City  ////////////////////////////////////////
  getAllCities(){
    return this.get(this.cityUrl);
  }
  getCityById(id: string){
    const url: string = "";
    return this.get(this.cityUrl + "/id/" + id);
  }
  getCityIdByProperties(city: City){
    const url: string = this.cityUrl + "/properties/" + encodeURIComponent(JSON.stringify(city));
    return this.get(url);
  }
  addCity(city: City){
    return this.add(this.cityUrl, city);
  }
  updateCity(city: City){
    return this.update(this.cityUrl,city);
  }
  getCommentsOfUser(idUser: string){
    const url: string = this.commentUrl + "/all/" + idUser;
    return this.get(url);
  }
  addComment(comment: Comment, category: string){
    let url: string = "";
    if(category === 'Restaurant') url = this.commentUrl + this.restaurantUrl;
    else  url = this.commentUrl + '/common';
    return this.add(url,comment);
  }
  updateComment(comment: Comment,category: string){
    let url: string = this.commentUrl;
    switch(category){
      case "Restaurant":
        url += this.restaurantUrl;
      break;
      default:
        url += "/common";
      break;
    }
    return this.update(url,comment);
  }
  filterByComment(rating: Comment,ids: string[]){
    const params = {
      rating: rating,
      ids: ids,
      id_user: localStorage.getItem("id")
    }
    const url: string = this.commentUrl + "/filter/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getHorairesOfPlace(id: string, id_user: string){
    const params = JSON.stringify({
      idPlace: id,
      idUser: id_user
    });
    const url: string = this.horairesUrl + "/" + encodeURIComponent(params);
    return this.get(url);
  }
  addHoraires(horaires: Horaires){
    return this.add(this.horairesUrl, horaires);
  }
  updateHoraires(horaires: Horaires){
    return this.update(this.horairesUrl,horaires);
  }


  ////////////////////////////////////////  Pictures ////////////////////////////////////////
  addPicture(pictures: Pictures){
    pictures.id = this.setId();
    return this.add(this.picUrl,pictures);
  }
  deletePicture(id: string){
    const url: string = this.picUrl + "/" + id;
    return this.delete(url);
  }
  getAllUsers(){
    return this.get(this.connectionUrl);
  }
  getAllUsersLogin(){
    const url: string = this.connectionUrl + "/names";
    return this.get(url);
  }
  getUserInfo(id: string){
    const url: string = this.connectionUrl + "/infos/" + id;
    return this.get(url);
  }
  checkPassword(userInfo: User){
    let params: string = JSON.stringify(userInfo);
    const url: string = this.connectionUrl +"/login"+'?user='+encodeURIComponent(params);
    return this.get(url);
  }
  getValidName(name: string){
    const url: string = this.connectionUrl +"/used/"+name;
    return this.get(url);
  }
  login(userInfo: User){
    const url: string = this.connectionUrl +"/login"+'?user='+encodeURIComponent(JSON.stringify(userInfo));
    return this.get(url);
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
    const url: string = this.connectionUrl + "/signup";
    return this.add(url,user);
  }
  verifyPlaceOfUser(placeOfUser: PlaceOfUser){
    const url: string = this.connectionUrl + "/verify/place/" + encodeURIComponent(JSON.stringify(placeOfUser));
    return this.get(url);
  }
  addPlaceOfUser(place: PlaceOfUser){
    const url: string = this.connectionUrl + "/place";
    return this.add(url,place);
  }
  getImage(idUser: string){
    let toReturn: Subject<string[]> = new Subject();
    const url: string = this.connectionUrl +"/image/"+idUser;
    this.get(url).subscribe((img: any) => {
      toReturn.next([img.img,img.couv])
    });
    return toReturn;
  }
  isAdmin(id: string){
    const url: string = this.connectionUrl + "/admin/" +id;
    return this.get(url);
  }
  setCouv(idUser: string,couv: string){
    const params = {
      id: idUser,
      couv: couv
    }
    const url: string = this.connectionUrl +"/couv";
    return this.update(url,params);
  }
  setImage(idUser: string,img: string){
    const params = {
      id: idUser,
      img: img
    }
    const url: string = this.connectionUrl +"/img";
    return this.update(url,params);
  }
  setLogin(idUser: string,login: string){
    const params = {
      id: idUser,
      login: login
    };
    const url: string = this.connectionUrl +"/login";
    return this.update(url,params);
  }
  setPassword(idUser: string,password: string){
    const params = {
      id: idUser,
      password: password
    }
    const url: string = this.connectionUrl +"/password";
    return this.update(url,params);
  }
  getStatistics(idUser: string){
    const url: string = this.connectionUrl +"/statistics/"+idUser;
    return this.get(url);
  }
  addUsers(users: User[]){
    const url: string = this.connectionUrl + "/multiple";
    return this.add(url,users);
  }
  updateUsers(users: User[]){
    const url: string = this.connectionUrl + "/multiple";
    return this.update(url,users);
  }
  deleteUsers(ids: string[]){
    const url: string = this.connectionUrl + "/multiple/" +encodeURIComponent(JSON.stringify(ids));
    return this.delete(url);
  }

  ////////////////////////////////////////  Station ////////////////////////////////////////
  //
  getStationOfPlaceByCoords(location: Coords){
    const url: string = this.stationUrl + "/coords/" + encodeURIComponent(JSON.stringify(location));
    return this.get(url);
  }
  //
  getLignesOfStation(id: string){
    const url: string = this.stationUrl + "/ligne/station/" + id;
    return this.get(url);
  }
  getStationOfPlace(id: string){
    const url: string = this.stationUrl + "/id/" + id;
    return this.get(url);
  }
  getStationsOfUser(id: string){
    const url: string = this.stationUrl + "/favorite/" + id;
    return this.get(url);
  }
  getAllRegion(){
    const url: string = "/region";
    return this.get(url);
  }
  getTransportsOfRegion(region: string){
    const url: string = this.stationUrl + "/transport/" + region;
    return this.get(url);
  }
  getLignesOfRegion(region: string){
    const url: string = this.stationUrl + "/ligne/region/" + region;
    return this.get(url);
  }
  getLignesOfRegionByTransport(region: string, transport: string){
    const body: any = {
      region: region,
      transport: transport
    };
    const url: string = this.stationUrl + "/ligne/transport/" + encodeURIComponent(JSON.stringify(body));
    return this.get(url);
  }
  getStationsOfLigne(ligne: string){
    const url: string = this.stationUrl + "/station/ligne/" + ligne;
    return this.get(url);
  }
  getPlacesByRegionAndUser(reg:string,id_user: string){
    const params = {
      region:reg,
      id_user: id_user
    }
    const url: string = this.stationUrl + "/place/region/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getPlacesByTransportOfRegionAndUser(reg:string,transport:string,id_user: string){
    const params = {
      transport: transport,
      region:reg,
      id_user: id_user
    }
    const url: string = this.stationUrl + "/place/transport/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getPlacesByLigneAndUser(ligne: string,id_user: string){
    const params = {
      ligne: ligne,
      id_user: id_user
    }
    const url: string = this.stationUrl + "/ligne/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getPlacesByStationAndUser(station: Station, id_user: string){
    const params = {
      station: station,
      id_user: id_user
    }
    const url: string = this.stationUrl + "/user/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getStatisticsOfStation(id: string){
    const url: string = this.stationUrl +"/statistics/"+id;
    return this.get(url);
  }
  addStationOfPlace(id_place: string, id_station: string){
    const url: string = this.stationUrl + "/near";
    const params = {
      id_place: id_place,
      id_station: id_station
    };
    return this.add(url,params);
  }
  addStationOfUser(id_user: string, id_station: string){
    const params = {
      id_user: id_user,
      id_station: id_station
    }
    const url: string = this.stationUrl + "/user/";
    return this.add(url, params);
  }
  deleteStationOfUser(id_user: string, id_station: string){
    const params = {
      id_user: id_user,
      id_station: id_station
    }
    const url: string = this.stationUrl + "/user/"+encodeURIComponent(JSON.stringify(params));
    return this.delete(url);
  }
  addLignes(lignes: Ligne[]){
    return this.add("/ligne",lignes);
  }
  updateLignes(lignes: Ligne[]){
    return this.update("/ligne",lignes);
  }
  deleteLignes(ids: string[]){
    const url: string = "/ligne/" +encodeURIComponent(JSON.stringify(ids));
    return this.delete(url);
  }
  addStations(stations: Station[]){
    return this.add(this.stationUrl,stations);
  }
  updateStations(stations: Ligne[]){
    return this.update(this.stationUrl,stations);
  }
  deleteStations(ids: string[]){
    const url: string = this.stationUrl+ "/" +encodeURIComponent(JSON.stringify(ids));
    return this.delete(url);
  }
  //
  getAllTypes(){
    return this.get(this.typeUrl);
  }
  getTypeIdByCategoryAndName(category: string,name: string){
    const params = {
      category: category,
      name: name
    }
    const url: string = this.typeUrl + "/id/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  getTypeByCategory(category: string){
    const url: string = this.typeUrl + "/category/" + category;
    return this.get(url);
  }
  //
  getTypesOfPlace(id: string){
    const url: string = this.typeUrl + "/place/" + id;
    return this.get(url);
  }
  getTypesOfUser(id: string){
    const url: string = this.typeUrl + "/user/" + id;
    return this.get(url);
  }
  verifyPlaceTypes(id_types: string[], id_place: string){
    const params = {
      ids_type: id_types,
      id_place: id_place
    }
    const url: string = this.typeUrl + "/places/" + encodeURIComponent(JSON.stringify(params));
    return this.get(url);
  }
  addTypes(types: Type[]){
    return this.add(this.typeUrl,types);
  }
  addTypeOfPlace(typeOfPlace: TypeOfPlace){
    const url: string = this.typeUrl + "/place";
    return this.add(url,typeOfPlace);
  }
  addTypeOfUser(id_user: string,id_type: string){
    const url: string = this.typeUrl + "/user";
    const params = {
      id_type: id_type,
      id_user: id_user
    }
    return this.add(url, params);
  }
  updateTypes(types: Type[]){
    return this.update("/type",types);
  }
  deleteTypes(ids: string[]){
    const url: string ="/type/" +encodeURIComponent(JSON.stringify(ids));
    return this.delete(url);
  }
  deleteTypeOfUser(id_user: string, id_type: string){
    const params = {
      id_type: id_type,
      id_user: id_user
    }
    const url: string = this.typeUrl + "/user/"+encodeURIComponent(JSON.stringify(params));
    return this.delete(url);
  }
////////////////////////////////////////  Follow ////////////////////////////////////////
  getRelationBetweenUsers(follow: Follow){
    const url: string = this.followUrl + "/" + encodeURIComponent(JSON.stringify(follow));
    return this.get(url);
  }
  getRequestsOfRelation(id: string){
    const url: string = this.followUrl + "/request/" + id;
    return this.get(url);
  }
  getFriends(id: string){
    const url: string = this.followUrl + "/friends/" + id;
    return this.get(url);
  }
  getCommonFriends(follow: Follow){
    const url: string = this.followUrl + "/common/" + encodeURIComponent(JSON.stringify(follow));
    return this.get(url);
  }
  addFollower(follow: Follow){
    return this.add(this.followUrl,follow);
  }
  updateFollower(follow: Follow){
    return this.update(this.followUrl,follow);
  }
////////////////////////////////////////  Database ////////////////////////////////////////
  setStationsNearPlace(){
    const url: string = this.databaseUrl + "/station_near_place"
    return this.add(url,null);
  }
  cleanTypeOfPlace(){
    const url: string = this.databaseUrl + "/type_of_place"
    return this.add(url,null);
  }
  setDemoPlaces(){
    const url: string = this.databaseUrl + "/demo/places";
    return this.add(url,null);
  }
}
