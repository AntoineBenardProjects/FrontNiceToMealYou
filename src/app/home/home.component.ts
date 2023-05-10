import { Component, OnInit, ViewChildren } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DatabaseService } from '../services/database.service';
import { UrlRequest } from '../shared/urlRequest';
import { Bar } from '../model/bar';
import { Pictures } from '../model/pictures';
import { Restaurant } from '../model/restaurant';
import { CircleNoteParams } from '../model/circle-notes-params';
import { CardParams } from '../model/cardParams';
import { Subject } from 'rxjs';
import { Station } from '../model/station';
import { Ligne } from '../model/ligne';
import { desktopParams, mobileParams } from '../shared/circleNoteParams';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('resultDiv', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
    ]),
    trigger('button', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
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

  constructor(
    private data: DatabaseService,
  ) {}

  protected searchTerm: string = "";
  protected allPlaces: any[] = [];
  private getBestRestaurant: Subject<boolean> = new Subject();
  private getBestBar: Subject<boolean> = new Subject();
  private getPriorityRestaurant: Subject<boolean> = new Subject();
  private getPriorityBar: Subject<boolean> = new Subject();
  private getStationPlaces: Subject<boolean> = new Subject();
  protected getAllData: boolean = false;

  private filteredData : Bar[] = [];
  private clickHandler: boolean = true;
  protected animationState: string = "hidden";
  protected buttonAnimationState: string = "hidden";
  protected show: boolean = false;
  private init: boolean = true;
  private triggerAnimationInit: Subject<boolean> = new Subject();
  private position: number = 0;

  protected cardParamsResearch: CardParams[] = [];
  protected cardParamsBestRestaurant: CardParams[] = [];
  protected cardParamsBestBar: CardParams[] = [];
  protected cardParamsPriorityRestaurant: CardParams[] = [];
  protected cardParamsPriorityBar: CardParams[] = [];
  protected cardParamsStationPlaces: CardParams[] = [];
  private circleNoteParams !: CircleNoteParams;
  


  @ViewChildren('title')  title!: any;
  titlesAnimation: string[] = ['','','',''];
  allPictures: any[] = [];
  randomPosition: any[] = [];


  ngOnInit(): void {
    this.getData();
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    if(windowHeight > windowWidth){
      this.circleNoteParams = mobileParams;
    } else{
      this.circleNoteParams = desktopParams;
    }
    this.setRandomPosition();
  }

  getData(){
    let count: number = 0;
    let nbData: number = 0;
    

    this.data.getAllPlaces().subscribe(res => {
      this.allPlaces = res;
    });
    this.data.getBestNotesRestaurant(true,UrlRequest.NOTE_GLOBALE).subscribe((bestRestau: Restaurant[]) => {
      if(bestRestau.length === 5){
        nbData++;
        this.setCardParams(bestRestau,"bestRestaurant");
      }
    });
    this.data.getBestNotesRestaurant(false,UrlRequest.NOTE_GLOBALE).subscribe((prioRestau: Restaurant[]) => {
      if(prioRestau.length === 5){
        nbData++;
        this.setCardParams(prioRestau,"priorityRestaurant");
      }
    });
    this.data.getBestNotesBar(true,UrlRequest.NOTE_GLOBALE).subscribe((bestBar: Bar[]) => {
      if(bestBar.length === 5){
        nbData++;
        this.setCardParams(bestBar,"bestBar");
      }
    });
    this.data.getBestNotesBar(false,UrlRequest.NOTE_GLOBALE).subscribe((prioBar: Bar[]) => {
      if(prioBar.length === 5){
        nbData++;
        this.setCardParams(prioBar,"priorityBar");
      }
    });
    this.data.getPlacesOfFavoriteStations(localStorage.getItem("id")).subscribe((places: any[]) => {
      if(places.length === 5){
        nbData++;
        this.setCardParams(places,"stationPlaces");
      }
    })
    this.data.getAllPictures().subscribe(res => {
      this.allPictures = res;
    });


    this.getBestRestaurant.subscribe((res: boolean) => {
      count++;
      this.cardParamsBestRestaurant.push(...this.cardParamsBestRestaurant);
      if(count === nbData){
        setTimeout(() => {
          this.getAllData = true;
        },1000);
      }    
    });
    this.getBestBar.subscribe((res: boolean) => {
      count++;
      this.cardParamsBestBar.push(...this.cardParamsBestBar);
      if(count === nbData){
        setTimeout(() => {
          this.getAllData = true;
        },1000);
      }
    });
    this.getPriorityRestaurant.subscribe((res: boolean) => {
      count++;
      this.cardParamsPriorityRestaurant.push(...this.cardParamsPriorityRestaurant);
      if(count === nbData){
        setTimeout(() => {
          this.getAllData = true;
        },1000);
      }    
    });
    this.getPriorityBar.subscribe((res: boolean) => {
      count++;
      this.cardParamsPriorityBar.push(...this.cardParamsPriorityBar);
      if(count === nbData){
        setTimeout(() => {
          this.getAllData = true;
        },1000);
      }
    });
    this.getStationPlaces.subscribe((res: boolean) => {
      count++;
      this.cardParamsStationPlaces.push(...this.cardParamsStationPlaces);
      if(count === nbData){
        setTimeout(() => {
          this.getAllData = true;
        },1000);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setAnimation();
  }

  setAnimation(): void {
      if(this.title != null){
        window.addEventListener("scroll", (event)=>{
          let positionBotton = window.pageYOffset + window.innerHeight;
          this.title.forEach((element:any) => {
            const elementId = element.nativeElement.id;
            const index: number = Number(element.nativeElement.id.substring(elementId.length-1,elementId.length)) -1 ;
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
    let beforeLength: number = this.filteredData.slice().length;
    let filter: Bar[] = [];
    this.filteredData = [];
    if(searchTerm.length === 0) filter = [];
    else{
      filter = this.allPlaces.filter((element: Bar) => {
        const name: string = element.name.toLowerCase();
        if(name.includes(searchTerm.toLowerCase()))  return true;
        else  return false;
      });
    }
    const afterLength = filter.slice().length;
    filter.sort((a,b) => {
      if(a.note_globale > b.note_globale){
        return -1;
      } else  return 1;
    });
    this.filteredData = filter;
    if(afterLength > 0){
      if(beforeLength > 0){
        this.animationState = "hidden";
        setTimeout(() => {
          this.cardParamsResearch = null;
          this.setCardParams(filter,"research");
          this.animationState = "show";
          if(afterLength > 2) this.buttonAnimationState = "show";
          else  this.buttonAnimationState = "hidden"; 
        }, 2000);
      } else{
        this.setCardParams(filter,"research");
        this.animationState = "hidden";
        this.triggerAnimationInit.subscribe(() => {
          setTimeout(() => {
            if(afterLength > 2) this.buttonAnimationState = "show";
          else  this.buttonAnimationState = "hidden"; 
            this.animationState = "show";
          },500);
        });
      }
    }
    else{
      this.animationState = "hidden";
      setTimeout(() => {
        this.show = false;
        this.init = true;
      },2000)
    }
  }

  setCardParams(data: any[], type: string){
    if(type === "research") this.cardParamsResearch = [];
    else if(type === "bestRestaurant")  this.cardParamsBestRestaurant = [];
    else if(type === "bestBar")  this.cardParamsBestBar = [];
    else if(type === "priorityRestaurant")  this.cardParamsPriorityRestaurant = [];
    else if(type === "priorityBar")  this.cardParamsPriorityBar = [];
    else if(type === "stationPlaces")  this.cardParamsStationPlaces = [];

    if(data.length === 0){
      if(type === "bestRestaurant"){
        this.getBestRestaurant.next(true);
      }
      else if(type === "bestBar"){
        this.getBestBar.next(true);
      }
      else if(type === "priorityRestaurant"){
        this.getPriorityRestaurant.next(true);
      }
      else if(type === "priorityBar"){
        this.getPriorityBar.next(true);
      }
      else if(type === "stationPlaces"){
        this.getStationPlaces.next(true);
      }
    }
    data.forEach((place: Bar, i: number) => {
      let statInPlace: Station[] = [];
      let lignesInStat: Ligne[] = [];
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
        res.forEach((station: Station,index: number) => {
          this.data.getLignesOfStation(station.name).subscribe((ligne: Ligne[]) => {
            lignesInStat.push(...ligne);
            params.lignesInStation = lignesInStat;
            this.data.getPicturesOfPlace(place.id).subscribe((pic:Pictures[]) => {
              params.pictures = pic;
              if(type === "research" && index === res.length -1){
                this.cardParamsResearch.push(params);
                if(this.init){
                  this.show = true;
                  this.init = false;
                  this.triggerAnimationInit.next(true);
                }
              }
              else if(type === "bestRestaurant" && index === res.length -1){
                this.cardParamsBestRestaurant.push(params);
                if(this.cardParamsBestRestaurant.length === 5)  this.getBestRestaurant.next(true);
              }
              else if(type === "bestBar" && index === res.length -1){
                this.cardParamsBestBar.push(params);
                if(this.cardParamsBestBar.length === 5)  this.getBestBar.next(true);
              }
              else if(type === "priorityRestaurant" && index === res.length -1){
                this.cardParamsPriorityRestaurant.push(params);
                if(this.cardParamsPriorityRestaurant.length  === 5)  this.getPriorityRestaurant.next(true);
              }
              else if(type === "priorityBar" && index === res.length -1){
                this.cardParamsPriorityBar.push(params);
                if(this.cardParamsPriorityBar.length === 5)  this.getPriorityBar.next(true);
              }
              else if(type === "stationPlaces" && index === res.length -1){
                this.cardParamsStationPlaces.push(params);
                if(this.cardParamsStationPlaces.length === 5){
                  this.getStationPlaces.next(true);
                }
              }
            });
          });
        });
      });
    });
  }

  scrollRight() {
    if(this.clickHandler){
      this.clickHandler = false;
      setTimeout(() => {
        this.clickHandler = true;
      },500);
      let nbElement = 0;
      let position = 0;
      nbElement = this.cardParamsResearch.length;
      position = this.position;
  
      const results = document.getElementById('results');
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
      this.position = position;
    }
  }
  scrollLeft() {
    if(this.clickHandler){
      this.clickHandler = false;
      setTimeout(() => {
        this.clickHandler = true;
      },500);
      let nbElement = 0;
      let position = 0;
      nbElement = this.cardParamsResearch.length;
      position = this.position;
      const results = document.getElementById('results');
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
      this.position = position; 
    }
  }

}
