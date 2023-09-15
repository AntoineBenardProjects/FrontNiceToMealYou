import { Component, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { CheckboxInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { DatabaseService } from '../services/database.service';
import { Data } from 'src/data';
import { TypePicture } from '../model/typePicture';
import { Ligne, Station } from '../model/transports';
import { Place } from '../model/places';
import { PlacesService } from '../services/places.service';
import { Horaires } from '../model/horaires';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.scss']
})
export class FilterPageComponent {

  constructor(private elementRef: ElementRef,
    private themeService: ThemeService, 
    private placesService: PlacesService,
    private databaseService: DatabaseService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

//////////////////////////////////////////////  Transportbar  //////////////////////////////////////////////
  protected openTransportbar: boolean = true;
  protected iconTransportbar: string = "x";
  toggleBottombar(){
      this.openTransportbar = !this.openTransportbar;
      this.openTransportbar ? this.iconTransportbar = "x" : this.iconTransportbar = ">";
    }

//////////////////////////////////////////////  Categorybar  //////////////////////////////////////////////
  protected openCategorybar: boolean = true;
  protected iconCategorybar: string = "x";
  toggleSidebar(){
      this.openCategorybar = !this.openCategorybar;
      this.openCategorybar ? this.iconCategorybar = "x" : this.iconCategorybar = "<";
  }
  protected selectInfos: SelectInfos = {
    backgroundColor: 'transparent',
    textColor: 'var(--black)',
    optionTextColor: 'var(--black)',
    optionBackgroundColor: 'var(--white)',
    hoverBackgroundColor: 'var(--mainColor)',
    hoverTextColor: 'var(--black)',
    borderColor: 'transparent',
    borderColorActive: 'transparent',
    topHoverBorderColor: 'transparent',
    width: 10
  }
  protected checkboxInfos: CheckboxInfos = {
    color: "var(--secondColor)",
    hoverTextColor: 'var(--white)',
    hoverBackgroundColor: 'var(--secondColor)',
    hoverBorderColor: 'var(--secondColor)',
    hoverTextColorValid: 'var(--white)',
    hoverBackgroundColorValid: 'var(--thirdColor)',
    hoverBorderColorValid: 'var(--thirdColor)',
    backgroundColor: "transparent",
    borderColor: "var(--secondColor)",
    colorActive: "var(--thirdColor)",
    backgroundColorActive: "var(--transparent)",
    borderColorActive: "var(--thirdColor)"
  }
  protected categorySelect: SelectData[] = [];
  protected regionSelect: SelectData[] = [];
  protected lignesSelect: SelectData[] = [];
  protected stationsSelect: SelectData[] = [];
  protected transportsSelect: SelectData[] = [];
  protected typesSelect: SelectData[] = [];

  initOptions(){
    this.categorySelect = [
      {id: "res", name: "Restaurant"}
    ];
    this.databaseService.getAllRegion().subscribe((res: string[]) => {
      res.forEach((element: string) => {
        this.regionSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
    });
  }

  filter(event: any, filter: string){
    if(filter === "category"){
      this.typesSelect = [];
      this.type = "";
      const categorySelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      this.category = categorySelected;

      Data.forEach((type: TypePicture) => {
        if(categorySelected === type.place){
          const selectValue: SelectData = {
            id: type.type,
            name: type.type
          }
          this.typesSelect.push(selectValue);
        }
      });
      
      this.sort();
    }
    else if(filter === "type"){
      const typeSelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      this.type = typeSelected;    
      this.sort();
    }
    else if(filter === "region"){
      this.transportsSelect = [];
      this.lignesSelect = [];
      this.stationsSelect = [];
      const regionSelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      this.region = regionSelected;
      this.databaseService.getTransportsOfRegion(regionSelected).subscribe((res: string[]) => {
        res.forEach((element: string) => {
          this.transportsSelect.push({
            id: element,
            name: element,
            selected: false
          });
        });
        this.transportsSelect = [...this.transportsSelect];
      });
      
    }
    else if(filter === "transport"){
      this.lignesSelect = [];
      this.stationsSelect = [];
      const regionSelected: string = this.regionSelect.find((element: SelectData) => element.selected === true)?.name;
      const transportSelected: string = event.find((element: SelectData) => element.selected === true)?.name;

      this.databaseService.getLignesOfRegionByTransport(regionSelected,transportSelected).subscribe((res: Ligne[]) => {
        res.forEach((element: Ligne) => {
          this.lignesSelect.push({
            id: element.id,
            name: element.name,
            selected: false
          });
        });
        this.lignesSelect = [...this.lignesSelect];
      });
    }
    else if(filter === "ligne"){
      this.stationsSelect = [];
      this.lignes = [];
      const lignesSelected: SelectData[] = event.filter((element: SelectData) => element.selected === true);
      lignesSelected.forEach((element: SelectData) => {
        this.lignes.push(element.id);
      });
      let counter = 0;
      this.lignes.forEach((ligne: string) => {
        this.databaseService.getStationsOfLigne(ligne).subscribe((res: Station[]) => {
          counter ++;
          res.forEach((element: Station) => {
            this.stationsSelect.push({
              id: element.name,
              originalData: element,
              name: element.name,
              selected: false
            });
          });
          if(counter === this.lignes.length)  this.stationsSelect = [...this.stationsSelect];
        });
      });
      this.sort();
    }
    else if(filter === "station"){
      this.stations = event.filter((element: SelectData) => element.selected === true);
      this.sort();
    }
    else if(filter === "tested"){
      this.tested = event;
      this.sort();
    }
  }

  protected mapHeight = "100vh";
  protected mapWidth = "100vw";
  initMapSize() : void{
    if(sessionStorage.getItem("device") === "mobile"){
      this.mapWidth = "100%";
    }
  }
  protected mapZoom = 12;
  protected mapCenter: google.maps.LatLngLiteral = {
    lat: 48.85611488586469,
    lng: 2.3552717616178107
  };
  protected mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    disableDoubleClickZoom: true,
    streetViewControl: false,
    disableDefaultUI: true,
    maxZoom: 15,
    minZoom: 8,
  };
  protected markers: google.maps.LatLngLiteral[] = [];
  protected markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
    cursor: "pointer"
  };

//////////////////////////////////////////////  Sort  //////////////////////////////////////////////
  private category: string = "";
  private type: string = "";
  protected tested: boolean = false;
  protected openOnly: boolean = false;
  protected region: string = "";
  protected transport: string = "";
  protected lignes: string[] = [];
  protected stations: SelectData[] = [];
  private placeToKeep: Place[] = [];
  sort(){
    this.markers = [];
    let stationSorter: Subject<boolean> = new Subject();
    this.sortByGeo(stationSorter);
    stationSorter.subscribe(() => {
      this.sortByInfos();
    });
  }

  sortByInfos(){
    let triggerFilter: Subject<boolean> = new Subject();
    triggerFilter.subscribe(() => {
      this.placeToKeep.forEach((place: Place) => {
        this.markers.push({
          lat: place.lat,
          lng: place.lng
        });
      });
    });
    if(this.category !== ''){
      this.placeToKeep.filter((place: Place) => place.category === this.category);
      if(this.type !== ''){
        this.placeToKeep.filter((place: Place) => place.type === this.type);
      }
    }
    if(!this.tested && !this.openOnly){
      triggerFilter.next(true);
    }
    if(this.tested){
      this.placeToKeep.filter((place: Place) => place.tested);
      if(!this.openOnly) triggerFilter.next(true);
    }
    if(this.openOnly){
      let counter = 0;
      this.placeToKeep.filter((place: Place) => {
        this.databaseService.getHorairesOfPlace(place.id,localStorage.getItem('id')).subscribe((res: Horaires[]) => {
          counter ++;
          let toKeep: boolean = false;
          if(this.placesService.isOpened(res))  toKeep = true;
          if(counter === this.placeToKeep.length) triggerFilter.next(true);
          return toKeep;
        });
      });
    }
    
  }

  sortByGeo(stationSorter: Subject<boolean>){
    if(this.lignes.length > 0 && this.stations.length === 0){
      this.lignes.forEach((element: string) => {
        this.databaseService.getPlacesByLigneAndUser(element,localStorage.getItem('id')).subscribe((places: Place[]) => {
          this.placeToKeep = places;
          stationSorter.next(true);
        });
      });
    } else if(this.stations.length > 0){
      this.stations.forEach((element: SelectData) => {
        this.databaseService.getPlacesByStationAndUser(element.originalData,localStorage.getItem('id')).subscribe((places: Place[]) => {
          this.placeToKeep = places;
          stationSorter.next(true);
        });
      });
    } else{
      this.databaseService.getPlacesOfUser(localStorage.getItem("id")).subscribe((places: Place[]) => {
        this.placeToKeep = places;
        stationSorter.next(true);
      });
    }
  }

//////////////////////////////////////////////  Navigate  //////////////////////////////////////////////

  ngOnInit(){
    this.initOptions();
    this.sort();
  }
  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}

interface MarkersInfos{
  lat: number,
  lng: number,
  cat: string,
  type: string,
  tested: boolean,
  open: boolean
}
