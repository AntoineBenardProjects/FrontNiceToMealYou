import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { AuthService } from '../services/auth.service';
import { PlacesService } from '../services/places.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { DatabaseService } from '../services/database.service';
import { LigneInStation } from '../model/ligneInStation';
import { StationInPlace } from '../model/stationInPlace';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { Bar } from '../model/bar';
import { Comment } from '../model/comment';
import { Address } from '../model/address';
import { Restaurant } from '../model/restaurant';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';


@Component({
  selector: 'app-showed',
  templateUrl: './showed.component.html',
  styleUrls: ['./showed.component.scss']
})
export class ShowedComponent implements OnInit, OnDestroy {

  place!: Restaurant;
  pictures: Pictures[] = [];
  addresses: Address[] = [];
  stations: StationInPlace[] = [];
  lignes: LigneInStation[] = [];
  horaires: Horaires[] = [];
  positifComments: string[] = [];
  negatifComments: string[] = [];
  
  cardParamsSimilarPlaces : CardParams[] = [];
  cardParamsSameLigne: CardParams[] = [];
  cardParamsSameStation: CardParams[] = [];
  cardParamsSameArrondissement: CardParams[] = [];

  positionResult : number = 0;
  positionLigne : number = 0;;
  positionStation : number = 0;
  positionArrondissement : number = 0;

  user!: User | null;
  colorNote: string = "";
  percent: number = 0;

  station: string = "Aucun";
  urlArrondissement: string = "";
  darkenMetroBackground: boolean = false;
  darkenArrondissementBackground: boolean = true;
  colorArrondissementTitle: string = "#ffffff";
  colorMetroTitle: string = "#ffffff";

  circleNoteParamsCard!: CircleNoteParams;
  circleNoteParamsPlace!: CircleNoteParams;

  randomPosition: any[] = [];
  randomAnimation: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private storageService: StorageService, 
    private dataService: DatabaseService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private authService: AuthService,
    private placeService: PlacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setCircleNoteParams();
    if(localStorage.getItem("role") === "Admin")  this.isAdmin = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.setPlaceInfo(id);
      this.storageService.setSession(this.storageService.keys.PLACEDETAILS,id);
    });

    if(this.darkenArrondissementBackground) this.colorArrondissementTitle = "000";
    if(this.darkenMetroBackground)  this.colorMetroTitle = "000";
  }

  setCircleNoteParams(){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.circleNoteParamsPlace = {
        radius: 50,
        strokeWidth: 0.5,
        subtitleFontSize: (windowWidth/25).toString(),
        titleFontSize: (windowWidth/15).toString()
      }
      this.circleNoteParamsCard = {
        radius: 15,
        strokeWidth: 0.5,
        subtitleFontSize: (windowWidth/60).toString(),
        titleFontSize: (windowWidth/45).toString()
      }
    } else{
      this.circleNoteParamsPlace = {
        radius: 70,
        strokeWidth: 0.5,
        subtitleFontSize: (windowWidth/50).toString(),
        titleFontSize: (windowWidth/25).toString()
      }
      this.circleNoteParamsCard = {
        radius: 25,
        strokeWidth: 0.5,
        subtitleFontSize: (windowWidth/100).toString(),
        titleFontSize: (windowWidth/60).toString()
      }
    }
  }

  setPlaceInfo(id: string){
    let allPlacesNear: Restaurant[] = [];
    let allPlacesLigne: Restaurant[] = [];

    this.dataService.getPlaceById(id).subscribe(res => {
      this.place = res;
      this.setAllPlacesInfos(this.place);
      this.dataService.getStationsOfPlace(id).subscribe((res: StationInPlace[]) => {
        this.stations.push(...res);
        res.forEach((station: StationInPlace,index: number) => {
          this.dataService.getPlacesByStation(station.name_station,id).subscribe((places: Restaurant[]) => {
            allPlacesNear.push(...places);
            if(index === res.length -1) this.setCardParams(allPlacesNear, "station");
          });
          this.dataService.getLignesOfStation(station.name_station).subscribe((lignes: LigneInStation[]) => {
            this.lignes.push(...lignes);
            if(index === res.length -1){
              this.setRandomPosition();
              this.lignes.forEach((ligne: LigneInStation, i: number) => {
                this.dataService.getPlacesByLigne(ligne.name_ligne,id).subscribe((places: Restaurant[]) => {
                  allPlacesLigne.push(...places);
                  if(i === res.length -1){
                    allPlacesLigne = this.placeService.removeDuplicate(allPlacesLigne);
                    this.setCardParams(allPlacesLigne, "ligne");
                  }
                });
              });
            }
          });
        });
      });
      this.setColorNote(Number(this.place.note_globale));
      this.urlArrondissement = "assets/arrondissement_" + this.place.arrondissement +".jpg";
      if(this.place.tested) this.percent = Number(this.place.note_globale) * 10;
      else this.percent = this.place.note_globale * 20;
    });
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
    this.dataService.getCommentOfPlace(id).subscribe((comments: Comment[]) => {
      comments.forEach((comment: Comment) => {
        if(comment.positif) this.positifComments.push(comment.detail);
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

  setAllPlacesInfos(place: Restaurant){
    if(place.the_fork !== null){
      this.dataService.getRestaurantsByType(place.type).subscribe((restaurants: Restaurant[]) => {
        this.setCardParams(restaurants,"type");
      });
      this.dataService.getRestaurantsByArrondissement(place.arrondissement).subscribe((restaurants: Restaurant[]) => {
        this.setCardParams(restaurants,"arrondissement");
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
      console.log(data)
      this.cardParamsSameLigne = [];
    }
    else if(type === "station"){
      this.cardParamsSameStation = [];
    }
    else if(type === "type")  this.cardParamsSimilarPlaces = [];

    data.forEach((place: Bar) => {
      let statInPlace: StationInPlace[] = [];
      let lignesInStat: LigneInStation[] = [];
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
        res.forEach((station: StationInPlace,index: number) => {
          this.dataService.getLignesOfStation(station.name_station).subscribe((ligne: LigneInStation[]) => {
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


  test(e:any){
    console.log(e);
  }

  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

  setColorNote(note: Number){
    if(note >= 8) this.colorNote = "#38761D";
    else if(note < 8 && note >= 7) this.colorNote = "black";
    else if(note < 7 && note >= 5.5) this.colorNote = "#eba75f";
    else if(note < 5.5) this.colorNote = "#9a0000";
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(this.storageService.keys.PLACEDETAILS);
  }

  scrollRight(element: string) {
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
  scrollLeft(element: string) {
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

  setRandomPosition(){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.lignes.forEach((element:any) => {
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
            if((e.left - 21 < left && left < e.left + 21) && (e.top - 3 < top && top < e.top + 3)) itsOkay = false;
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
      });
    } else{
      this.lignes.forEach((element:any) => {
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
            if((e.left - 18 < left && left < e.left + 18) && (e.top - 9 < top && top < e.top + 9)) itsOkay = false;
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
      });
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
