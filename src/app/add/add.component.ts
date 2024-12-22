import { Component, HostBinding } from '@angular/core';
import { Comment } from '../shared/model/table/comment';
import { Horaires } from '../shared/model/table/horaires';
import { Pictures } from '../shared/model/table/pictures';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { City, Place } from '../shared/model/table/places';
import { ButtonInfos, CheckboxInfos, InputInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { faCheck, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PlacesService } from '../services/places.service';
import { Ligne, Station } from '../shared/model/table/transports';
import { PlaceOfUser } from '../shared/model/table/user';
import { invalidSelectInfosAddComponent, validSelectInfosAddComponent } from '../shared/model/design/selectsDesign';
import { horairesInputAddComponent, invalidInputAddComponent, normalInputAddComponent, validInputAddComponent } from '../shared/model/design/inputsDesign';
import { blackButtonPlaceCard, iconsAddComponent, iconsFirstPageComponent, invalidButtonAddComponent, myPlacesButtonInfosAddComponent, uploadButtonInfosAddComponent, validButtonAddComponent } from '../shared/model/design/buttonsDesign';
import { checkboxInfosAddComponent } from '../shared/model/design/checkboxesDesign';
import { Type, TypeOfPlace } from '../shared/model/table/type';
import { Message } from '../shared/model/params/message';
import { TopHeight } from '../shared/model/displayValues/general';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: []
})
export class AddComponent {
  
  constructor(
    private databaseService: DatabaseService,
    private placesService: PlacesService,
    private router: Router) {}


//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected horairesInput: InputInfos = horairesInputAddComponent;
  protected normalInput: InputInfos = normalInputAddComponent;
  protected validInput: InputInfos = validInputAddComponent;
  protected invalidInput: InputInfos = invalidInputAddComponent;
  protected validSelectInfos: SelectInfos = validSelectInfosAddComponent;
  protected invalidSelectInfos: SelectInfos = invalidSelectInfosAddComponent;
  protected stationButtonInfos: ButtonInfos = blackButtonPlaceCard;
  protected myPlacesButtonInfos: ButtonInfos = myPlacesButtonInfosAddComponent;
  protected validButtonInfos: ButtonInfos = validButtonAddComponent;
  protected invalidButtonInfos: ButtonInfos = invalidButtonAddComponent;
  protected uploadButtonInfos: ButtonInfos = uploadButtonInfosAddComponent;
  protected checkboxInfos: CheckboxInfos = checkboxInfosAddComponent;
  protected iconsInfos: ButtonInfos = iconsAddComponent;

/*  Css  */
  @HostBinding("style.--titleColor") titleColor: string = 'var(--errorColor)';
  @HostBinding("style.--pictureColor") pictureColor: string = 'var(--black)';
  @HostBinding("style.--stationColor1") stationColor1: string = 'var(--black)';
  @HostBinding("style.--stationColor2") stationColor2: string = 'var(--white)';
  @HostBinding("style.--backgroundHeaderHoraires1") backgroundHeaderHoraires1: string = 'var(--errorColor)';
  @HostBinding("style.--backgroundHeaderHoraires2") backgroundHeaderHoraires2: string = 'var(--black)';
  @HostBinding("style.--colorHeaderHoraires") colorHeaderHoraires1: string = 'var(--white)';
  @HostBinding("style.--colorBodyHoraires") colorBodyHoraires: string = 'var(--black)';

/*  Icons  */
  protected checkIcon: IconDefinition = faCheck;
  protected crossIcon: IconDefinition = faXmark;
/*  Selects  */
  protected typeSelect: SelectData[] = [];
  protected categorySelect: SelectData[] = [];
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
    postal: "",
    phone: "",
    promotion: ""
  }
  protected picturesAdded: Pictures[] = [];
  protected stationsAdded: Station[] = [];
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
  //Contient les ids des types sélectionnés
  protected selectedTypesIds: string[] = [];
  //Contient l'horaire type rempli par l'utilisateur afin que chaque jour puisse prendre ses valeurs
  protected globalHoraires: Horaires = {
    day: "",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  }
  //Contient un boolean par jour disant si celui-ci est ouvert
  protected dayOpen: isDayOpen = {
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
  private cityOfPlace: City = {
    name: "",
    id: "",
    reg: "",
    land: "",
    department: ""
  }
  protected firstSectionPosition: number = -20;
  protected secondSectionPosition: number = -20;
  protected gradeSectionPosition: number = 70;
  protected horairesSectionPosition: number = 70;
  protected isValidAddress: boolean = false;
  protected errorMessage: string = "";
  protected addressError: string = "";
  protected categoryError: string = "";
  protected typeError: string = "";
  protected logoImageSrc: string = "../../assets/logo/red_logo.png";
  protected backgroundColor: string = 'var(--mainColor)';
  protected device: string = "";

//////////////////////////////////////////////  Form  ////////////////////////////////////////////// 
  protected setValue(event: any, params: string, day?: string, moment?: string): void{
    if(params === 'category'){
      this.categorySelect = event;
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
    else if(params === 'prix_cocktail' || params === 'prix_coffee' || params === 'prix_pinte')   this.placeInfos[params] = Number(event.target.value);
    else if(params === 'comment')   this.comment[params] = event.target.value;
    else if(params === 'website' || params === 'menu' || params === 'promotion' || params === 'name' || params === 'address')   this.placeInfos[params] = event.target.value;
    else if(params === 'quantity' || params === 'quality_price' || params === 'service' || params === 'price')  this.comment[params] = Number(event.target.value);
    else if(params === 'visible')  this.placeInfos[params] = event;
    else if(params === 'tested')  this.comment[params] = event;
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
    let find: Horaires = this.horairesAdded.find((horairesAdded: Horaires) => horairesAdded.day === day);
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
  private initOptions(category: string): void{
    if(category !== ''){
      this.databaseService.getAllTypes().subscribe((types: Type[]) => {
        types.forEach((type: Type) => {
          if(type.category === category) {
            const selectValue: SelectData = {
              id: type.id,
              name: type.name
            }
            this.typeSelect.push(selectValue);
          }
        });
        this.typeSelect = [...this.typeSelect];
      });
    } else{
      this.categorySelect = [
        {id: "res", name: "Restaurant",selected: false},
        {id: "bar", name: "Bar",selected: false},
        {id: "loi", name: "Loisir",selected: false},
        {id: "mag", name: "Magasin",selected: false},
        {id: "ser", name: "Service",selected: false},
        {id: "aut", name: "Autre",selected: false},
      ];
      this.typeSelect = [];
    }
  }
  protected canSubmit() : boolean{
    if(this.placeInfos.name.length > 2 && this.isValidAddress && this.placeInfos.category !== ''){
      if(this.placeInfos.category === "Autre") return true;
      else if(this.selectedTypesIds.length !== 0) return true;
    }
    return false;
  }
  protected nameFilled(): void{
    if(this.placeInfos.address !== '') this.checkAddress();
  }
  protected checkAddress(): void{
    this.stationsAdded = [];
    let geocoder = new google.maps.Geocoder();
    const fullAddress: string = this.placeInfos.name + ", " + this.placeInfos.address;
    geocoder.geocode({
      'address': fullAddress
    }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          results[0].address_components.forEach((element: google.maps.GeocoderAddressComponent) => {
            if(element.types[0] === 'locality') this.cityOfPlace.name = element.long_name;
            else if(element.types[0] === 'administrative_area_level_2') this.cityOfPlace.department = element.long_name;
            else if(element.types[0] === 'administrative_area_level_1') this.cityOfPlace.reg = element.long_name;
            else if(element.types[0] === 'country') this.cityOfPlace.land = element.long_name;
            else if(element.types[0] === 'postal_code') this.placeInfos.postal = element.long_name;
          });
          this.databaseService.getCityIdByProperties(this.cityOfPlace).subscribe((city: City) => {
            if(city.id != null) this.cityOfPlace.id = city.id;
            else{
              this.cityOfPlace.id = this.placesService.setId();
              this.databaseService.addCity(this.cityOfPlace).subscribe((message: Message) => {
                console.log(message);
              });
            }
          });
          this.databaseService.getStationOfPlaceByCoords({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }).subscribe((stationsOfPlace: Station[]) => {
            this.stationsAdded = this.placesService.getCopyOfElement(stationsOfPlace);
            let counter: number = 0;
            this.stationsAdded.forEach((element:Station) => {
              element.lignes = [];
              this.databaseService.getLignesOfStation(element.id).subscribe((lignesOfStation: Ligne[]) => {
                counter++;
                lignesOfStation.sort((a: Ligne, b: Ligne) => {
                  if(a.name < b.name) return -1;
                    return 1;
                });
                lignesOfStation.forEach((ligne: Ligne) => {
                  element.lignes.push(ligne);
                });
                element.reg = lignesOfStation[0].reg;
                if(counter === this.stationsAdded.length){
                  this.stationsAdded.sort((a:Station, b:Station) => {
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
  protected addImage(event: string) {
    const image: Pictures = {
      id: this.placesService.setId(),
      src: event,
      id_place: this.placeInfos.id,
      id_user: localStorage.getItem("id")
    }
    this.picturesAdded.push(image);
  }
  protected removeImage(index: number){
    this.picturesAdded.splice(index,1);
  }  
  private setColorsOnScroll(): void {
    let firstSectionPosition:TopHeight = {
      top:0,
      height: 0
    } 
    let complementSectionPosition:TopHeight = {
      top: 0,
      height:0
    };
    let gradeSectionPosition:TopHeight = {
      top: 0,
      height:0
    };
    let horairesSectionPosition:TopHeight = {
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
      this.canSubmit() ? this.titleColor = 'var(--successColor)' : this.titleColor = 'var(--errorColor)';
      this.normalInput = {
        color: "var(--black)",
        placeholderColor: "var(--black)",
        placeholderColorActive: "var(--successColor)",
        backgroundColor: "var(--mainColor)",
        borderColor: "var(--black)",
        borderColorActive: "var(--successColor)",
        hoverBackgroundColor: "var(--successColor)",
        hoverTextColor: "var(--white)",
        hoverBorderColor: "var(--successColor)",
      }
      this.pictureColor = 'var(--black)';
      this.stationColor1 = 'var(--errorColor)';
      this.stationColor2 = 'var(--mainColor)';
      this.backgroundHeaderHoraires1 = 'var(--errorColor)';
      this.backgroundHeaderHoraires2 = 'var(--black)';
      this.colorHeaderHoraires1 = 'var(--white)';
      this.colorBodyHoraires = 'var(--black)';
      this.stationButtonInfos = {
        color: 'var(--errorColor)',
        colorActive: 'var(--mainColor)',
        borderColor: 'var(--errorColor)',
        borderColorActive: 'var(--errorColor)',
        backgroundColor: 'var(--mainColor)',
        backgroundColorActive: 'var(--errorColor)',
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
      this.backgroundHeaderHoraires2 = 'var(--errorColor)';
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
  private ngOnInit(): void{
    this.device = sessionStorage.getItem("device");
    this.initOptions("");
  }
  private ngAfterContentInit(): void{
    window.addEventListener("wheel", () => {
      this.moveTitle(window.scrollY);
      this.setColorsOnScroll();
    });    
    window.addEventListener("scroll", () => {
      this.moveTitle(window.scrollY);
      this.setColorsOnScroll();
    });
  }
  protected test(e: any): void{
    console.log(e)
  }
  protected add(): void{
    const idUser: string = localStorage.getItem("id");
    if(this.canSubmit()){
      this.errorMessage = "";
      this.databaseService.verifyExistingPlace(this.placeInfos).subscribe((res: boolean) => {
        if(res){
          this.errorMessage = "Ce " + this.placeInfos.category + "  existe déjà";
        } else{
          this.placeInfos.id = this.placesService.setId();
          this.placeInfos.id_creator = localStorage.getItem("id");
          this.placeInfos.creation = this.placesService.convertDateToString(new Date());
          this.placeInfos.id_city = this.cityOfPlace.id;
          const placeOfUser: PlaceOfUser = {idPlace: this.placeInfos.id,idUser: localStorage.getItem("id")};
          this.databaseService.addPlaceOfUser(placeOfUser);
          this.databaseService.addPlaceByCategory(this.placeInfos).subscribe((message: Message) => {
            console.log(message);
          });
          if(this.comment.tested){
            this.comment.id_place = this.placeInfos.id;
            this.comment.id_user = idUser;
            this.databaseService.addComment(this.comment, this.placeInfos.category).subscribe((message: Message) => {
              console.log(message);
            }); 
          }
          this.selectedTypesIds.forEach((type: string) => {
            const typeOfPlace: TypeOfPlace = {id_type: type,id_place: this.placeInfos.id};
            this.databaseService.addTypeOfPlace(typeOfPlace).subscribe((message: Message) => {
              console.log(message);
            }); 
          });
          this.picturesAdded.forEach((element: Pictures) => {
            element.id_user = this.placeInfos.id;
            this.databaseService.addPicture(element).subscribe((message: Message) => {
              console.log(message);
            }); 
          }); 
          this.stationsAdded.forEach((element: Station) => {
            this.databaseService.addStationOfPlace(this.placeInfos.id, element.id).subscribe((message: Message) => {
              console.log(message);
            }); 
          });
          this.horairesAdded.forEach((element: Horaires) => {
            element.id_place = this.placeInfos.id;
            element.id_user = localStorage.getItem("id")
            this.databaseService.addHoraires(element).subscribe((message: Message) => {
              // console.log(message);
            }); 
          });
          this.errorMessage = "Le "+ this.placeInfos.category + " a été ajouté";
          setTimeout(() => {
            if(sessionStorage.getItem("lastPage") != null)  this.router.navigate([sessionStorage.getItem("lastPage")]);
            else  window.location.reload();
          }, 3000);
        }
      });
    } else{
      this.errorMessage = "Le formulaire n'est pas complet";
      setTimeout(() => {
        this.errorMessage = "";
      },2000);
    }
    
    
  }
  protected navigate(url: string): void{
    this.router.navigate([url]);
  }
}

interface isDayOpen{
  Lundi: boolean,
  Mardi: boolean,
  Mercredi: boolean,
  Jeudi: boolean,
  Vendredi: boolean,
  Samedi: boolean,
  Dimanche: boolean
}

