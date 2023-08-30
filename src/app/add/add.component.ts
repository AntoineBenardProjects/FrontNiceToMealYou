import { Component, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Data } from 'src/data';
import { Comment, RestaurantsGrades } from '../model/comment';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { Place, Restaurant } from '../model/places';
import { AutocompleteInfos, ButtonInfos, CheckboxInfos, InputInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { TypePicture } from '../model/typePicture';
import { faCheck, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PlacesService } from '../services/places.service';
import { Station } from '../model/transports';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: [
    trigger('title', [
    state('show', style({
      left: '10vw'
    })),
    state('hidden', style({
      width: '-50vw'
    })),
    transition('* => hidden', [
      animate('1.5s ease-out')
    ]),
    transition('* => show', [
      animate('1.5s ease-out')
    ])
  ])]
})
export class AddComponent {

  protected options: string[] = ['Restaurant', 'Bar', 'Autres'];
  private facadeFile: string = "";
  protected facadeName: string = "Façade";
  protected allPictures: Pictures[] = [];
  protected positifs: Comment[] = [];
  protected negatifs: Comment[] = [];
  


  constructor(
    private databaseService: DatabaseService,
    private placesService: PlacesService,
    private router: Router,
    private elementRef: ElementRef,
    private themeService: ThemeService,
    private http: HttpClient) { 
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
        this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
        this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
        this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
        this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
        this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
      });
    }
  private themeSubscriber: Subscription = new Subscription();


//////////////////////////////////////////////  Style  //////////////////////////////////////////////
  protected horairesInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--black)",
    backgroundColor: "var(--mainColor)",
    borderColor: "var(--black)",
    borderColorActive: "var(--black)",
  }
  protected normalInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--thirdColor)",
    backgroundColor: "var(--mainColor)",
    borderColor: "var(--black)",
    borderColorActive: "var(--thirdColor)",
    hoverBackgroundColor: "var(--thirdColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--thirdColor)",
  }
  protected validInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--thirdColor)",
    backgroundColor: "var(--mainColor)",
    borderColor: "var(--thirdColor)",
    borderColorActive: "var(--thirdColor)",
    hoverBackgroundColor: "var(--thirdColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--thirdColor)",
  }
  protected invalidInput: InputInfos = {
    color: "var(--black)",
    placeholderColor: "var(--black)",
    placeholderColorActive: "var(--secondColor)",
    backgroundColor: "var(--mainColor)",
    borderColor: "var(--secondColor)",
    borderColorActive: "var(--secondColor)",
    hoverBackgroundColor: "var(--secondColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--secondColor)",
  }
  protected validSelectInfos: SelectInfos = {
    backgroundColor: 'var(--mainColor)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--white)',
    optionBackgroundColor: 'var(--black)',
    hoverBackgroundColor: 'var(--thirdColor)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--thirdColor)',
    width: 10,
    topHoverBackgroundColor: "var(--thirdColor)",
    topHoverColor: "var(--white)",
    topHoverBorderColor: "var(--thirdColor)"
  }
  protected invalidSelectInfos: SelectInfos = {
    backgroundColor: 'var(--mainColor)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--white)',
    optionBackgroundColor: 'var(--black)',
    hoverBackgroundColor: 'var(--secondColor)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--secondColor)',
    width: 10,
    topHoverBackgroundColor: "var(--secondColor)",
    topHoverColor: "var(--white)",
    topHoverBorderColor: "var(--secondColor)"
  }
  protected validButton: ButtonInfos = {
    color: 'var(--mainColor)',
    colorActive: 'var(--thirdColor)',
    backgroundColor: 'var(--thirdColor)',
    backgroundColorActive: 'var(--mainColor)',
    fontWeight: 1000
  }
  protected invalidButton: ButtonInfos = {
    color: 'var(--mainColor)',
    colorActive: 'var(--secondColor)',
    backgroundColor: 'var(--secondColor)',
    backgroundColorActive: 'var(--mainColor)',
    fontWeight: 1000
  }
  protected secondLineButton: ButtonInfos = {
    color: 'var(--black)',
    colorActive: 'var(--mainColor)',
    backgroundColor: 'var(--mainColor)',
    backgroundColorActive: 'var(--black)',
    fontSize: "30px"
  }
  protected checkboxInfos: CheckboxInfos = {
    color: "var(--white)",
    backgroundColor: "var(--secondColor)",
    borderColor: "var(--secondColor)",
    colorActive: "var(--white)",
    backgroundColorActive: "var(--thirdColor)",
    borderColorActive: "var(--thirdColor)",
    hoverBackgroundColor: "var(--mainColor)",
    hoverBorderColor: "var(--secondColor)",
    hoverTextColor: "var(--secondColor)",
    hoverBackgroundColorValid: "var(--mainColor)",
    hoverBorderColorValid: "var(--thirdColor)",
    hoverTextColorValid: "var(--thirdColor)",
  }
  protected autocompleteInfos: AutocompleteInfos = {
    textColor: 'var(--white)',
    textColorActive: 'var(--white)',
    backgroundColor: 'var(--black)',
    backgroundColorActive: 'var(--thirdColor)'
  }

//////////////////////////////////////////////  Form  //////////////////////////////////////////////
  protected placeInfo: Restaurant = {
      id: "",
      name: "",
      address: "",
      tested: false,
      category: "",
      type: "",
      lat: 0,
      lng: 0,
      link_menu: "",
      website: "",
      google_note: 0,
      total_google_note: 0,
      vegetarian: false,
      delivery: false,
      visible: false,
  }
  setValue(event: any, params: string, day?: string, moment?: string): void{
    if(params === 'address')  this.placeInfo.address = event.target.value;
    else if(params === 'category'){
      this.typesSelect = event;
      const find: SelectData = event.find((element: SelectData) => element.selected === true);
      find != null ? this.placeInfo.category = find.name : this.placeInfo.category = "";
      this.placeInfo.category === "" ?  this.categoryError = "Le lieu doit appartenir à une catégorie" : this.categoryError = "";
      this.initOptions(this.placeInfo.category);
    }
    else if(params === 'name'){
      this.placeInfo.name = event.target.value;
      if(this.placeInfo.address !== "") this.checkAddress();
    }
    else if(params === 'type'){
      event[0] != null ? this.placeInfo.type = event[0].name : this.placeInfo.type = "";
      this.placeInfo.type === "" ?  this.typeError = "Le lieu doit avoir un type" : this.typeError = "";
    }
    else if(params === 'comment')  this.comment.comment = event.target.value;
    else if(params === 'quantity')  this.comment.quantity = event.target.value;
    else if(params === 'quality_price')  this.comment.quality_price = event.target.value;
    else if(params === 'service')  this.comment.service = event.target.value;
    else if(params === 'website')  this.placeInfo.website = event.target.value;
    else if(params === 'menu')  this.placeInfo.link_menu = event.target.value;
    else if(params === 'tested')  this.placeInfo.tested = event;
    else if(params === 'horaires'){
      let find: Horaires = this.horaires.find((element: Horaires) => element.day === day);
      find[moment] = event.target.value;
    }
    else if(params === 'visible'){this.placeInfo.visible = event;}
  }
  protected restaurantsTypesSelect: SelectData[] = [];
  protected typesSelect: SelectData[] = [];
  initOptions(category: string): void{
    this.autocompleteName = [];
    Data.forEach((type: TypePicture) => {
      if(type.place === category) {
        const selectValue: SelectData = {
          id: type.type,
          name: type.type
        }
        if(this.placeInfo.type === selectValue.id)  selectValue.selected = true;
        this.restaurantsTypesSelect.push(selectValue);
      }
    });
    this.restaurantsTypesSelect = [...this.restaurantsTypesSelect];
    if(category === '')  this.typesSelect = [{id: "res", name: "Restaurant",selected: false}];
    switch (category){
      case  'Restaurant':
        this.databaseService.getAllRestaurants().subscribe((res: Restaurant[]) => {
          this.allPlaces = res;
          res.forEach((element: Restaurant) => {
            this.autocompleteAddress.push({
              id: element.id,
              name: element.address,
              subtitle: element.name,
              selected: false
            });
            this.autocompleteName.push({
              id: element.id,
              name: element.name,
              subtitle: element.address,
              selected: false
            });
          });
        });
      break;
      case '':
        this.databaseService.getAllRestaurants().subscribe((res: Restaurant[]) => {
          this.allPlaces = res;
          res.forEach((element: Restaurant) => {
            this.autocompleteAddress.push({
              id: element.id,
              name: element.address,
              subtitle: element.name,
              selected: false
            });
            this.autocompleteName.push({
              id: element.id,
              name: element.name,
              subtitle: element.address,
              selected: false
            });
          });
        });
      break;
    }
  }
  protected checkIcon: IconDefinition = faCheck;
  protected validName() : boolean{
    if(this.placeInfo.name.length > 2){
      this.nameError = ""
      return true;
    }
    this.nameError = "Le nom doit faire plus de deux caractères.";
    return false;
  }
  protected canSubmit() : boolean{
    if(this.validName() && this.validAddress && this.placeInfo.category !== '' && this.placeInfo.type !== '') return true;
    return false;
  }
  fillForm(id: string): void{
    this.placeInfo = this.allPlaces.find((element: Restaurant) => element.id === id);
    this.databaseService.getPicturesOfPlaceByUser(id, localStorage.getItem("id")).subscribe((res: Pictures[]) => {
      if(res != null){
        this.pictures = res;
        this.pictures.splice(0,0,{id: "", src: "", id_place: "",id_user: ""});
      }
      else this.pictures = [{id: "", src: "", id_place: "",id_user: ""}];
    });
    this.databaseService.getCommentOfPlaceByUser(this.placeInfo.id,localStorage.getItem("id"),this.placeInfo.category).subscribe((res: Comment) => {
      if(res != null) this.comment = res;
      else this.comment = {
        id_place: "",
        id_user: "",
        comment: "",
      }
    });
    this.databaseService.getStationOfPlaceById(this.placeInfo.id).subscribe((res: Station[]) => {
      this.stations = res;
    });
    this.marker = {
      lat: this.placeInfo.lat,
      lng: this.placeInfo.lng
    };
    this.validAddress = true;
    this.addressError = "";
    this.typesSelect.forEach((element: SelectData) => {
      if(element.name === this.placeInfo.category) element.selected = true;
      else element.selected = false;
    });
    this.initOptions(this.placeInfo.category);
    
  }

//////////////////////////////////////////////  Comment  //////////////////////////////////////////////
  protected comment: RestaurantsGrades = {
    id_place: "",
    id_user: "",
    comment: "",
  }

//////////////////////////////////////////////  Horaires  //////////////////////////////////////////////
  setSecondLine(index: number) : void{
    this.horaires[index].secondLine = !this.horaires[index].secondLine;
  }

  
  

//////////////////////////////////////////////  Map  //////////////////////////////////////////////
  protected mapHeight = "70vh";
  protected mapWidth = "70vw";
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
  protected marker: google.maps.LatLngLiteral;
  protected markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
    cursor: "pointer",
    title: this.placeInfo.name
  };
  protected validAddress: boolean = false;
  protected stations: Station[] = [];
  protected horaires: Horaires[] = [{
    day: "Lundi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Mardi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Mercredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Jeudi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Vendredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Samedi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  },
  {
    day: "Dimanche",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
    secondLine: false
  }
];
  protected checkAddress(): void{
    this.stations = [];
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': this.placeInfo.name + ", " + this.placeInfo.address
    }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {

          if(results[0].types[0] !== 'street_address'){
            this.databaseService.getPlaceDetails(results[0].place_id).subscribe((res:any) => {
              this.horaires = [];
              this.placeInfo.delivery = res.delivery;
              this.placeInfo.google_note = res.google_note;
              this.placeInfo.total_google_note = res.total_ratings;
              this.placeInfo.website = res.website;
              this.placeInfo.vegetarian = res.vegetarian;
              
              let monday: Horaires = {
                day: "Lundi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let tuesday: Horaires = {
                day: "Mardi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let wednesday: Horaires = {
                day: "Mercredi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let thursday: Horaires = {
                day: "Jeudi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let friday: Horaires = {
                day: "Vendredi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let saturday: Horaires = {
                day: "Samedi",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
              let sunday: Horaires = {
                day: "Dimanche",
                ouverture: "",
                fermeture_midi: "",
                ouverture_soir: "",
                fermeture: "",
                id_place: "",
                secondLine: false
              }
  
              res.horaires.forEach((element: any) => {
                switch(element.open.day){
                  case 0 : 
                    if(sunday.ouverture !== ""){
                      sunday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      sunday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      sunday.secondLine = true;
                    } else{
                      sunday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      sunday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 1 : 
                    if(monday.ouverture !== ""){
                      monday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      monday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      monday.secondLine = true;
                    } else{
                      monday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      monday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 2 : 
                    if(tuesday.ouverture !== ""){
                      tuesday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      tuesday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      tuesday.secondLine = true;
                    } else{
                      tuesday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      tuesday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 3 : 
                    if(wednesday.ouverture !== ""){
                      wednesday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      wednesday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      wednesday.secondLine = true;
                    } else{
                      wednesday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      wednesday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 4 : 
                    if(thursday.ouverture !== ""){
                      thursday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      thursday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      thursday.secondLine = true;
                    } else{
                      thursday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      thursday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 5 : 
                    if(friday.ouverture !== ""){
                      friday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      friday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      friday.secondLine = true;
                    } else{
                      friday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      friday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                  case 6 : 
                    if(saturday.ouverture !== ""){
                      saturday.ouverture_soir = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      saturday.fermeture = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                      saturday.secondLine = true;
                    } else{
                      saturday.ouverture = element.open.time.substring(0,2) + ":" + element.open.time.substring(2);
                      saturday.fermeture_midi = element.close.time.substring(0,2) + ":" + element.close.time.substring(2);
                    }
                  break;
                }
              });
  
              this.horaires.push(monday,tuesday,wednesday,thursday,friday,saturday,sunday);
            });
          }
          
          this.databaseService.getStationOfPlaceByCoords({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          },results[0].address_components[4].short_name).subscribe((res: Station[]) => {
            this.stations = [];
            res.forEach((element:Station) => {
              switch(element.reg){
                case  "IDF":
                  this.stations.push({
                    reg: element.reg,
                    lignes: element.lignes,
                    transport: element.transport,
                    name: element.name,
                    idPlace: ''
                  });
                break;
              }
            });
          });
          this.placeInfo.lat = results[0].geometry.location.lat();
          this.placeInfo.lng = results[0].geometry.location.lng();
          this.placeInfo.address = results[0].formatted_address;
          this.marker = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
          };
          this.mapCenter = this.marker;
          this.validAddress = true;
          this.addressError = "";
        } else {
          this.addressError = "Cette addresse n'existe pas";
          this.validAddress = false;
        }
    });
  }

//////////////////////////////////////////////  Complement  //////////////////////////////////////////////
  protected pictures: Pictures[] = [{id: "", src: "", id_place: "",id_user: ""}];
  protected crossIcon: IconDefinition = faXmark;
  protected uploadButtonInfos: ButtonInfos = {
    color: 'var(--mainColor)',
    backgroundColor: 'var(--black)'
  }
  facadeImage(event: string) {
    const image: Pictures = {
      id: this.placesService.setId(),
      src: event,
      id_place: this.placeInfo.id,
      id_user: localStorage.getItem("id")
    }
    this.pictures.push(image);
    if(this.placeInfo.id !== '') this.databaseService.addPicture(image);
  }
  removeImage(index: number){
    const id: string = this.pictures[index].id;
    this.pictures.splice(index,1);
    this.databaseService.deletePicture(id);
  }

//////////////////////////////////////////////  Error  //////////////////////////////////////////////
  protected errorMessage: string = "";
  protected nameError: string = "";
  protected addressError: string = "";
  protected categoryError: string = "";
  protected typeError: string = "";


//////////////////////////////////////////////  Navbar  //////////////////////////////////////////////
  protected logoImageSrc: string = "../../assets/logo/black_logo.png";
  protected buttonColor: ButtonInfos = {
    color: 'var(--mainColor)',
    colorActive: 'var(--black)',
    backgroundColor: 'var(--black)',
    backgroundColorActive: 'var(--mainColor)',
    fontWeight: 1000
  }
//////////////////////////////////////////////  Animation  //////////////////////////////////////////////
  protected firstSectionPosition: number = 0;
  protected showFirstTitle: string = "show";
  protected showSecondTitle: string = "hidden";

  moveTitle(scrollPosition: number): void {
    const stopLogoScroll: number = 500;
    this.firstSectionPosition = 15 - 5 * (scrollPosition/stopLogoScroll);
  }
//////////////////////////////////////////////  Background Page  //////////////////////////////////////////////
  protected backgroundColor: string = 'var(--mainColor)'

//////////////////////////////////////////////  Life cycle  //////////////////////////////////////////////
  protected device: string = "";
  protected allPlaces: Place[] = [];
  protected autocompleteName: SelectData[] = [];
  protected autocompleteAddress: SelectData[] = [];

  ngOnInit(){
    this.device = sessionStorage.getItem("device");
    this.showFirstTitle = "show";
    this.initOptions("");
    this.initMapSize();
  }
  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
  test(e: any){
    console.log(e)
  }
  add(){
    const idUser: string = localStorage.getItem("id");
    if(this.canSubmit()){
      this.errorMessage = "";
      this.databaseService.verifyExistingRestaurant(this.placeInfo.name,this.placeInfo.address).subscribe((res: Restaurant) => {
        if(res != null){
          this.placeInfo.id = res.id;
          this.databaseService.updateRestaurant(this.placeInfo);
        } else{
          this.placeInfo.id = this.placesService.setId();
          this.databaseService.addRestaurant(this.placeInfo);
          this.pictures.forEach((element: Pictures) => {
            element.id_user = this.placeInfo.id;
            this.databaseService.addPicture(element);
          }); 
          this.stations.forEach((element: Station) => {
            element.idPlace = this.placeInfo.id;
            this.databaseService.addStationOfPlace(element);
          });
          this.horaires.forEach((element: Horaires) => {
            element.id_place = this.placeInfo.id;
            this.databaseService.addHoraires(element);
          });
        }
        this.databaseService.addPlaceOfUser({idPlace: this.placeInfo.id, idUser: localStorage.getItem("id")});
        if(this.comment.id_place === '' || this.comment.id_user === ''){
          this.comment.id_place = this.placeInfo.id;
          this.comment.id_user = idUser;
          this.databaseService.addCommentRestaurants(this.comment);  
        } else {
          this.databaseService.updateCommentRestaurants(this.comment);
        }
        this.errorMessage = "Le " + this.placeInfo.category + " a été ajouté !";
        setTimeout(() => {
          this.router.navigate([sessionStorage.getItem("lastPage")]);
        }, 3000);
      });
    } else{
      this.errorMessage = "Le formulaire n'est pas complet";
      setTimeout(() => {
        this.errorMessage = "";
      },2000);
    }
    
    
  }
  
}
