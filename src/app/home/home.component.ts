import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User } from 'firebase/auth';
import { DatabaseService } from '../services/database.service';
import { UrlRequest } from '../shared/urlRequest';
import { Bar } from '../model/bar';
import { StationInPlace } from '../model/stationInPlace';
import { LigneInStation } from '../model/ligneInStation';
import { Pictures } from '../model/pictures';
import { Restaurant } from '../model/restaurant';
import { PlacesService } from '../services/places.service';
import { TypePicture } from '../model/typePicture';
import { CircleNoteParams } from '../model/circle-notes-params';
import { CardParams } from '../model/cardParams';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('openCloseDiv', [
      state('hidden', style({
        opacity: '0',
        width:"0%"
      })),
      state('hiddenFast', style({
        opacity: '1',
        width:"100%"
      })),
      state('showed', style({
        width:"100%",
        opacity: '1'
      })),
      transition('* => showed', [
        animate('1s ease-in')
      ]),
      transition('* => hidden', [
        animate('1s ease-in')
      ]),
      transition('* => hiddenFast', [
        animate('0s')
      ]),
    ]),
    trigger('openCloseResult', [
      state('hidden', style({
        opacity: '0',
        transform: 'scaleX(0)',
        width:"0%",
        height:"100%",
      })),
      state('half-showed', style({
        width:"100%",
        height:"100%",
        opacity: '1'
      })),
      state('showed', style({
        transform: 'scaleX(1)',
        opacity: '1'
      })),
      transition('* => showed', [
        animate('1s ease-in')
      ]),
      transition('* => hidden', [
        animate('1s ease-in')
      ]),
      transition('* => half-showed', [
        animate('1s ease-in')
      ]),
    ]),
    trigger('showTitle', [
      state('show', style({
        opacity: '1'
      })),
      transition('* => show', [
        animate('2s ease')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
    private data: DatabaseService,
    private place: PlacesService
  ) {}

  user!: User |null;
  searchTerm: string = "";
  allPlaces: any[] = [];
  priorityRestaurant: Restaurant[] = [];
  lignesOfStationBestBar: LigneInStation[] = [];
  lignesOfStationPriorityRestaurant: LigneInStation[] = [];
  lignesOfStationPriorityBar: LigneInStation[] = [];
  picturesOfPlaceBestBar: Pictures[] = [];
  picturesOfPlacePriorityRestaurant: Pictures[] = [];
  picturesOfPlacePriorityBar: Pictures[] = [];
  allStationInPlaceBestBar: StationInPlace[] = [];
  allStationInPlacePriorityRestaurant: StationInPlace[] = [];
  allStationInPlacePriorityBar: StationInPlace[] = [];



  bestBar: Bar[] = [];
  priorityBar: Bar[] = [];
  filteredData : any[] = [];

  cardParamsResearch: CardParams[] = [];
  cardParamsBestRestaurant: CardParams[] = [];
  cardParamsBestBar: CardParams[] = [];
  cardParamsPriorityRestaurant: CardParams[] = [];
  cardParamsPriorityBar: CardParams[] = [];


  allStationInPlaceResearch: StationInPlace[] = [];
  lignesOfStationResearch: LigneInStation[] = [];
  picturesOfPlaceResearch: Pictures[] = [];

  circleNoteParams !: CircleNoteParams;
  

  /// Circle grade properties
  titleFontSize: string = "";
  subtitleFontSize: string = "";
  radius: number = 0;
  strokeWidth: number = 1;

  enable: boolean = false;
  position : number = 0;
  animationFilterDiv: string = "hidden";
  animationFilterResult: string = "hidden";


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('title')  title!: any;
  titlesAnimation: string[] = ['','','',''];
  allPictures: any[] = [];
  randomPosition: any[] = [];


  ngOnInit(): void {
    this.getData();
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.radius = 15;
      this.titleFontSize = (windowWidth/35).toString();
      this.subtitleFontSize = (windowWidth/45).toString();  
      this.strokeWidth = 0.5
    } else{
      this.radius = 30;
      this.titleFontSize = (windowWidth/60).toString();
      this.subtitleFontSize = (windowWidth/100).toString();  
    }
    this.setRandomPosition();
    this.circleNoteParams = {
      radius: this.radius,
      strokeWidth: this.strokeWidth,
      subtitleFontSize: this.subtitleFontSize,
      titleFontSize: this.titleFontSize
    }
  }

  getData(){
    this.data.getAllPlaces().subscribe(res => {
      this.allPlaces = res;
    });
    this.data.getBestNotesRestaurant(true,UrlRequest.NOTE_GLOBALE).subscribe((bestRestau: Restaurant[]) => {
      this.setCardParams(bestRestau,"bestRestaurant");
    });
    this.data.getBestNotesRestaurant(false,UrlRequest.NOTE_GLOBALE).subscribe((prioRestau: Restaurant[]) => {
      this.setCardParams(prioRestau,"priorityRestaurant");
    });
    this.data.getBestNotesBar(true,UrlRequest.NOTE_GLOBALE).subscribe((bestBar: Bar[]) => {
      this.setCardParams(bestBar,"bestBar");
    });
    this.data.getBestNotesBar(false,UrlRequest.NOTE_GLOBALE).subscribe((prioBar: Bar[]) => {
      this.setCardParams(prioBar,"priorityBar");
    });
    this.data.getAllPictures().subscribe(res => {
      this.allPictures = res;
    });
  }

  getTypeUrl(type: string){
    const typeUrl: string = this.place.getTypeFacade(type);
    return typeUrl;
  }
  ngAfterViewInit(): void {
    this.setAnimation();
  }

  setAnimation(): void {
      if(this.title != null){
        window.addEventListener("scroll", (event)=>{
          let positionBotton = window.pageYOffset + window.innerHeight;
          this.title.forEach((element:any) => {
            let index = 0;
            switch(element.nativeElement.id){
              case 'title1': index = 0;
              break;
              case 'title2': index = 1;
              break;
              case 'title3': index = 2;
              break;
              case 'title4': index = 3;
              break;
            }
            if(positionBotton > element.nativeElement.offsetTop + window.innerHeight * 0.07){
              this.titlesAnimation[index] = "show";
            }
          });
        });
      }    
  }

  setRandomPosition(){
    this.allPictures.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  filter(searchTerm: string) {
    this.enable = false;
    this.position = 0;
    let filter: Bar[] = []
    const results = document.getElementById('results')!;
    results.scrollBy({
      left: -results.scrollWidth
    });
    this.animationFilterResult = "hidden";
    const beforeLength = this.filteredData.slice().length;
    if(searchTerm.length === 0) filter = [];
    else{
      filter = this.allPlaces.filter((element: Bar) => {
        const name: string = element.name.toLowerCase();
        if(name.includes(searchTerm.toLowerCase()))  return true;
        else  return false;
      });
    }
    const afterLength = filter.slice().length;
    if(beforeLength >= 1){
      setTimeout(() => {
        this.filteredData = filter;

        if(afterLength >= 2) this.animationFilterResult = "showed";
        else if(afterLength === 1){
          this.filteredData = filter;
          this.animationFilterResult = "half-showed";
        }
        else{
          this.animationFilterDiv = "hidden";
        }
        this.enable = true;
        this.setCardParams(this.filteredData,"research");
      }, 1000)
    }
    else{
      if(afterLength === 1){
        this.animationFilterDiv = "hiddenFast";
        setTimeout(() => {
          this.filteredData = filter;
          this.setCardParams(this.filteredData,"research");
          this.animationFilterResult = "half-showed";
          this.enable = true;
        },100)
      }

      else if(afterLength >= 2){
        this.animationFilterDiv = "hiddenFast";
        this.filteredData = filter;
        this.animationFilterDiv = "showed";
        this.animationFilterResult = "showed";
        this.enable = true;
        this.setCardParams(this.filteredData,"research");
      }
      else {
        this.filteredData = filter;
        this.setCardParams(this.filteredData,"research");
        setTimeout(() => {
          this.animationFilterDiv = "hidden";
          this.enable = true;
        },1000);
      }
    }    
  }

  setCardParams(data: any[], type: string){
    if(type === "research") this.cardParamsResearch = [];
    else if(type === "bestRestaurant")  this.cardParamsBestRestaurant = [];
    else if(type === "bestBar")  this.cardParamsBestBar = [];
    else if(type === "priorityRestaurant")  this.cardParamsPriorityRestaurant = [];
    else if(type === "priorityBar")  this.cardParamsPriorityBar = [];

    data.forEach((place: Bar) => {
      let statInPlace: StationInPlace[] = [];
      let lignesInStat: LigneInStation[] = [];
      let params: CardParams = {
        pictures: [],
        circleNoteParams: this.circleNoteParams,
        stationsInPlace: [],
        lignesInStation: [],
        addresses: [],
        horaires: [],
        data: place
      }
      this.data.getStationsOfPlace(place.id).subscribe(res => {
        statInPlace.push(...res);
        params.stationsInPlace = statInPlace;
        res.forEach((station: StationInPlace,index: number) => {
          this.data.getLignesOfStation(station.name_station).subscribe((ligne: LigneInStation[]) => {
            lignesInStat.push(...ligne);
            params.lignesInStation = lignesInStat;
            this.data.getPicturesOfPlace(place.id).subscribe((pic:Pictures[]) => {
              params.pictures = pic;
              if(type === "research" && index === res.length -1){
                this.cardParamsResearch.push(params);
              }
              else if(type === "bestRestaurant" && index === res.length -1){
                this.cardParamsBestRestaurant.push(params);
              }
              else if(type === "bestBar" && index === res.length -1){
                this.cardParamsBestBar.push(params);
              }
              else if(type === "priorityRestaurant" && index === res.length -1){
                this.cardParamsPriorityRestaurant.push(params);
              }
              else if(type === "priorityBar" && index === res.length -1){
                this.cardParamsPriorityBar.push(params);
              }
            });
          });
        });
      });
    });
  }

  scrollRight(element: string) {
    let nbElement = 0;
    if(element === "bestCard" || element === "priorityCard")  nbElement = 5;
    else if(element === "results") nbElement = this.filteredData.length;
    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(this.position + 2*distance <= results.scrollWidth){
        this.position += distance;
        results.scrollBy({
          left: distance,
          behavior: 'smooth'        
        });
      }
    }
  }

  scrollLeft(element: string) {
    let nbElement = 0;
    if(element === "bestCard" || element === "priorityCard")  nbElement = 5;
    else if(element === "results") nbElement = this.filteredData.length;
    const results = document.getElementById(element);
    if(results){
      const distance = Math.trunc(results.scrollWidth/nbElement);
      if(this.position - distance >= 0){
        this.position -= distance;
        results.scrollBy({
          left: -distance,
          behavior: 'smooth'
        });
      }
    }
  }

}
