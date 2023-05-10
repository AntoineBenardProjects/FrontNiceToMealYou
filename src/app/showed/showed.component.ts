import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { PlacesService } from '../services/places.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { Bar } from '../model/bar';
import { Comment } from '../model/comment';
import { Address } from '../model/address';
import { Restaurant } from '../model/restaurant';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';
import { Liked } from '../model/liked';
import { Ligne } from '../model/ligne';
import { Station } from '../model/station';
import { Subject } from 'rxjs';
import { desktopParams, mobileParams } from '../shared/circleNoteParams';



@Component({
  selector: 'app-showed',
  templateUrl: './showed.component.html',
  styleUrls: ['./showed.component.scss']
})
export class ShowedComponent implements OnInit, OnDestroy {

  place!: Restaurant;
  pictures: Pictures[] = [];
  addresses: Address[] = [];
  stations: Station[] = [];
  lignes: Ligne[] = [];
  horaires: Horaires[] = [];
  positifComments: string[] = [];
  negatifComments: string[] = [];
  typeOfPlace: string = "";
  getStations: Subject<boolean> = new Subject();
  getLignes: Subject<boolean> = new Subject();

  
  cardParamsSimilarPlaces : CardParams[] = [];
  cardParamsSameLigne: CardParams[] = [];
  cardParamsSameStation: CardParams[] = [];
  cardParamsSameArrondissement: CardParams[] = [];

  private clickHandler: boolean = true;
  private positionResult : number = 0;
  private positionLigne : number = 0;;
  private positionStation : number = 0;
  private positionArrondissement : number = 0;

  colorNote: string = "";
  percent: number = 0;

  station: string = "Aucun";
  urlArrondissement: string = "";
  darkenMetroBackground: boolean = false;
  darkenArrondissementBackground: boolean = true;
  colorMetroTitle: string = "#ffffff";

  circleNoteParamsCard!: CircleNoteParams;
  circleNoteParamsPlace!: CircleNoteParams;

  randomPosition: any[] = [];
  randomPositionNotes: any[] = [];
  randomAnimation: any[] = [];
  randomAnimationNotes: any[] = [];

  isAdmin: boolean = false;
  isVisit: boolean = false;

  heart = regularHeart;
  like: boolean = false;

  constructor(
    private storageService: StorageService, 
    private dataService: DatabaseService,
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setCircleNoteParams();
    if(localStorage.getItem("role") === "Admin")  this.isAdmin = true;
    else if(localStorage.getItem("role") === "Visit") this.isVisit = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.setPlaceInfo(id);
      this.storageService.setSession(this.storageService.keys.PLACEDETAILS,id);
    });

    if(this.darkenMetroBackground)  this.colorMetroTitle = "000";
  }

  setCircleNoteParams(){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.circleNoteParamsPlace = {
        radius: 50,
        strokeWidth: 2,
        subtitleFontSize: (windowWidth/25).toString(),
        titleFontSize: (windowWidth/15).toString()
      }
      this.circleNoteParamsCard = mobileParams;
    } else{
      this.circleNoteParamsPlace = {
        radius: 70,
        strokeWidth: 2,
        subtitleFontSize: (windowWidth/50).toString(),
        titleFontSize: (windowWidth/25).toString()
      }
      this.circleNoteParamsCard = desktopParams;
    }
  }

  setPlaceInfo(id: string){
    const user: string = localStorage.getItem("id");
    this.dataService.getLikesOfUser(user).subscribe((res: Liked[]) => {
      const find = res.find((element: Liked) => element.id_place === id);
      if(find != null)  this.like = true;
    });
    this.dataService.getPlaceById(id).subscribe(res => {
      this.place = res;
      if(this.place.note_quantity != null) this.typeOfPlace = "Restaurant";
      else  this.typeOfPlace = "Bar";
      this.setRandomPositionNotes(4);
      this.setAllPlacesInfos(this.place);
      this.dataService.getStationsOfPlace(id).subscribe((res: Station[]) => {
        this.stations.push(...res);
        this.getStations.next(true);
      });
      this.dataService.getLignesOfPlace(id).subscribe((lignes: Ligne[]) => {
        this.lignes.push(...lignes);
        this.getLignes.next(true);
      })
      this.dataService.getPicturesOfPlace(id).subscribe(res => {
        if(res.length === 0 ){
          const iconType = this.placeService.getTypeIcon(this.place.type);
          this.pictures.push({
            id: "",
            id_place: "",
            src: iconType
          });
        }
      });
      this.setColorNote(Number(this.place.note_globale));
      this.urlArrondissement = "assets/arrondissement_" + this.place.arrondissement +".jpg";
      if(this.place.tested) this.percent = Number(this.place.note_globale) * 10;
      else this.percent = this.place.note_globale * 20;
    });
    this.dataService.getCommentOfPlace(id).subscribe((comments: Comment[]) => {
      comments.forEach((comment: Comment) => {
        if(comment.positif === 'true') this.positifComments.push(comment.detail);
        else  this.negatifComments.push(comment.detail);
      });
    });
    this.dataService.getHorairesOfPlace(id).subscribe((horaires: Horaires[]) => {
      this.horaires = horaires;
    });
    this.dataService.getAddressOfPlace(id).subscribe((addresses: Address[]) => {
      this.addresses = addresses;
    });
  }

  setAllPlacesInfos(place: any){
    if(this.typeOfPlace === "Restaurant"){
      this.dataService.getRestaurantsByType(place.type).subscribe((restaurants: Restaurant[]) => {
        restaurants.forEach((element: Restaurant,index: number) => {
          if(element.id === place.id) restaurants.splice(index,1);
        });
        restaurants = this.placeService.removeDuplicate(restaurants);
        
        this.setCardParams(restaurants,"type");
  
      });
      this.dataService.getRestaurantsByArrondissement(place.arrondissement).subscribe((restaurants: Restaurant[]) => {
        restaurants.forEach((element: Restaurant,index: number) => {
          if(element.id === place.id) restaurants.splice(index,1);
        });
        restaurants = this.placeService.removeDuplicate(restaurants);
        this.setCardParams(restaurants,"arrondissement");
      });
      this.getStations.subscribe(() => {
        this.dataService.getRestaurantsOfMultipleStations(this.stations).subscribe((res: any[]) => {
          this.setCardParams(res,"station");
        });
      });
      this.getLignes.subscribe(() => {
        this.dataService.getRestaurantsOfMultipleLignes(this.lignes).subscribe((res: any[]) => {
          this.setCardParams(res,"ligne");
        });
      });
    }
    else{
      this.dataService.getBarByType(place.type).subscribe((bars: Bar[]) => {
        bars.forEach((element: Bar,index: number) => {
          if(element.id === place.id) bars.splice(index,1);
        });
        bars = this.placeService.removeDuplicate(bars);
        this.setCardParams(bars,"type");
  
      });
      this.dataService.getBarByArrondissement(place.arrondissement).subscribe((bars: Bar[]) => {
        bars.forEach((element: Bar,index: number) => {
          if(element.id === place.id) bars.splice(index,1);
        });
        bars = this.placeService.removeDuplicate(bars);
        this.setCardParams(bars,"arrondissement");
      });
    }
  }

  setCardParams(data: any[], type: string){
    this.cardParamsSameArrondissement = [];
    this.cardParamsSameStation = [];
    this.cardParamsSameLigne = [];
    this.cardParamsSimilarPlaces = [];

    if(type === "arrondissement"){
      this.cardParamsSameArrondissement = [];
    }
    else if(type === "ligne") {
      this.cardParamsSameLigne = [];
    }
    else if(type === "station"){
      this.cardParamsSameStation = [];
    }
    else if(type === "type")  this.cardParamsSimilarPlaces = [];

    data.forEach((place: Bar) => {
      let statInPlace: Station[] = [];
      let lignesInStat: Ligne[] = [];
      let params: CardParams = {
        pictures: [],
        circleNoteParams: this.circleNoteParamsCard,
        stationsInPlace: [],
        lignesInStation: [],
        addresses: [],
        horaires: [],
        data: place
      }
      this.dataService.getStationsOfPlace(place.id).subscribe(res => {
        statInPlace.push(...res);
        params.stationsInPlace = statInPlace;
        res.forEach((station: Station,index: number) => {
          this.dataService.getLignesOfStation(station.name).subscribe((ligne: Ligne[]) => {
            lignesInStat.push(...ligne);
            params.lignesInStation = lignesInStat;
            this.dataService.getPicturesOfPlace(place.id).subscribe(pic => {
              params.pictures = pic;
              if(type === "arrondissement" && index === res.length -1){
                this.cardParamsSameArrondissement.push(params);
              }
              else if(type === "ligne" && index === res.length -1){
                this.cardParamsSameLigne.push(params);
              }
              else if(type === "station" && index === res.length -1){
                this.cardParamsSameStation.push(params);
              }
              else if(type === "type" && index === res.length -1){
                this.cardParamsSimilarPlaces.push(params);
              }
            });
          });
        });
      });
    });
  }

  changeIcon(){
    if(this.heart === regularHeart){
      this.heart = solidHeart;
      this.dataService.addLike({
        id: "",
        id_place: this.place.id,
        id_user: localStorage.getItem("id")
      });
    }
    else{
      this.dataService.deleteLike({
        id: "",
        id_place: this.place.id,
        id_user: localStorage.getItem("id")
      })
      this.heart = regularHeart;
    }
  }

  test(e:any){
    console.log(e);
  }

  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

  setColorNote(note: number){
    if(note >= 8) this.colorNote = "#38761D";
    else if(note < 8 && note >= 7) this.colorNote = "#01110A";
    else if(note < 7 && note >= 5.5) this.colorNote = "#eba75f";
    else if(note < 5.5) this.colorNote = "#9a0000";
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(this.storageService.keys.PLACEDETAILS);
  }

  scrollRight(element: string) {
    if(this.clickHandler){
      this.clickHandler = false;
      setTimeout(() => {
        this.clickHandler = true;
      },500);
      let nbElement = 0;
      let position = 0;
      if(element === "results"){
        nbElement = this.cardParamsSimilarPlaces.length;
        position = this.positionResult; 
      }
      else if(element === "ligne"){
        nbElement = this.cardParamsSameLigne.length;
        position = this.positionLigne;
      }
      else if(element === "station"){
        nbElement = this.cardParamsSameStation.length;
        position = this.positionStation;
      }
      else if(element === "arrondissement"){
        nbElement = this.cardParamsSameArrondissement.length;
        position = this.positionArrondissement;
      }

      const results = document.getElementById(element);
      if(results){
        const distance = Math.trunc(results.scrollWidth/nbElement);
        if(position + 2*distance <= results.scrollWidth){
          position += distance;
          results.scrollBy({
            left: distance,
            behavior: 'smooth'        
          });
        }
      }
      if(element === "results"){
        this.positionResult = position; 
      }
      else if(element === "ligne"){
        this.positionLigne = position;
      }
      else if(element === "station"){
        this.positionStation = position;
      }
      else if(element === "arrondissement"){
        this.positionArrondissement = position;
      }
    }
  }
  scrollLeft(element: string) {
    if(this.clickHandler){
      this.clickHandler = false;
      setTimeout(() => {
        this.clickHandler = true;
      },500);
      let nbElement = 0;
      let position = 0;
      if(element === "results"){
        nbElement = this.cardParamsSimilarPlaces.length;
        position = this.positionResult; 
      }
      else if(element === "ligne"){
        nbElement = this.cardParamsSameLigne.length;
        position = this.positionLigne;
      }
      else if(element === "station"){
        nbElement = this.cardParamsSameStation.length;
        position = this.positionStation;
      }
      else if(element === "arrondissement"){
        nbElement = this.cardParamsSameArrondissement.length;
        position = this.positionArrondissement;
      }
      const results = document.getElementById(element);
      if(results){
        const distance = Math.trunc(results.scrollWidth/nbElement);
        if(position - distance >= 0){
          position -= distance;
          results.scrollBy({
            left: -distance,
            behavior: 'smooth'
          });
        }
      }
      if(element === "results"){
        this.positionResult = position; 
      }
      else if(element === "ligne"){
        this.positionLigne = position;
      }
      else if(element === "station"){
        this.positionStation = position;
      }
      else if(element === "arrondissement"){
        this.positionArrondissement = position;
      }
    }
  }
  setRandomPositionNotes(nbLigne: number){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      for(let element = 0; element <= nbLigne; element ++){
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (70 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPositionNotes.forEach((e: any) => {
            if((e.left - 10 < left && left < e.left + 10) && (e.top - 3 < top && top < e.top + 3)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPositionNotes.push({
          left: left,
          top: top
        });
        this.randomAnimationNotes.push({
          x: x,
          y: y
        }) 
      }
    } else{
      for(let element = 0; element <= nbLigne; element ++){
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (80 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPositionNotes.forEach((e: any) => {
            if((e.left - 10 < left && left < e.left + 10) && (e.top - 9 < top && top < e.top + 9)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPositionNotes.push({
          left: left,
          top: top
        });
        this.randomAnimationNotes.push({
          x: x,
          y: y
        })
      }
    }
  }

  setRandomPosition(nbLigne: number){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      for(let element = 0; element <= nbLigne; element ++){
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (70 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPosition.forEach((e: any) => {
            if((e.left - 10 < left && left < e.left + 10) && (e.top - 3 < top && top < e.top + 3)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPosition.push({
          left: left,
          top: top
        });
        this.randomAnimation.push({
          x: x,
          y: y
        }) 
      }
    } else{
      for(let element = 0; element <= nbLigne; element ++){
        let itsOkay: boolean = true;
        let top = 0;
        let left = 0;
        let x = 0;
        let y = 0;
        do{
          itsOkay = true;
          left = Math.floor(Math.random() * (80 - 40)) + 40;
          top = Math.floor(Math.random() * (30 - 3)) + 3;
          x = Math.floor(Math.random() * (3 - (-3))) + (-3);
          y = Math.floor(Math.random() * (3 - (-3))) + (-3);
          this.randomPosition.forEach((e: any) => {
            if((e.left - 10 < left && left < e.left + 10) && (e.top - 9 < top && top < e.top + 9)) itsOkay = false;
          });
        }while(!itsOkay)
        this.randomPosition.push({
          left: left,
          top: top
        });
        this.randomAnimation.push({
          x: x,
          y: y
        })
      }
    }
  }
  
  reload(restaurant: any){
    this.router.navigate([`/showed/${restaurant.id}`]);
  }

  openMaps(address: Address){
    const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(address.address + ", " + address.code_postal);
    window.open(url);
  }

  cast(value: unknown){
    let toReturn = value as string;
    return toReturn;
  }

}
