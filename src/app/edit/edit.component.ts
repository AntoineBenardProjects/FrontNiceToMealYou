import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Position } from '../add/add.component';
import { Comment } from '../shared/model/table/comment';
import { blackButtonPlaceCard, validButtonAddComponent, invalidButtonAddComponent, uploadButtonInfosAddComponent, myPlacesButtonInfosAddComponent } from '../shared/model/design/buttonsDesign';
import { checkboxInfosAddComponent } from '../shared/model/design/checkboxesDesign';
import { horairesInputAddComponent, normalInputAddComponent, validInputAddComponent, invalidInputAddComponent, searchInputFilter, autocompleteInputInfosEditComponent } from '../shared/model/design/inputsDesign';
import { validSelectInfosAddComponent, invalidSelectInfosAddComponent } from '../shared/model/design/selectsDesign';
import { Horaires } from '../shared/model/table/horaires';
import { Pictures } from '../shared/model/table/pictures';
import { Place, City } from '../shared/model/table/places';
import { Station, Ligne } from '../shared/model/table/transports';
import { Type } from '../shared/model/table/type';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';
import { InputInfos, SelectInfos, ButtonInfos, CheckboxInfos, SelectData, AutocompleteInfos, RangeSliderInfos } from '../shared/model/designs';
import { Message } from '../shared/model/params/message';
import { PlaceCardParams } from '../shared/model/params/cardParams';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {  
  constructor(
    private databaseService: DatabaseService,
    private placesService: PlacesService,
    private router: Router,
    private route: ActivatedRoute) {}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected horairesInput: InputInfos = horairesInputAddComponent;
  protected normalInput: InputInfos = normalInputAddComponent;
  protected validInput: InputInfos = validInputAddComponent;
  protected invalidInput: InputInfos = invalidInputAddComponent;
  protected validSelectInfos: SelectInfos = validSelectInfosAddComponent;
  protected invalidSelectInfos: SelectInfos = invalidSelectInfosAddComponent;
  protected stationButtonInfos: ButtonInfos = blackButtonPlaceCard;
  protected validButton: ButtonInfos = validButtonAddComponent;
  protected invalidButton: ButtonInfos = invalidButtonAddComponent;
  protected uploadButtonInfos: ButtonInfos = uploadButtonInfosAddComponent;
  protected checkboxInfos: CheckboxInfos = checkboxInfosAddComponent;
  protected autocompleteInfos: AutocompleteInfos = autocompleteInputInfosEditComponent;
  protected myPlacesButtonInfos: ButtonInfos = myPlacesButtonInfosAddComponent;
/*  Css  */
  @HostBinding("style.--titleColor") titleColor: string = 'var(--secondColor)';
  @HostBinding("style.--pictureColor") pictureColor: string = 'var(--black)';
  @HostBinding("style.--stationColor1") stationColor1: string = 'var(--black)';
  @HostBinding("style.--stationColor2") stationColor2: string = 'var(--white)';
  @HostBinding("style.--backgroundHeaderHoraires1") backgroundHeaderHoraires1: string = 'var(--secondColor)';
  @HostBinding("style.--backgroundHeaderHoraires2") backgroundHeaderHoraires2: string = 'var(--black)';
  @HostBinding("style.--colorHeaderHoraires") colorHeaderHoraires1: string = 'var(--white)';
  @HostBinding("style.--colorBodyHoraires") colorBodyHoraires: string = 'var(--black)';
  protected backgroundColor: string = 'var(--mainColor)';
  protected logoImageSrc: string = "../../assets/logo/red_logo.png";
/*  Icons  */
  protected checkIcon: IconDefinition = faCheck;
  protected crossIcon: IconDefinition = faXmark;
/*  Selects  */
  protected typesSelect: SelectData[] = [];
  protected categoriesSelect: SelectData[] = [];
  protected autocompleteName: SelectData[] = [];
  protected autocompleteAddress: SelectData[] = [];
/*  Algos  */
  protected placeInfos: Place = {
    id: "",
    name: "",
    address: "",
    category: "",
    lat: 0,
    lng: 0,
    link_menu: "",
    website: "",
    visible: false,
    id_creator: null,
    id_city: "",
    creation: "",
    phone: "",
    postal: "",
    promotion: ""
  }
  protected selectedTypesIds: string[] = [];
  private formerTypesId: string[] = [];
  protected globalHoraires: Horaires = {
    day: "",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  }
  protected dayOpen: DayOpen = {
    Lundi: true,
    Mardi: true,
    Mercredi: true,
    Jeudi: true,
    Vendredi: true,
    Samedi: true,
    Dimanche: true
  }
  protected comment: Comment = {
    id_place: "",
    id_user: "",
    comment: "",
    tested: false
  }
  protected isValidAddress: boolean = false;
  private formerStations: Station[] = [];
  private formerHoraires: Horaires[] = [];
  protected stations: Station[] = [];
  protected horairesAdded: Horaires[] = [{
    day: "Lundi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Mardi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Mercredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Jeudi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Vendredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Samedi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  },
  {
    day: "Dimanche",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: "",
  }
  ];
  private city: City = {
    name: "",
    id: "",
    reg: "",
    land: "",
    department: ""
  }
  protected pictures: Pictures[] = [];
  private formerPictures: Pictures[] = [];
  private formerComment: Comment;
  protected errorMessage: string = "";
  protected error: boolean = false;
  protected addressError: string = "";
  protected categoryError: string = "";
  protected typeError: string = "";
  protected firstSectionPosition: number = -20;
  protected secondSectionPosition: number = -20;
  protected gradeSectionPosition: number = 70;
  protected horairesSectionPosition: number = 70;
  protected device: string = "";
  protected allPlaces: Place[] = [];
  protected options: string[] = ['Restaurant', 'Bar', 'Loisir', 'Service', 'Magasin', 'Autre'];
  protected facadeName: string = "Façade";
  protected allPictures: Pictures[] = [];
  protected rangeSliderInfos: RangeSliderInfos = {
    activeColor: "var(--thirdColor)",
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
    unit: "/10",
    initValue: 10,
    plus: true
  }
  
  protected setValue(event: any, params: string, day?: string, moment?: string): void{
    if(params === 'category'){
      this.categoriesSelect = event;
      const find: SelectData = event.find((element: SelectData) => element.selected === true);
      find != null ? this.placeInfos.category = find.name : this.placeInfos.category = "";
      this.placeInfos.category === "" ?  this.categoryError = "Le lieu doit appartenir à une catégorie" : this.categoryError = "";
      this.initOptions(this.placeInfos.category);
    }
    else if(params === 'type'){
      this.selectedTypesIds = [];
      const find: SelectData[] = event.filter((element: SelectData) => element.selected === true);
      if(find != null){
        find.forEach((type: SelectData) => {
          this.selectedTypesIds.push(type.id);
        });
      }
      this.selectedTypesIds.length === 0 ?  this.typeError = "Le lieu doit avoir au moins un type" : this.typeError = "";
    }
    else if(params === 'prix_cocktail' || params === 'prix_coffee' || params === 'prix_pinte')  this.placeInfos[params] = Number(event.target.value);
    else if(params === 'comment')   this.comment[params] = event.target.value;
    else if(params === 'website' || params === 'menu' || params === 'promotion' || params === 'name' || params === 'address')   this.placeInfos[params] = event.target.value;
    else if(params === 'price')  this.comment[params] = Number(event.target.value);
    else if(params === 'quantity' || params === 'service' ||params === 'tested' || params === 'visible' || params === 'quality_price')  this.placeInfos[params] = event;
    else if(params === 'horaires'){
      let find: Horaires = this.horairesAdded.find((element: Horaires) => element.day === day);
      find[moment] = event.target.value;
    }
  }
  protected setAllHoraires(event: any,moment: string): void{
    this.globalHoraires[moment] = event.target.value;
    this.horairesAdded.forEach((element: Horaires) => {
      element[moment] = event.target.value;
    });
    this.horairesAdded = this.horairesAdded.slice();
  }
  protected closeDay(day: string): void{
    this.dayOpen[day] = !this.dayOpen[day];
    let find: Horaires = this.horairesAdded.find((horaires: Horaires) => horaires.day === day);
    if(this.dayOpen[day]){
      find.ouverture = this.globalHoraires.ouverture;
      find.fermeture_midi = this.globalHoraires.fermeture_midi;
      find.ouverture_soir = this.globalHoraires.ouverture_soir;
      find.fermeture = this.globalHoraires.fermeture;  
    } else{
      find.ouverture = '';
      find.fermeture_midi = '';
      find.ouverture_soir = '';
      find.fermeture = '';  
    }
    this.horairesAdded = this.horairesAdded.slice();
  }
  private initOptions(category: string,fill?: boolean): void{
    this.autocompleteName,this.selectedTypesIds = [];
    this.databaseService.getAllTypes().subscribe((types: Type[]) => {
      if(fill){
        this.databaseService.getTypesOfPlace(this.placeInfos.id).subscribe((t: Type[]) => {
          types.forEach((type: Type) => {
            if(type.category === category) {
              let select: boolean = false;
              if(t.find(ty => ty.id === type.id) != null){
                select = true;
                this.selectedTypesIds.push(type.id);
                this.formerTypesId.push(type.id)
              }
              const selectValue: SelectData = {
                id: type.id,
                name: type.name,
                selected: select
              }
              this.typesSelect.push(selectValue);
            }
          });
          this.typesSelect = [...this.typesSelect];
        })
      } else{
        types.forEach((type: Type) => {
          if(type.category === category) {
            const selectValue: SelectData = {
              id: type.id,
              name: type.name,
              selected: false
            }
            this.typesSelect.push(selectValue);
          }
        });
      }
      this.typesSelect = [...this.typesSelect];
    });
    this.categoriesSelect = [
      {id: "res", name: "Restaurant",selected: category === 'Restaurant' ? true : false},
      {id: "bar", name: "Bar",selected: category === 'Bar' ? true : false},
      {id: "loi", name: "Loisir",selected: category === 'Loisir' ? true : false},
      {id: "mag", name: "Magasin",selected: category === 'Magasin' ? true : false},
      {id: "ser", name: "Service",selected: category === 'Service' ? true : false},
      {id: "aut", name: "Autre",selected: category === 'Autre' ? true : false},
    ];
    this.databaseService.getAllPlacesByCategory(category).subscribe((allPlaceOfCategory: Place[]) => {
      this.allPlaces = allPlaceOfCategory;
      allPlaceOfCategory.forEach((element: Place) => {
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
  }
  protected canSubmit() : boolean{
    if(this.placeInfos.name.length > 2 && this.isValidAddress && this.placeInfos.category !== '' && this.selectedTypesIds.length !== 0){
      return true;
    }
    return false;
  }  
  protected nameFilled(): void{
    if(this.placeInfos.id === '' && this.placeInfos.address !== '') this.checkAddress();
  }
  protected checkAddress(): void{
    this.stations = [];
    let geocoder = new google.maps.Geocoder();
    const fullAddress: string = this.placeInfos.name + ", " + this.placeInfos.address;
    geocoder.geocode({
      'address': fullAddress
    }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          results[0].address_components.forEach((element: google.maps.GeocoderAddressComponent) => {
            if(element.types[0] === 'locality') this.city.name = element.long_name;
            else if(element.types[0] === 'administrative_area_level_2') this.city.department = element.long_name;
            else if(element.types[0] === 'administrative_area_level_1') this.city.reg = element.long_name;
            else if(element.types[0] === 'country') this.city.land = element.long_name;
            else if(element.types[0] === 'postal_code') this.placeInfos.postal = element.long_name;
          });
          this.databaseService.getStationOfPlaceByCoords({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }).subscribe((res: Station[]) => {
            this.stations = res;
            let counter: number = 0;
            this.stations.forEach((element:Station) => {
              element.lignes = [];
              this.databaseService.getLignesOfStation(element.id).subscribe((lignes: Ligne[]) => {
                counter++;
                lignes.sort((a: Ligne, b: Ligne) => {
                  if(a.name < b.name) return -1;
                    return 1;
                });
                lignes.forEach((ligne: Ligne) => {
                  element.lignes.push(ligne);
                });
                element.reg = lignes[0].reg;
                if(counter === this.stations.length){
                  this.stations.sort((a:Station, b:Station) => {
                    if(a.name < b.name) return -1;
                    return 1;
                  });
                }
              });
            });
          });
          this.placeInfos.lat = results[0].geometry.location.lat();
          this.placeInfos.lng = results[0].geometry.location.lng();
          this.placeInfos.address = results[0].formatted_address;
          this.isValidAddress = true;
          this.addressError = "";
        } else {
          this.addressError = "Cette addresse n'existe pas";
          this.isValidAddress = false;
        }
    });
  }
  protected addImage(event: string): void {
    const image: Pictures = {
      id: this.placesService.setId(),
      src: event,
      id_place: this.placeInfos.id,
      id_user: localStorage.getItem("id")
    }
    this.pictures.push(image);
    if(this.placeInfos.id !== '') this.databaseService.addPicture(image);
  }
  protected removeImage(index: number): void {
    const id: string = this.pictures[index].id;
    this.pictures.splice(index,1);
    this.databaseService.deletePicture(id);
  }
  protected fillForm(id: string): void{
    this.databaseService.getPlaceInfos(id, localStorage.getItem("id")).subscribe((infos: PlaceCardParams) =>{
      this.placeInfos = infos.place;
      this.stations = infos.stations;
      this.formerHoraires = infos.horaires;
      infos.horaires.length > 0 ? this.horairesAdded = infos.horaires : this.horairesAdded = [{
        day: "Lundi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Mardi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Mercredi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Jeudi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Vendredi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Samedi",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          },
      {
        day: "Dimanche",
        ouverture: "",
        fermeture_midi: "",
        ouverture_soir: "",
        fermeture: "",
        id_place: infos.place.id,
          }];
      this.pictures = infos.pictures.filter((element: Pictures) => element.id_user === localStorage.getItem("id"));
      this.formerComment = infos.comments.find((element: Comment) => element.id_user === localStorage.getItem("id"));
      this.formerComment != null ? this.comment = this.formerComment : this.comment = {
        id_place: "",
        id_user: "",
        comment: "",
        tested: false
      }
      let counter: number = 0;
      this.stations.forEach((element:Station) => {
        element.lignes = [];
        this.databaseService.getLignesOfStation(element.id).subscribe((lignes: Ligne[]) => {
          counter++;
          lignes.sort((a: Ligne, b: Ligne) => {
            if(a.name < b.name) return -1;
              return 1;
          });
          lignes.forEach((ligne: Ligne) => {
            element.lignes.push(ligne);
          });
          element.reg = lignes[0].reg;
          if(counter === this.stations.length){
            this.stations.sort((a:Station, b:Station) => {
              if(a.name < b.name) return -1;
              return 1;
            });
          }
        });
      });
      this.isValidAddress = true;
      this.addressError = "";
      this.initOptions(this.placeInfos.category,true);
    });
  } 
  private setColorsOnScroll(): void {
    let firstSectionPosition:Position = {
      top:0,
      height: 0
    } 
    let complementSectionPosition:Position = {
      top: 0,
      height:0
    };
    let gradeSectionPosition:Position = {
      top: 0,
      height:0
    };
    let horairesSectionPosition:Position = {
      top: 0,
      height:0
    };
    if(document.getElementById("firstSection") != null){
      firstSectionPosition = {
        top:document.getElementById("firstSection").getBoundingClientRect().top + document.getElementById("firstSection").getBoundingClientRect().height,
        height: document.getElementById("firstSection").getBoundingClientRect().height
      } 
    }
    if(document!.getElementById("complementSection") != null){
      complementSectionPosition = {
        top:document!.getElementById("complementSection").getBoundingClientRect().top + document.getElementById("complementSection").getBoundingClientRect().height,
        height: document!.getElementById("complementSection").getBoundingClientRect().height
      } 
    }
    if(document!.getElementById("gradeSection") != null){
      gradeSectionPosition = {
        top:document!.getElementById("gradeSection").getBoundingClientRect().top + document.getElementById("gradeSection").getBoundingClientRect().height,
        height: document!.getElementById("gradeSection").getBoundingClientRect().height
      } 
    }
    if(document!.getElementById("horairesSection") != null){
      horairesSectionPosition = {
        top:document!.getElementById("horairesSection").getBoundingClientRect().top + document.getElementById("horairesSection").getBoundingClientRect().height,
        height: document!.getElementById("horairesSection").getBoundingClientRect().height
      } 
    }
    
    if(firstSectionPosition.top > 0 && firstSectionPosition.top < firstSectionPosition.height){
      this.logoImageSrc = "../../assets/logo/red_logo.png";
      this.backgroundColor = 'var(--mainColor)';
      this.canSubmit() ? this.titleColor = 'var(--thirdColor)' : this.titleColor = 'var(--secondColor)';
      this.normalInput = {
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
      this.uploadButtonInfos = {
        color: 'var(--mainColor)',
        backgroundColor: 'var(--black)'
      }
      this.pictureColor = 'var(--black)';
      this.stationColor1 = 'var(--secondColor)';
      this.stationColor2 = 'var(--mainColor)';
      this.backgroundHeaderHoraires1 = 'var(--secondColor)';
      this.backgroundHeaderHoraires2 = 'var(--black)';
      this.colorHeaderHoraires1 = 'var(--white)';
      this.colorBodyHoraires = 'var(--black)';
      this.stationButtonInfos = {
        color: 'var(--secondColor)',
        colorActive: 'var(--mainColor)',
        borderColor: 'var(--secondColor)',
        borderColorActive: 'var(--secondColor)',
        backgroundColor: 'var(--mainColor)',
        backgroundColorActive: 'var(--secondColor)',
        fontSize: "16px",
        heightIcon: "30px",
        radius: "50%"
    }
    }
    else if((complementSectionPosition.top > 0 && complementSectionPosition.top < complementSectionPosition.height) || (gradeSectionPosition.top > 0 && gradeSectionPosition.top < gradeSectionPosition.height)){
      this.logoImageSrc = "../../assets/logo/white_logo.png";
      this.backgroundColor = 'var(--black)';
      this.titleColor = 'var(--white)';
      this.stationButtonInfos = blackButtonPlaceCard;

      this.normalInput = {
        color: "var(--white)",
        placeholderColor: "var(--white)",
        placeholderColorActive: "var(--white)",
        backgroundColor: "var(--black)",
        borderColor: "var(--white)",
        borderColorActive: "var(--white)",
        hoverBackgroundColor: "var(--white)",
        hoverTextColor: "var(--black)",
        hoverBorderColor: "var(--white)",
      }
      this.uploadButtonInfos = {
        color: 'var(--black)',
        backgroundColor: 'var(--white)'
      }
      this.pictureColor = 'var(--white)';
      this.stationColor1 = 'var(--white)';
      this.stationColor2 = 'var(--black)';
      this.backgroundHeaderHoraires1 = 'var(--white)';
      this.backgroundHeaderHoraires2 = 'var(--mainColor)';
      this.colorHeaderHoraires1 = 'var(--black)';
      this.colorBodyHoraires = 'var(--white)';
    } else if(horairesSectionPosition.top > 0 && horairesSectionPosition.top < horairesSectionPosition.height){
      this.logoImageSrc = "../../assets/logo/black_logo.png";
      this.titleColor = 'var(--black)';
      this.backgroundColor = 'var(--white)';
      this.backgroundHeaderHoraires1 = 'var(--black)';
      this.backgroundHeaderHoraires2 = 'var(--secondColor)';
      this.colorHeaderHoraires1 = 'var(--white)';
      this.colorBodyHoraires = 'var(--black)';
    }
  }
  private moveTitle(scrollPosition: number): void {
    if(document.getElementById("firstSection") != null){
      const firstSectionTitleEnd:number = document.getElementById("firstSection").getBoundingClientRect().height/5;    
      this.firstSectionPosition = -20 - 5 * (scrollPosition/firstSectionTitleEnd);  
    }

    if(document.getElementById("complementSection") != null){
      const complementSectionTitleEnd:number = document.getElementById("complementSection").getBoundingClientRect().height/5;    
      this.secondSectionPosition = -20 - 5 * (scrollPosition/complementSectionTitleEnd);  
    }

    if(document.getElementById("gradeSection")!=null){
      const gradeSectionTitleEnd:number = document.getElementById("gradeSection").getBoundingClientRect().height/5;    
      this.gradeSectionPosition = 70 - 5 * (scrollPosition/gradeSectionTitleEnd);  
    }

    if(document.getElementById("horairesSection")!=null){
      const horairesSectionTitleEnd:number = document.getElementById("horairesSection").getBoundingClientRect().height/5;    
      this.horairesSectionPosition = 70 - 5 * (scrollPosition/horairesSectionTitleEnd);  
    }
  }
  private ngOnInit(){
    this.device = sessionStorage.getItem("device");
    this.initOptions("");
    this.route.queryParams.subscribe(params => {
      if(params['id'] != null){
        this.fillForm(params['id']);   
      }
    });
  }
  private ngAfterContentInit(){
    window.addEventListener("wheel", () => {
      this.moveTitle(window.scrollY);
    });    
    window.addEventListener("scroll", () => {
      this.moveTitle(window.scrollY);
      this.setColorsOnScroll();
    });
  }
  protected test(e: any){
    console.log(e)
  }
  protected add(){
    const idUser: string = localStorage.getItem("id");
    if(this.canSubmit()){
      this.errorMessage = "";
      this.databaseService.verifyExistingPlace(this.placeInfos).subscribe((res: Place) => {
        if(res != null){
          this.databaseService.getCityIdByProperties(this.city).subscribe((res: City) => {
            if(res != null){
              this.placeInfos.id_city = res.id;
            } else{
              this.city.id = this.placesService.setId();
              this.databaseService.addCity(this.city);
            }
            this.databaseService.updatePlaceByCategory(this.placeInfos).subscribe((message: Message) => {
              console.log(message)
            });
          });
          this.formerTypesId.forEach((userType: string) => {
            if(this.selectedTypesIds.find((type: string) => type === userType) == null){
              this.databaseService.deleteTypeOfUser(this.placeInfos.id,userType);
            }
          });
          this.selectedTypesIds.forEach((type: string) => {
            if(this.formerTypesId.find((userType: string) => type === userType) == null){
              this.databaseService.addTypeOfUser(this.placeInfos.id,type);
            }
          });
          this.formerPictures.forEach((userPicture: Pictures) => {
            if(this.pictures.find((picture: Pictures) => picture.id === userPicture.id) == null){
              this.databaseService.deletePicture(userPicture.id);
            }
          });
          this.pictures.forEach((picture: Pictures) => {
            if(this.formerPictures.find((userPicture: Pictures) => picture.id === userPicture.id) == null){
              this.databaseService.addPicture(picture);
            }
          });
          this.formerStations.forEach((userStation: Station) => {
            if(this.stations.find((station: Station) => station.id === userStation.id) == null){
              this.databaseService.deleteStationOfUser(this.placeInfos.id,userStation.id);
            }
          });
          this.stations.forEach((station: Station) => {
            if(this.formerStations.find((userStation: Station) => userStation.id === station.id) == null){
              this.databaseService.addStationOfUser(this.placeInfos.id,station.id);
            }
          });
          if(this.formerHoraires.length > 0){
            this.horairesAdded.forEach((element: Horaires) => {
              element.id_place = this.placeInfos.id;
              element.id_user = localStorage.getItem("id")
              this.databaseService.updateHoraires(element);
            });
          } else{
            this.horairesAdded.forEach((element: Horaires) => {
              element.id_place = this.placeInfos.id;
              element.id_user = localStorage.getItem("id")
              this.databaseService.addHoraires(element);
            });
          }
          
          // if(this.placeInfos.tested){
          //   this.comment.id_place = this.placeInfos.id;
          //   this.comment.id_user = idUser;
          //   if(this.formerComment != null){
          //     this.databaseService.updateComment(this.comment,this.placeInfos.category).subscribe((message: Message) => {
          //       console.log(message);
          //     }); 
          //   } else{
          //     this.databaseService.addComment(this.comment, this.placeInfos.category).subscribe((message: Message) => {
          //       console.log(message);
          //     }); 
          //   }
          // }
          this.error = false;
          this.errorMessage = "Le "+ this.placeInfos.category + " a été modifié";
          setTimeout(() => {
            if(sessionStorage.getItem("lastPage") != null)  this.router.navigate([sessionStorage.getItem("lastPage")]);
            else  window.location.reload();
          }, 3000);
        } else{
          this.errorMessage = "Ce " + this.placeInfos.category + "  n'existe pas";
        }
      });
    } else{
      this.error = true;
      this.errorMessage = "Le formulaire n'est pas complet";
      setTimeout(() => {
        this.errorMessage = "";
      },2000);
    }
    
    
  }
}

interface DayOpen{
  Lundi: boolean,
  Mardi: boolean,
  Mercredi: boolean,
  Jeudi: boolean,
  Vendredi: boolean,
  Samedi: boolean,
  Dimanche: boolean
}
