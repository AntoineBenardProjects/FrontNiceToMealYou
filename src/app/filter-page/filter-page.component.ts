import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AutocompleteInfos, ButtonInfos, CheckboxInfos, InputInfos, RangeSliderInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { DatabaseService } from '../services/database.service';
import { Type } from '../shared/model/table/type';
import { Coords, Ligne, Station } from '../shared/model/table/transports';
import { City, Place } from '../shared/model/table/places';
import { PlacesService } from '../services/places.service';
import { Horaires } from '../shared/model/table/horaires';
import { PlaceCardParams, UserCardParams } from '../shared/model/params/cardParams';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAdd, faCity, faHome, faLocationDot, faRankingStar, faStar, faTrainSubway, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import {selectInfosFilterComponent} from '../shared/model/design/selectsDesign';
import { homeButtonFilterComponent, toolbarIconsButtonFilterComponent } from '../shared/model/design/buttonsDesign';
import { Comment } from '../shared/model/table/comment';
import { autocompleteInfosFilter, normalInputFilter, searchInputFilter } from '../shared/model/design/inputsDesign';
import { checkboxInfosFilterComponent } from '../shared/model/design/checkboxesDesign';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.scss']
})
export class FilterPageComponent {
  constructor(
    private placesService: PlacesService,
    private databaseService: DatabaseService,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute){}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected selectInfosTransport: SelectInfos = selectInfosFilterComponent
  protected selectInfosCategory: SelectInfos = selectInfosFilterComponent;
  protected toolbarButtonsInfos: ButtonInfos = toolbarIconsButtonFilterComponent;
  protected homeButtonsInfos: ButtonInfos = homeButtonFilterComponent;
  protected normalInput: InputInfos = normalInputFilter;
  protected searchInputInfos: InputInfos = searchInputFilter;
  protected priceSliderInfos: RangeSliderInfos = {
    activeColor: "var(--successColor)",
    unactiveColor: "var(--white)",
    pointSize: 20,
    length: 15,
    width: 2,
    maxValue: 100,
    minValue: 0,
    borderColor: 'var(--white)',
    borderWidthDialog: 3,
    borderWidth: 1,
    legendText: "< ",
    maxValueText: "+ ",
    unit: "€",
    plus: true
  }
  protected gradeSliderInfos: RangeSliderInfos = {
    activeColor: "var(--successColor)",
    unactiveColor: "var(--white)",
    pointSize: 20,
    length: 15,
    width: 2,
    maxValue: 10,
    minValue: 0,
    borderColor: 'var(--white)',
    borderWidthDialog: 3,
    borderWidth: 1,
    legendText: "",
    maxValueText: "",
    unit: "",
    plus: true
  }
/*  Map  */
  private map: L.Map;
  private nameMarkers: L.Marker[] = [];
  private placeMarkers: L.Marker[] = [];
  private stationMarkers: L.Marker[] = [];
  private placeMarkersLayer: L.LayerGroup;
  private nameMarkersLayer: L.LayerGroup;
  private stationMarkersLayer: L.LayerGroup;
/*  Css  */
/*  Icons  */
  protected cityIcon: IconDefinition = faCity;
  protected addIcon: IconDefinition = faAdd;
  protected newIcon: IconDefinition = faLocationDot;
  protected transportIcon: IconDefinition = faTrainSubway;
  protected categoryIcon: IconDefinition = faRankingStar;
  protected ratingIcon: IconDefinition = faStar;
  protected closeIcon: IconDefinition = faXmark;
  protected homeIcon: IconDefinition = faHome;
/*  Selects  */
  protected categorySelect: SelectData[] = [];
  protected regionSelect: SelectData[] = [];
  protected lignesSelect: SelectData[] = [];
  protected stationsSelect: SelectData[] = [];
  protected transportsSelect: SelectData[] = [];
  protected typesSelect: SelectData[] = [];
  protected autocompleteCities: SelectData[] = [];
  protected autocompleteNames: SelectData[] = [];
/*  Algos  */
  protected placeDetails: boolean = false;
  protected imgPlace: string = "";
  protected openTransportbar: boolean = false;
  protected openCategorybar: boolean = false;
  protected openGradebar: boolean = false;
  protected autocompleteInfos: AutocompleteInfos = autocompleteInfosFilter;
  protected checkboxInfos: CheckboxInfos = checkboxInfosFilterComponent;
  private themeSubscriber: Subscription;
  protected ratings: Comment;
  protected citySearch: string = "";
  protected nameSearch: string = "";
  private idCity: string = "";
  protected placeCards: PlaceCardParams;
  private category: string = "";
  private type: string[] = [];
  protected tested: boolean = false;
  protected openOnly: boolean = false;
  protected promotion: boolean = false;
  protected region: string = "";
  protected transport: string = "";
  private ratingSort: boolean = false;
  protected lignes: string[] = [];
  protected stations: SelectData[] = [];
  private placeToKeep: Place[] = [];
  protected showSelectPlace: boolean = false;
  protected zoomLevel: number = 13;
  protected id_user: string = "";
  protected otherUserCardParams: UserCardParams;
  protected device: string = sessionStorage.getItem('device');

  private initMap(places: Place[]): void {
    this.nameMarkers = []; 
    this.placeMarkers = []; 
    this.stationMarkers = [];
    let averageCoords: Coords = {
      lat: 0,
      lng: 0
    }
    places.forEach((place:Place) => {
      averageCoords.lat += place.lat;
      averageCoords.lng += place.lng;
      let url: string = "";
      const imageName: string = place.category.toLocaleLowerCase();
      url = '../../assets/common/'+imageName+'.png';
      let icon: L.Icon = L.icon({
        iconUrl: url,
        iconSize: [50, 50]
      });
      this.placeMarkers.push(L.marker([place.lat,place.lng],{
        alt: place.id,
        icon: icon
      }).on('click', this.showPlaceCard.bind(this)));
      let name: L.Marker = new L.Marker([place.lat,place.lng], {
        alt: place.id,
        icon: new L.DivIcon({
            className: "label",
            html: '<span class="center" style="position: absolute; top: -50px;left: 50%;transform: translateX(-50%); font-size: 2vh; width: max-content; min-width: 50px; border-radius: 5px; padding: 5px; background: white; color: var(--black); text-align:center">'+place.name+'</span>'
        })
      }).on('click', this.showPlaceCard.bind(this));
      this.nameMarkers.push(name);
    });
    places.length > 0 ? averageCoords.lat = averageCoords.lat/places.length : averageCoords.lat = 48.865025;
    places.length > 0 ? averageCoords.lng = averageCoords.lng/places.length : averageCoords.lng = 2.3653517;

    this.placeMarkersLayer = L.layerGroup(this.placeMarkers);
    let appearZoomLevel: number = 15;
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    if(isMobile){
      appearZoomLevel = 17;
      sessionStorage.setItem("device","mobile");
    }
    else if(isTablet){
      appearZoomLevel = 15;
      sessionStorage.setItem("device","tablet");
    }
    else if(isDesktopDevice){
      sessionStorage.setItem("device","desktop");
    }
    this.nameMarkersLayer = L.layerGroup(this.nameMarkers);
    let params: L.Layer[] = [];

    let osm: L.TileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });
    let osmHOT: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });
    appearZoomLevel <= 13 ? params = [osm, this.placeMarkersLayer,this.nameMarkersLayer] : params = [osm, this.placeMarkersLayer];

    this.map = L.map('map', {
      center: [averageCoords.lat, averageCoords.lng],
      zoom: this.zoomLevel,
      layers: params
    });

    let baseMaps = {
      "OpenStreetMap": osm,
      "OpenStreetMap.HOT": osmHOT
    };
    let layerControl = L.control.layers(baseMaps).addTo(this.map);
    this.map.on('zoom', this.showName.bind(this));  
  }
  private showName(): void{
    this.zoomLevel = this.map.getZoom();
    let appearZoomLevel: number = 15;
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    if(isMobile){
      appearZoomLevel = 17;
      sessionStorage.setItem("device","mobile");
    }
    else if(isTablet){
      appearZoomLevel = 15;
      sessionStorage.setItem("device","tablet");
    }
    else if(isDesktopDevice){
      sessionStorage.setItem("device","desktop");
    }

    console.log(this.map.getZoom(), appearZoomLevel)
    this.map.getZoom() >= appearZoomLevel ? this.map.addLayer(this.nameMarkersLayer) : this.map.removeLayer(this.nameMarkersLayer);
  }
  private showPlaceCard(e): void{
    const id: string = e.target.options.alt;
    console.log(id)
    this.databaseService.getPlaceInfos(id,this.id_user).subscribe((details: PlaceCardParams) => {
      let infos: PlaceCardParams = {
        place: details.place,
        types: details.types,
        horaires: details.horaires,
        stations: details.stations,
        pictures: details.pictures,
        comments: details.comments,
        users: details.users,
        startAnimation: true,
        user: true
      }
      this.placeCards = infos;
    });
  }
  protected closeCard(): void{
    this.placeCards = null;
  }
  protected addMarker(): void{
    if(this.map != null) this.map.remove();
    this.initMap(this.placeToKeep);
  }
  protected toggleBottombar(change:boolean): void{
      this.openTransportbar = !this.openTransportbar;
      if(change && this.openTransportbar){
        this.openCategorybar = false;
        this.openGradebar = false;
      }
  }
  protected toggleSidebar(change:boolean): void{
      this.openCategorybar = !this.openCategorybar;
      if(change && this.openCategorybar){
        this.openTransportbar = false;
        this.openGradebar = false;
      }
  }
  protected toggleGradebar(change:boolean): void{
      this.openGradebar = !this.openGradebar;
      if(change && this.openGradebar){
        this.openTransportbar = false;
        this.openCategorybar = false;
      }
  }
  private initOptions(): void{
    this.categorySelect = [
      {id: "res", name: "Restaurant"},
      {id: "bar", name: "Bar"},
      {id: "loi", name: "Loisir",selected: false},
      {id: "mag", name: "Magasin",selected: false},
      {id: "ser", name: "Service",selected: false},
      {id: "aut", name: "Autre",selected: false},
    ];
    this.databaseService.getAllRegion().subscribe((regions: string[]) => {
      regions.forEach((element: string) => {
        this.regionSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
    });
  }
  protected searchCity(event: any): void{
    this.citySearch = event.target.value;
  }
  protected searchName(event: any): void{
    this.nameSearch = event.target.value;
  }
  protected filter(event: any, filter: string,rating?: boolean): void{
    if(filter === "category"){
      this.ratings = this.initRatings();
      this.ratingSort = false;
      this.typesSelect = [];
      this.type = null;
      let categorySelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      if(categorySelected == null)  categorySelected = "";
      this.category = categorySelected;
      switch(this.category){
        case "Restaurant":
          this.ratings.quality_price_range = [0,10];
          this.ratings.quantity_range = [0,10];
          this.ratings.service_range = [0,10];
          this.ratings.price_range = [0,100];
        break;
        case "Bar":
          this.ratings.quality_price_range = [0,10];
        break;
        case "":
          this.ratings = this.initRatings();
        break;
        default:
          this.ratings.quality_price_range = [0,10];
        break;
      }
      this.databaseService.getTypeByCategory(categorySelected).subscribe((types:Type[]) => {
        types.forEach((type: Type) => {
          if(categorySelected === type.category){
            const selectValue: SelectData = {
              id: type.id,
              name: type.name,
              selected: false,
              originalData: type
            }
            this.typesSelect.push(selectValue);
          }
          this.typesSelect = [...this.typesSelect];
        });
      });
      this.sort();
    }
    else if(filter === "price" || filter === "quality_price" || filter === "quantity" || filter === "service"){
      this.ratingSort = true;
      if(filter === "service")  this.ratings.service_range = event;
      if(filter === "price")  this.ratings.price_range = event;
      if(filter === "quality_price")  this.ratings.quality_price_range = event;
      if(filter === "quantity")  this.ratings.quantity_range = event;
      this.sort();
    }
    else if(rating){
      this.ratingSort = true;
      this.ratings[filter] = Number(event);
      this.sort();
    }
    else if(filter === "type"){
      this.type = [];
      if(event.filter((element: SelectData) => element.selected === true) != null){
        event.filter((element: SelectData) => element.selected === true).forEach((type: SelectData) => {
          this.type.push(type.id);
        });
      }
      this.sort();
    }
    else if(filter === "region"){
      this.transportsSelect = [];
      this.lignesSelect = [];
      this.stationsSelect = [];
      this.stations = [];
      this.lignes = [];
      this.transport = "";
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
      this.sort();
    }
    else if(filter === "transport"){
      this.lignesSelect = [];
      this.stationsSelect = [];
      this.stations = [];
      this.lignes = [];
      const regionSelected: string = this.regionSelect.find((element: SelectData) => element.selected === true)?.name;
      const transportSelected: string = event.find((element: SelectData) => element.selected === true)?.name;
      this.transport = transportSelected;
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
      this.sort();
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
          if(counter === this.lignes.length){
            this.stationsSelect = [...this.stationsSelect];
          }
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
    else if(filter === "openOnly"){
      this.openOnly = event;
      this.sort();
    }
    else if(filter === "promotion"){
      this.promotion = event;
      this.sort();
    }
    else if(filter === "city"){
      this.idCity = event;
      this.sort();
    }
    else if(filter === "name"){
      const placeId: string = event;
      this.placeToKeep = this.placeToKeep.filter((place: Place) => place.id === placeId);
      this.addMarker();
    }
  }
  private initRatings(): Comment{
    return {
      id_place: "",
      id_user: "",
      quality_price_range: null,
      quantity_range: null,
      service_range: null,
      price_range: null,
      tested: false
    }
  } 
  private sort(): void{
    let stationSorter: Subject<boolean> = new Subject();
    let infosSorter: Subject<boolean> = new Subject();
    let ratingSorter: Subject<boolean> = new Subject();
    this.sortByGeo(stationSorter);
    ratingSorter.subscribe(() => {
      this.sortByCity();
    });
    infosSorter.subscribe(() => {
      this.sortByRating(ratingSorter);
    });
    stationSorter.subscribe(() => {
      this.sortByInfos(infosSorter);
    });
  }
  private sortByCity(): void{
    if(this.idCity !== ""){
      this.placeToKeep = this.placeToKeep.filter((place: Place) => {
        let okay: boolean = false;
        this.idCity === place.id_city ? okay = true : okay = false;
        return okay;
      });
      this.addMarker();
    } else{
      this.addMarker();
    }
  }
  private sortByRating(ratingSorter: Subject<boolean>): void{   
    if(this.ratingSort){
      let ids: string[] = [];
      this.placeToKeep.forEach((place: Place) => {
        ids.push(place.id);
      });
      this.databaseService.filterByComment(this.ratings,ids).subscribe((placesFiltered: Place) => {
        this.placeToKeep = this.placesService.getCopyOfElement(placesFiltered);
        ratingSorter.next(true);
      });
    } else{
      ratingSorter.next(true);
    }
  }
  private sortByInfos(infosSorter: Subject<boolean>): void{
    let triggerFilter: Subject<boolean> = new Subject();
    let triggerType: Subject<boolean> = new Subject();
    triggerFilter.subscribe(() => {
      infosSorter.next(true);
    });
    triggerType.subscribe(() => {
      if(!this.tested && !this.openOnly && !this.promotion){
        triggerFilter.next(true);
      }
      if(this.promotion){
        this.placeToKeep = this.placeToKeep.filter((place: Place) => (place.promotion != null && place.promotion !== ''));
        if(!this.tested && !this.openOnly) triggerFilter.next(true);
      }
      if(this.tested){
        // this.placeToKeep = this.placeToKeep.filter((place: Place) => place.tested);
        if(!this.openOnly && !this.promotion) triggerFilter.next(true);
      }
      if(this.openOnly){
        let counter = 0;
        let maxLength: number = this.placeToKeep.length;
        let getIndexesToSuppress: Subject<number> = new Subject();
        let indexesToSuppress: number[] = [];
        getIndexesToSuppress.subscribe((index: number) => {
          if(index >= 0) indexesToSuppress.push(index);
          counter++;
          if(counter === maxLength){
            indexesToSuppress.forEach((index:number,i:number) => {
              this.placeToKeep.splice(index-i,1);
            });
            triggerFilter.next(true);
          }
        })
        this.placeToKeep.forEach((place: Place,index: number) => {
          this.databaseService.getHorairesOfPlace(place.id,this.id_user).subscribe((horaires: Horaires[]) => {
            let toKeep: boolean = false;
            if(horaires.length === 0) toKeep = false;
            else if(this.placesService.isOpened(horaires))  toKeep = true;
            toKeep ? getIndexesToSuppress.next(-1) : getIndexesToSuppress.next(index);
          });
        });
      }
    });
    if(this.category !== ''){
      this.placeToKeep = this.placeToKeep.filter((place: Place) => place.category === this.category);
      if(this.type != null && this.type.length > 0){
        let counter: number = 0;
        let newPlaceToKeep: Place[] = [];
        this.placeToKeep.forEach((place: Place) => {
          this.databaseService.verifyPlaceTypes(this.type, place.id).subscribe((hasType: boolean) => {
            if(hasType)  newPlaceToKeep.push(place);
            counter++;
            if(counter === this.placeToKeep.length){
              this.placeToKeep = this.placesService.getCopyOfElement(newPlaceToKeep);
              triggerType.next(true);
            }
          });
        });
      } else{
        triggerType.next(true);
      }
    } else{
      triggerType.next(true);
    }
    
    
  }
  private sortByGeo(stationSorter: Subject<boolean>): void{
    this.placeToKeep = [];
    if(this.region.length > 0 && this.transport.length === 0){
      this.databaseService.getPlacesByRegionAndUser(this.region,this.id_user).subscribe((places: Place[]) => {
        this.placeToKeep = places;
        stationSorter.next(true);
      });
    }    
    else if(this.transport.length > 0 && this.lignes.length === 0){
      this.databaseService.getPlacesByTransportOfRegionAndUser(this.region,this.transport,this.id_user).subscribe((places: Place[]) => {
        this.placeToKeep = places;
        stationSorter.next(true);
      });
    }
    else if(this.lignes.length > 0 && this.stations.length === 0){
      this.lignes.forEach((element: string) => {
        this.databaseService.getPlacesByLigneAndUser(element,this.id_user).subscribe((places: Place[]) => {
          this.placeToKeep.push(...this.placesService.getCopyOfElement(places));
          stationSorter.next(true);
        });
      });
    } else if(this.stations.length > 0){
      let places: Place[] = [];
      let counter: number = 0;
      this.stations.forEach((element: SelectData) => {
        this.databaseService.getPlacesByStationAndUser(element.originalData,this.id_user).subscribe((placesFiltered: Place[]) => {
          places.push(...placesFiltered);
          counter++;
          if(counter === this.stations.length){
            this.placeToKeep = places;
            stationSorter.next(true);
          }
        });
      });
    } else{
      this.databaseService.getPlacesOfUser(this.id_user).subscribe((places: Place[]) => {
        this.placeToKeep = places;
        stationSorter.next(true);
      });
    }
  }
  protected selectPlace(trigger: boolean){
    this.showSelectPlace = trigger;
  }
  private ngOnInit(): void{
    if(this.device === 'mobile'){
      this.gradeSliderInfos.length = 80;
      this.priceSliderInfos.length = 80;
    }
    this.ratings = this.initRatings();
    this.initOptions();
    this.route.snapshot.paramMap.get('id') != null ? this.id_user = this.route.snapshot.paramMap.get('id') : this.id_user = localStorage.getItem("id");
    if(this.route.snapshot.paramMap.get('id') != null)  this.otherUserCardParams = {
      id: this.id_user,
      small: true,
      width: 20,
      height: 30,
      accessToCard: false
    }
    this.sort();
    this.databaseService.getPlacesOfUser(this.id_user).subscribe((places: Place[]) => {
      places.forEach((place: Place) => {
        this.autocompleteNames.push({
          id: place.id,
          name: place.name,
          originalData: place
        });
      });
    });
    this.databaseService.getAllCities().subscribe((cities: City[]) => {
      cities.forEach((city: City) => {
        this.autocompleteCities.push({
          id: city.id,
          name: city.name,
          originalData: city
        });
      });
    });
    
  }
  private ngOnDestroy(): void{
    sessionStorage.setItem("lastPage","/filter");
  }
}


