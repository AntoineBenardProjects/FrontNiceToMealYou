import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { PlacesService } from '../services/places.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { CircleNoteParams } from '../model/circle-notes-params';
import { Subject, Subscription } from 'rxjs';
import { desktopParams, mobileParams } from '../shared/circleNoteParams';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { SelectData, SelectInfos } from '../shared/model/designs';
import { Place } from '../model/places';



@Component({
  selector: 'app-showed',
  templateUrl: './showed.component.html',
  styleUrls: ['./showed.component.scss']
})
export class ShowedComponent implements OnInit, OnDestroy {

  protected place!: Place;
  protected pictures: Pictures[] = [];
  protected addresses: SelectData[] = [];
  protected types: SelectData[] = [];
  protected lignes: SelectData[] = [];
  protected stations: SelectData[] = [];
  protected comments: SelectData[] = [
    {id: "Positif", name: "Positif"},
    {id: "Négatif", name: "Négatif"}
  ];
  protected horaires: Horaires[] = [];
  protected comment: string[] = [];
  protected positifComments: string[] = [];
  protected negatifComments: string[] = [];
  protected typeOfPlace: string = "";
  protected getStations: Subject<boolean> = new Subject();
  protected getLignes: Subject<boolean> = new Subject();

  
  protected cardParamsSimilarPlaces : any[] = [];
  protected cardParamsSameLigne: any[] = [];
  protected cardParamsSameStation: any[] = [];
  protected cardParamsSameArrondissement: any[] = [];

  private clickHandler: boolean = true;
  private positionResult : number = 0;
  private positionLigne : number = 0;;
  private positionStation : number = 0;
  private positionArrondissement : number = 0;

  protected colorNote: string = "";
  protected percent: number = 0;

  protected station: string = "Aucun";
  protected urlArrondissement: string = "";
  protected darkenMetroBackground: boolean = false;
  protected darkenArrondissementBackground: boolean = true;
  protected colorMetroTitle: string = "#ffffff";

  protected circleNoteParamsCard!: CircleNoteParams;
  protected circleNoteParamsPlace!: CircleNoteParams;

  protected randomPosition: any[] = [];
  protected randomPositionNotes: any[] = [];
  protected randomAnimation: any[] = [];
  protected randomAnimationNotes: any[] = [];

  protected isAdmin: boolean = false;
  protected isVisit: boolean = false;

  protected heart = regularHeart;
  protected like: boolean = false;

  protected toShow: string = "horaires";

  protected selectInfos: SelectInfos = {
    backgroundColor: 'var(--white)',
    textColor: 'var(--mainColor)',
    hoverBackgroundColor: 'var(--mainColor)',
    hoverTextColor: 'var(--white)',
  }

  constructor(
    private storageService: StorageService, 
    private dataService: DatabaseService,
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) {
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();


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
  }

  setAllPlacesInfos(place: any){

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
    this.themeSubscriber.unsubscribe();
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

  openMaps(address: string){
    const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(address);
    window.open(url);
  }

  cast(value: unknown){
    let toReturn = value as string;
    return toReturn;
  }

  selectionChange(event: SelectData[],toShow: string){
    this.toShow = toShow;
    this.cardParamsSameLigne = [];
    this.cardParamsSameStation = [];
    this.cardParamsSimilarPlaces = [];
    this.cardParamsSameArrondissement = [];
  }

}
