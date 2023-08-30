import { Component, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { CheckboxInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { DatabaseService } from '../services/database.service';
import { Data } from 'src/data';
import { TypePicture } from '../model/typePicture';
import { Station } from '../model/transports';
import { Restaurant } from '../model/places';
import { PlacesService } from '../services/places.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.scss']
})
export class FilterPageComponent {

  constructor(private elementRef: ElementRef,
    private themeService: ThemeService, 
    private databaseService: DatabaseService,
    private placesService: PlacesService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

//////////////////////////////////////////////  Background Page  //////////////////////////////////////////////
  protected backgroundColor: string = 'var(--white)'

//////////////////////////////////////////////  Bottombar  //////////////////////////////////////////////
  protected openTransportbar: boolean = true;
  protected iconTransportbar: string = "x";
  toggleBottombar(){
      this.openTransportbar = !this.openTransportbar;
      this.openTransportbar ? this.iconTransportbar = "x" : this.iconTransportbar = ">";
    }

//////////////////////////////////////////////  Sidebar  //////////////////////////////////////////////
  protected openSidebar: boolean = true;
  protected iconSidebar: string = "x";
  toggleSidebar(){
      this.openSidebar = !this.openSidebar;
      this.openSidebar ? this.iconSidebar = "x" : this.iconSidebar = "<";
  }
  protected selectInfosRight: SelectInfos = {
    backgroundColor: 'var(--secondColor)',
    textColor: 'var(--white)',
    optionTextColor: 'var(--black)',
    optionBackgroundColor: 'var(--white)',
    hoverBackgroundColor: 'var(--mainColor)',
    hoverTextColor: 'var(--black)',
    borderColor: 'var(--white)',
    width: 10
  }
  protected selectInfosLeft: SelectInfos = {
    backgroundColor: 'var(--mainColor)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--white)',
    optionBackgroundColor: 'var(--black)',
    hoverBackgroundColor: 'var(--secondColor)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--black)',
    width: 10
  }
  protected checkboxInfos: CheckboxInfos = {
    color: "var(--white)",
    backgroundColor: "var(--black)",
    borderColor: "var(--black)",
    colorActive: "var(--white)",
    backgroundColorActive: "var(--thirdColor)",
    borderColorActive: "var(--thirdColor)"
  }
  protected categorySelect: SelectData[] = [];
  protected regionSelect: SelectData[] = [];
  protected lignesSelect: SelectData[] = [];
  protected stationsSelect: SelectData[] = [];

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
    else if(filter === "region"){
      this.lignesSelect = [];
      this.stationsSelect = [];
      const regionSelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      this.region = regionSelected;

      this.databaseService.getLignesOfRegion(regionSelected).subscribe((res: string[]) => {
        res.forEach((element: string) => {
          this.lignesSelect.push({
            id: element,
            name: element,
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
        this.lignes.push(element.name);
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
  private allRestaurants: Restaurant[] = [];
  private filteredPlace: Restaurant[] = [];
  protected category: string = "";
  protected tested: boolean = true;
  protected openOnly: boolean = false;
  protected region: string = "";
  protected lignes: string[] = [];
  protected stations: SelectData[] = [];
  sort(){
    this.filteredPlace = [];
    this.markers = [];
    let placesId: string[] = [];
    let getIds: Subject<boolean> = new Subject();
    if(this.lignes.length > 0 && this.stations.length === 0){
      let counter: number = 0;
      this.lignes.forEach((element: string) => {
        this.databaseService.getPlacesIdByLigne(element).subscribe((res: string[]) => {
          counter++;
          placesId.push(...res);
          if(counter === this.lignes.length){
            placesId = this.placesService.removeDuplicate(placesId);
            getIds.next(true);
          }
        });
      });
      getIds.subscribe(() => {
        placesId.forEach((id: string) => {
          const place: Restaurant = this.allRestaurants.find((element: Restaurant) => element.id === id);
          this.filteredPlace.push(place);
        });
        this.filteredPlace = this.filteredPlace.filter((element: Restaurant) => element.tested === this.tested);  
        this.filteredPlace.forEach((element: Restaurant) => {
          this.markers.push({
            lat: element.lat,
            lng: element.lng
          });
        });
      });
    } else if(this.stations.length > 0){
      let counter: number = 0;
      this.stations.forEach((element: SelectData) => {
        this.databaseService.getPlacesIdByStation(element.originalData).subscribe((res: string[]) => {
          counter++;
          placesId.push(...res);
          if(counter === this.lignes.length){
            placesId = this.placesService.removeDuplicate(placesId);
            getIds.next(true);
          }
        });
      });
      getIds.subscribe(() => {
        placesId.forEach((id: string) => {
          const place: Restaurant = this.allRestaurants.find((element: Restaurant) => element.id === id);
          this.filteredPlace.push(place);
        });
        this.filteredPlace = this.filteredPlace.filter((element: Restaurant) => element.tested === this.tested);  
        this.filteredPlace.forEach((element: Restaurant) => {
          this.markers.push({
            lat: element.lat,
            lng: element.lng
          });
        });
      });
    } else{
      this.filteredPlace = this.allRestaurants.slice();
      this.filteredPlace = this.filteredPlace.filter((element: Restaurant) => element.tested === this.tested); 
      this.filteredPlace.forEach((element: Restaurant) => {
        this.markers.push({
          lat: element.lat,
          lng: element.lng
        });
      });
    }
  }

//////////////////////////////////////////////  Navigate  //////////////////////////////////////////////

  ngOnInit(){
    this.databaseService.getPlaceOfUser(localStorage.getItem('id')).subscribe((res: string[]) => {
      res.forEach((element: string) => {
        this.databaseService.getRestaurantById(element).subscribe((restaurant: Restaurant) => {
          this.allRestaurants.push(restaurant);
        });
      });
    });
    this.initOptions();
  }
  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
