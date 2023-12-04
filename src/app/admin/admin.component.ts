import { Component, HostBinding } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Ligne, Station } from '../shared/model/table/transports';
import { selectInfosAdminComponent } from '../shared/model/design/selectsDesign';
import { SelectInfos, SelectData, InputInfos, ButtonInfos } from '../shared/model/designs';
import { IconDefinition, faMinus, faPlus, faSortDown, faSortUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { classicButtonColorInfosAdminComponent, greenIconsAdminComponent, iconsAdminComponent, redIconsAdminComponent, uploadButtonUserComponent } from '../shared/model/design/buttonsDesign';
import { Type } from '../shared/model/table/type';
import { User } from '../shared/model/table/user';
import { PlacesService } from '../services/places.service';
import { Subject } from 'rxjs';
import { Message } from '../shared/model/params/message';
import { searchInputInfosAdminComponent, tableInputInfosAdminComponent } from '../shared/model/design/inputsDesign';
import { City, Place } from '../shared/model/table/places';
import { Comment } from '../shared/model/table/comment';
import { Horaires } from '../shared/model/table/horaires';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(private databaseService: DatabaseService, private placesService: PlacesService){}
  //////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Infos style  */
  protected selectInfosRegion: SelectInfos = selectInfosAdminComponent;
  protected classicButtonColorInfos: ButtonInfos = classicButtonColorInfosAdminComponent;
  protected selectInfosType: SelectInfos = selectInfosAdminComponent;
  protected iconsInfos: ButtonInfos = iconsAdminComponent;
  protected redIconsInfos: ButtonInfos = redIconsAdminComponent;
  protected greenIconsInfos: ButtonInfos = greenIconsAdminComponent;
  protected searchInputInfos: InputInfos = searchInputInfosAdminComponent;
  protected tableInputInfos: InputInfos = tableInputInfosAdminComponent
  protected uploadButton: ButtonInfos = uploadButtonUserComponent;
  /*  Icons  */
  protected downIcon: IconDefinition = faSortDown;
  protected upIcon: IconDefinition = faSortUp;
  protected minusIcon: IconDefinition = faMinus;
  protected plusIcon: IconDefinition = faPlus;
  protected crossIcon: IconDefinition = faXmark;
  /*  Css  */
  @HostBinding('style.--navigateBackground') navigateBackground: string = "var(--black)";
  @HostBinding('style.--navigateColor') navigateColor: string = "var(--mainColor)";
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";
  protected divToShow = "database";
  protected animationChange: string = "";
  protected backgroundColor: string = "var(--mainColor)";
  /*  Algos  */
  protected actionSelectLignes: SelectData[] = [];
  protected actionSelectStations: SelectData[] = [];
  protected actionSelectUsers: SelectData[] = [];
  protected actionSelectTypes: SelectData[] = [];
  protected actionLignes: string = "";
  protected actionStations: string = "";
  protected actionUsers: string = "";
  protected actionTypes: string = "";
  private selectedLigne: string = "";
  protected regionsSelect: SelectData[] = [];
  protected transportsSelect: SelectData[] = [];
  protected lignesSelect: SelectData[] = [];
  private lignesOfSelectedRegion: Ligne[] = [];
  protected selectedTransport: string = "";
  protected stationsToShow: Station[] = [];
  protected stationsToAdd: Station[] = [];
  protected stationsToDelete: Station[] = [];
  protected lignesToShow: Ligne[] = [];
  protected lignesToAdd: Ligne[] = [];
  protected lignesToDelete: Ligne[] = [];
  protected selectedRegion: string = "";
  protected categoriesSelect: SelectData[] = [
    {id: "Restaurant", name: "Restaurant", selected: false},
    {id: "Bar", name: "Bar", selected: false},
    {id: "Loisir", name: "Loisir", selected: false},
    {id: "Service", name: "Service", selected: false},
    {id: "Magasin", name: "Magasin", selected: false},
    {id: "Autre", name: "Autre", selected: false},
  ];
  protected statsSelects: SelectData[] = [];
  protected typesToShow: Type[] = [];
  protected typesToAdd: Type[] = [];
  protected deleteTypes: Type[] = [];
  protected category: string = "";
  protected usersToShow: User[] = [];
  protected usersToAdd: User[] = [];
  protected deleteUsers: User[] = [];
  protected newRegion: string = "";
  protected errorMessage: string = "";
  protected error: boolean = false;

  //////////////////////////////////////////////  Get Data  //////////////////////////////////////////////
  private ngOnInit(): void{
    const defaultsActionsSelects: SelectData[] = [
      {id: 'add',name: "Ajouter"},
      {id: 'mod',name: "Modifier"},
      {id: 'supp',name: "Supprimer"},
    ];
    this.actionSelectLignes = defaultsActionsSelects;
    this.actionSelectStations = defaultsActionsSelects;
    this.actionSelectTypes = defaultsActionsSelects;
    this.actionSelectUsers = defaultsActionsSelects;
    this.getData();
    this.initData();
  }
  private initData(): void{
    this.lignesToAdd = [{
      id: this.placesService.setId(),
      name: "",
      picture: "",
      reg: this.selectedRegion,
      transport: this.selectedTransport,
    }];
    this.stationsToAdd = [{
      id: this.placesService.setId(),
      name: "",
      lat: 0,
      lng: 0,
      reg: this.selectedRegion,
      lignes: JSON.parse(JSON.stringify(this.lignesOfSelectedRegion.slice()))
    }];
    this.typesToAdd = [{
      id: this.placesService.setId(),
      name: "",
      picture: "",
      color: "",
      icon: "",
      category: this.category
    }];
    this.usersToAdd = [{
      id: this.placesService.setId(),
      login: "",
      password: "",
      role: "",
      img: "",
    }]
  }
  private getData():void{
    this.databaseService.getAllRegion().subscribe((res: string[]) => {
      res.forEach((element: string) => {
        this.regionsSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
      this.regionsSelect = this.regionsSelect.slice();
    });
    this.databaseService.getAllUsers().subscribe((res: User[]) => {
      this.usersToShow = res;
    });
  }
  protected setPreferenceGeo(event: any, params: string): void{
    if(params === 'reg'){
      this.transportsSelect,this.lignesOfSelectedRegion,this.lignesSelect,this.stationsToShow,this.lignesToShow = [];
      this.selectedTransport = '';
      event.find((element: SelectData) => element.selected === true) != null ? this.selectedRegion = event.find((element: SelectData) => element.selected === true)?.name : this.selectedRegion = '';
      
      if(this.selectedRegion.length > 0){
        this.databaseService.getTransportsOfRegion(this.selectedRegion).subscribe((transportsOfRegion: string[]) => {
          let getRegionsLignes: Subject<boolean> = new Subject<boolean>();
          let counter: number = 0;
          getRegionsLignes.subscribe(() => {
            this.initData();
          });
          transportsOfRegion.forEach((transport: string) => {
            this.transportsSelect.push({
              id: transport,
              name: transport,
              selected: false
            });
            this.databaseService.getLignesOfRegionByTransport(this.selectedRegion,transport).subscribe((lignesOfTransport: Ligne[]) => {
              lignesOfTransport.forEach((ligne: Ligne) => {
                delete ligne.picture;
                delete ligne.reg;
                delete ligne.transport;
                ligne.buttonInfos = {
                  color: ligne.color,
                  colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
                  borderColor: ligne.color,
                  borderColorActive: ligne.color,
                  backgroundColor: 'transparent',
                  backgroundColorActive: ligne.color,
                  fontSize: "11px",
                  heightIcon: "20px",
                  radius: "50%"
                }   
                this.lignesOfSelectedRegion.push(ligne);
              });
              counter++;
              if(counter === transportsOfRegion.length)  getRegionsLignes.next(true);
            });
          });
          this.transportsSelect = this.transportsSelect.slice();
        });
      }
      
    } else if(params === 'trans'){
      this.stationsToShow,this.lignesSelect = [];
      event.find((element: SelectData) => element.selected === true) != null ? this.selectedTransport = event.find((element: SelectData) => element.selected === true)?.name : this.selectedTransport = '';
      this.initData();
      if(this.selectedTransport.length > 0){
        this.databaseService.getLignesOfRegionByTransport(this.selectedRegion,this.selectedTransport).subscribe((lignesOfRegion: Ligne[]) => {
          this.lignesToShow = this.placesService.getCopyOfElement(lignesOfRegion);
          lignesOfRegion.forEach((ligne: Ligne) => {
            this.lignesSelect.push({
              id: ligne.id,
              name: ligne.name,
              selected: false
            });
          });
          this.lignesSelect = this.lignesSelect.slice();
          this.lignesToShow = this.lignesToShow.slice();
        });
      }
      
    }  else if(params === 'lig'){
      event.find((element: SelectData) => element.selected === true) != null ? this.selectedLigne = event.find((element: SelectData) => element.selected === true)?.id : this.selectedLigne = "";
      this.getStations(this.selectedLigne);
    }
    
  }
  protected setAction(event: any, table: string): void{
    const action: string = event.find((element: SelectData) => element.selected === true)?.name;
    this[table] = action;
  }
  protected getStations(id: string): void{
    this.databaseService.getStationsOfLigne(id).subscribe((stationsOfLigne: Station[]) => {
      this.stationsToShow = this.placesService.getCopyOfElement(stationsOfLigne);
      this.stationsToShow.forEach((station: Station) => {
        station.lignes = [];
        this.databaseService.getLignesOfStation(station.id).subscribe((lignesOfStation: Ligne[]) => {
          const lignesOfSelectedRegion: Ligne[] = this.placesService.getCopyOfElement(this.lignesOfSelectedRegion);
          lignesOfSelectedRegion.forEach((regLigne: Ligne) => {
            delete regLigne.picture;
            delete regLigne.reg;
            delete regLigne.transport;
            let toPush:Ligne = regLigne;
            let find: Ligne = lignesOfStation.find((l: Ligne) => l.id === toPush.id);
            toPush.buttonInfos = {
              color: toPush.color,
              colorActive: this.placesService.isColorLight(toPush.color) ? 'var(--black)' : 'white',
              borderColor: toPush.color,
              borderColorActive: toPush.color,
              backgroundColor: 'transparent',
              backgroundColorActive: toPush.color,
              fontSize: "11px",
              heightIcon: "20px",
              radius: "50%"
            }   
            if(find == null)  lignesOfStation.push(toPush);
            else{
              toPush.buttonInfos.color = this.placesService.isColorLight(toPush.color) ? 'var(--black)' : 'white';
              toPush.buttonInfos.backgroundColor = toPush.color;
            }
            station.lignes.push(toPush)
          });           
        });
      })
    });
  }
  protected add(params: string): void{
    switch(params){
      case 'Lignes':
        this.lignesToAdd.push({
          id: this.placesService.setId(),
          name: "",
          picture: "",
          reg: this.selectedRegion,
          transport: this.selectedTransport,
        });
      break;
      case 'Stations':
        this.stationsToAdd.push({
          id: this.placesService.setId(),
          name: "",
          lat: 0,
          lng: 0,
          reg: this.selectedRegion,
          lignes: JSON.parse(JSON.stringify(this.lignesOfSelectedRegion.slice()))
        });
      break;
      case 'Types':
        this.typesToAdd.push({
          id: this.placesService.setId(),
          name: "",
          picture: "",
          color: "",
          icon: "",
          category: this.category
        });
      break;
      case 'Users':
        this.usersToAdd.push({
          id: this.placesService.setId(),
          login: "",
          password: "",
          role: "",
          img: "",
        });
      break;
    }
  }
  protected remove(params: string): void{
    switch(params){
      case 'Lignes':
        if(this.lignesToAdd.length > 1) this.lignesToAdd.splice(this.lignesToAdd.length-1,1);
      break;
      case 'Stations':
        if(this.stationsToAdd.length > 1) this.stationsToAdd.splice(this.stationsToAdd.length-1,1);
      break;
      case 'Types':
        if(this.typesToAdd.length > 1) this.typesToAdd.splice(this.typesToAdd.length-1,1);
      break;
      case 'Users':
        if(this.usersToAdd.length > 1) this.usersToAdd.splice(this.usersToAdd.length-1,1);
      break;
    }
  }
  protected delete(params: string, id: string): void{
    switch(params){
      case 'Lignes':
        if(this.lignesToDelete.find((ligne: Ligne) => ligne.id === id) == null) this.lignesToDelete.push(this.lignesToShow.find((ligne: Ligne) => ligne.id === id));
      break;
      case 'Stations':
        if(this.stationsToDelete.find((station: Station) => station.id === id) == null) this.stationsToDelete.push(this.stationsToShow.find((station: Station) => station.id === id));
      break;
      case 'Types':
        if(this.deleteTypes.find((type: Type) => type.id === id) == null) this.deleteTypes.push(this.typesToShow.find((type: Type) => type.id === id));
      break;
      case 'Users':
        if(this.deleteUsers.find((user: User) => user.id === id) == null) this.deleteUsers.push(this.usersToShow.find((user: User) => user.id === id));
      break;
    }
  }
  protected cancelDelete(params: string, id: string): void{
    switch(params){
      case 'Lignes':
        this.lignesToDelete = this.lignesToDelete.filter((ligne: Ligne) => ligne.id !== id);
      break;
      case 'Stations':
        this.stationsToDelete = this.stationsToDelete.filter((station: Station) => station.id !== id);
      break;
      case 'Types':
        this.deleteTypes = this.deleteTypes.filter((type: Type) => type.id !== id);
      break;
      case 'Users':
        this.deleteUsers = this.deleteUsers.filter((user: User) => user.id !== id);
      break;
    }
  }
  protected addLigne(indexStation: number, indexLigne: number): void{
    const ligne: Ligne = this.stationsToAdd[indexStation].lignes[indexLigne];
    const color: string = ligne.buttonInfos.backgroundColor !== 'transparent' ? ligne.color : this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white';
    const backgroundColor: string = ligne.buttonInfos.backgroundColor !== 'transparent' ? "transparent" : ligne.color;
    this.stationsToAdd[indexStation].lignes[indexLigne].buttonInfos = {
      color: color,
      colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
      borderColor: ligne.color,
      borderColorActive: ligne.color,
      backgroundColor: backgroundColor,
      backgroundColorActive: ligne.color,
      fontSize: "11px",
      heightIcon: "20px",
      radius: "50%"
    } 
  }
  protected setPreferenceCategory(event: any): void{
    event.find((element: SelectData) => element.selected === true) != null ? this.category = event.find((element: SelectData) => element.selected === true)?.name : this.category = '';
    this.initData();
    this.databaseService.getTypeByCategory(this.category).subscribe((types: Type[]) => {
      this.typesToShow = types;
    });
  }
  protected setValue(params: string, table: string, id: string, event: any): void{
    let find: any = this[table].find((ligne: any) => ligne.id === id);
    params === 'lat' || params === 'lng' ? find[params] = Number(event.target.value) : find[params] = event.target.value;
  }  
  protected setNewRegion(event: any): void{
    this.newRegion = event.target.value;
  }
  protected getJson(event: any,table: string): void{
    const file = event;
    const fileParams: string[] = Object.keys(file[0]);
    const tableParams: string[] = Object.keys(this[table][0]);
    let missingParams: string[] = [];
    tableParams.forEach((key: string) => {
      if(fileParams.find((param: string) => param === key) == null)  missingParams.push(key);
    });
    if(missingParams.length === 0){
      switch(table){
        case 'lignesToAdd':
          this[table] = file;
          let findLigne: SelectData = this.actionSelectLignes.find((element: SelectData) => element.id === "add");
          findLigne.selected = true;
          this.actionLignes = "Ajouter";
        break;
        case 'stationsToAdd': 
          let lignesOfSelectedRegion: Ligne[] = [];
          const reg: string = file[0].reg;
          this.databaseService.getLignesOfRegion(reg).subscribe((lignesOfRegion: Ligne[]) => {
            lignesOfRegion.forEach((ligne: Ligne) => {
              delete ligne.picture;
              delete ligne.reg;
              delete ligne.transport;
              ligne.buttonInfos = {
                color: ligne.color,
                colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
                borderColor: ligne.color,
                borderColorActive: ligne.color,
                backgroundColor: 'transparent',
                backgroundColorActive: ligne.color,
                fontSize: "11px",
                heightIcon: "20px",
                radius: "50%"
              }   
              lignesOfSelectedRegion.push(ligne);
            });
            file.forEach((station: any) => {
              lignesOfSelectedRegion.forEach((ligne: Ligne) => {
                delete ligne.picture;
                delete ligne.reg;
                delete ligne.transport;
                let find: Ligne = station.lignes.find((l: string) => l === ligne.id);
                const color: string = find == null ? ligne.color : this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white';
                const backgroundColor: string = find == null ? "transparent" : ligne.color;
                ligne.buttonInfos = {
                  color: color,
                  colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
                  borderColor: ligne.color,
                  borderColorActive: ligne.color,
                  backgroundColor: backgroundColor,
                  backgroundColorActive: ligne.color,
                  fontSize: "11px",
                  heightIcon: "20px",
                  radius: "50%"
                }   
                lignesOfRegion.push(ligne)
              });
              station.lignes = this.placesService.getCopyOfElement(lignesOfSelectedRegion);
            });
            this.stationsToAdd = file;
            this.regionsSelect.find((element: SelectData) => element.name === reg).selected = true;
            this.selectedRegion = reg;
            this.actionSelectStations.find((element: SelectData) => element.id === "add").selected = true;
            this.actionStations = "Ajouter";
          });
        break;
        case 'typesToAdd':
          this[table] = file;
          let findType: SelectData = this.actionSelectTypes.find((element: SelectData) => element.id === "add");
          findType.selected = true;
          this.actionTypes = "Ajouter";
        break;
        case 'usersToAdd':
          let findUser: SelectData = this.actionSelectUsers.find((element: SelectData) => element.id === "add");
          findUser.selected = true;
          this.actionUsers = "Ajouter";
        break;
      }
    }
    else{
      this.error = true;
      this.errorMessage = "Il manque les attributs ";
      missingParams.forEach((param: string,index: number) => {
        if(index !== 0 && index !== missingParams.length - 1)  this.errorMessage += ",";
        if(index === missingParams.length - 1 && missingParams.length > 1)  this.errorMessage += " et";
        this.errorMessage += " " + param;
      });
      setTimeout(() => {
        this.errorMessage = "";
      },5000);
    }
  }
  protected getPlaces(event: any): void{
    const file = event;
    const fileParams: string[] = Object.keys(file[0]);
    const placeParams: string[] = [
      "id",
      "name",
      "category",
      "address",
      "lat",
      "lng",
      "website",
      "visible",
      "id_creator",
      "id_city",
      "creation",
      "promotion",
      "postal",
    ];
    let missingParams: string[] = [];
    placeParams.forEach((key: string) => {
      if(fileParams.find((param: string) => param === key) == null)  missingParams.push(key);
    });
    if(missingParams.length > 0)  console.log(this.error)
    else{
      file.forEach((infos: any) => {
        let type: string[] = this.placesService.getCopyOfElement(infos.type);
        let comment: Comment = this.placesService.getCopyOfElement(infos.comment);
        delete infos.type;
        delete infos.comment;
        let place: Place = this.placesService.getCopyOfElement(infos);
        place.id = this.placesService.setId();
        place.id_creator = localStorage.getItem("id");
        place.creation = this.placesService.convertDateToString(new Date());
        comment.id_place = place.id;
        comment.id_user = localStorage.getItem("id");
        let horaires: Horaires[] = [{
          day: "Lundi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Mardi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Mercredi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Jeudi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Vendredi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Samedi",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        },
        {
          day: "Dimanche",
          ouverture: "",
          fermeture_midi: "",
          ouverture_soir: "",
          fermeture: "",
          id_place: place.id,
          id_user: localStorage.getItem("id")
        }];
        horaires.forEach((hor: Horaires) => {
          this.databaseService.addHoraires(hor).subscribe((res: Message) => {
            console.log(res);
          });
        });
        type.forEach(element => {
          this.databaseService.getTypeIdByCategoryAndName(place.category,element).subscribe((ids: string[]) => {
            ids.forEach((id: string) => {
              this.databaseService.addTypeOfPlace({id_place: place.id, id_type: id}).subscribe((res: Message) => {
                console.log(res);
              });
            });
          });
        });
        this.databaseService.addComment(comment, place.category).subscribe((message: Message) => {
          console.log(message);
        });
        let geocoder = new google.maps.Geocoder();
        const fullAddress: string = place.name + ", " + place.address;
        geocoder.geocode({
          'address': fullAddress
        }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let city: City = {
                name: "",
                id: "",
                reg: "",
                land: "",
                department: ""
              };
              let stations: Station[] = [];
              results[0].address_components.forEach((element: google.maps.GeocoderAddressComponent) => {
                if(element.types[0] === 'locality') city.name = element.long_name;
                else if(element.types[0] === 'administrative_area_level_2') city.department = element.long_name;
                else if(element.types[0] === 'administrative_area_level_1') city.reg = element.long_name;
                else if(element.types[0] === 'country') city.land = element.long_name;
                else if(element.types[0] === 'postal_code') place.postal = element.long_name;
              });
              this.databaseService.getCityIdByProperties(city).subscribe((res: City) => {
                if(res.id != null) city.id = res.id;
                else{
                  city.id = this.placesService.setId();
                  this.databaseService.addCity(city).subscribe((message: Message) => {
                    console.log(message);
                  });
                }
                place.id_city = city.id;
                this.databaseService.getStationOfPlaceByCoords({
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                }).subscribe((stationsOfPlace: Station[]) => {
                  stations = this.placesService.getCopyOfElement(stationsOfPlace);
                  stations.forEach((station: Station) => {
                    this.databaseService.addStationOfPlace(place.id,station.id).subscribe((message: Message) => {
                      console.log(message);
                    });
                  });
                });
                place.lat = results[0].geometry.location.lat();
                place.lng = results[0].geometry.location.lng();
                place.address = results[0].formatted_address;

                this.databaseService.verifyExistingPlace(place).subscribe((isValid: boolean) => {
                  if(isValid){
                    console.log("Ce " + place.category + "  existe déjà");
                  } else{
                    this.databaseService.addPlaceOfUser({idPlace: place.id, idUser: localStorage.getItem("id")}).subscribe((message: Message) => {
                      console.log(message);
                    });
                    this.databaseService.addPlaceByCategory(place).subscribe((message: Message) => {
                      console.log(message);
                    });
                  }
                });
              });
            } else {
              console.log("Cette addresse n'existe pas");
            }
        });
      });
    }
  }
  protected getFile(event: string,id: string,table: string): void{
    if(event.length != null){
      let find: any = null;
      find = this[table].find((ligne: Ligne) => ligne.id === id);
      table !== "users" && table !== 'usersToAdd' ? find.picture = event : find.img = event;
      this[table] = this[table].slice();
    }
  }
  protected navigate(divName: string): void{
    if(this.divToShow !== divName){
      let newBackgroundColor: string = "";
      let newNavigateBackground: string = "";
      let newNavigateColor: string = "";
      if(this.divToShow !== 'lignes' && divName === 'lignes'){
        this.stationsToShow = [];
        this.transportsSelect = [];
        this.lignesSelect = [];
        this.initData();
        this.selectedLigne = "";
        this.lignesToShow = [];
        this.selectedRegion = "";
        this.selectedTransport = "";
        this.animationChange = "lignes";
        newBackgroundColor = 'var(--mainColor)';
        newNavigateBackground = 'var(--black)';
        newNavigateColor = 'var(--mainColor)';
      }
      if(this.divToShow !== 'stations' && divName === 'stations'){
        this.stationsToShow = [];
        this.transportsSelect = [];
        this.lignesSelect = [];
        this.initData();
        this.selectedLigne = "";
        this.lignesToShow = [];
        this.selectedRegion = "";
        this.selectedTransport = "";
        this.animationChange = "stations";
        newBackgroundColor = 'var(--mainColor)';
        newNavigateBackground = 'var(--black)';
        newNavigateColor = 'var(--mainColor)';
      }
      if(this.divToShow !== 'types' && divName === 'types'){
        this.animationChange = "types";
        newBackgroundColor = 'var(--white)';
        newNavigateBackground = 'var(--secondColor)';
        newNavigateColor = 'var(--white)';
      }
      if(this.divToShow !== 'users' && divName === 'users'){
        this.animationChange = "users";
        newBackgroundColor = 'var(--white)';
        newNavigateBackground = 'var(--secondColor)';
        newNavigateColor = 'var(--white)';
      }
      if(this.divToShow !== 'database' && divName === 'database'){
        this.animationChange = "database";
        newBackgroundColor = 'var(--white)';
        newNavigateBackground = 'var(--thirdColor)';
        newNavigateColor = 'var(--white)';
      }
      setTimeout(() => {
        this.divToShow = divName;
        this.backgroundColor = newBackgroundColor;
        this.navigateBackground = newNavigateBackground;
        this.navigateColor = newNavigateColor;
        this.animationChange = '';
      }, 400);
    }
    
  }
  protected setStationsNearPlace(): void{
    this.databaseService.setStationsNearPlace();
  }
  protected cleanTypeOfPlace(): void{
    this.databaseService.cleanTypeOfPlace();
  }
  protected save(params: string, action: string): void{
    let changeBDD: Subject<Message> = new Subject<Message>();
    changeBDD.subscribe((res:Message) => {
      this.error = res.error;
      this.errorMessage = res.message;
      if(this.category !== ''){
        this.initData();
        this.databaseService.getTypeByCategory(this.category).subscribe((types: Type[]) => {
          this.typesToShow = types;
        });
      }
      if(this.selectedRegion !== ''){
        if(this.selectedTransport !== ''){
          this.stationsToShow = [];
          this.initData();
          this.databaseService.getLignesOfRegionByTransport(this.selectedRegion,this.selectedTransport).subscribe((res: Ligne[]) => {
            this.lignesToShow = res;
            this.lignesToShow = this.lignesToShow.slice();
          });
        } else{
          this.transportsSelect = [];
          this.lignesOfSelectedRegion = [];
          this.selectedTransport = '';
          this.stationsToShow = [];
          this.lignesToShow = [];
          this.databaseService.getTransportsOfRegion(this.selectedRegion).subscribe((res: string[]) => {
            let getRegionsLignes: Subject<boolean> = new Subject<boolean>();
            let counter: number = 0;
            getRegionsLignes.subscribe(() => {
              this.initData();
            });
            res.forEach((transport: string) => {
              this.transportsSelect.push({
                id: transport,
                name: transport,
                selected: false
              });
              this.databaseService.getLignesOfRegionByTransport(this.selectedRegion,transport).subscribe((lignes: Ligne[]) => {
                lignes.forEach((ligne: Ligne) => {
                  delete ligne.picture;
                  delete ligne.reg;
                  delete ligne.transport;
                  ligne.buttonInfos = {
                    color: ligne.color,
                    colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
                    borderColor: ligne.color,
                    borderColorActive: ligne.color,
                    backgroundColor: 'transparent',
                    backgroundColorActive: ligne.color,
                    fontSize: "11px",
                    heightIcon: "20px",
                    radius: "50%"
                  }   
                  this.lignesOfSelectedRegion.push(ligne);
                });
                counter++;
                if(counter === res.length)  getRegionsLignes.next(true);
              });
            });
            this.transportsSelect = this.transportsSelect.slice();
          });
        }
        
      }
      this.ngOnInit();
      setTimeout(() => {
        this.errorMessage = "";
      },3000);
    });
    if(params === "Lignes"){
      if(action === "Add"){
        if(!this.checkLigne(this.lignesToAdd)){
          this.databaseService.addLignes(this.lignesToAdd).subscribe((res) => {
            changeBDD.next(res);
          });
        }
      }
      if(action === "Update"){
        if(!this.checkLigne(this.lignesToShow)){
          this.databaseService.updateLignes(this.lignesToShow).subscribe((res) => {
            changeBDD.next(res);
          });
        } 
      }
      if(action === "Delete"){
        let ids: string[] = [];
        this.lignesToDelete.forEach((ligne: Ligne) => {
          ids.push(ligne.id)
        });
        this.databaseService.deleteLignes(ids).subscribe((res) => {
          changeBDD.next(res);
        });
      }
    }
    if(params === "Stations"){
      if(action === "Add"){
        this.checkStation(this.stationsToAdd).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.addStations(this.stationsToAdd).subscribe((res) => {
            changeBDD.next(res);
          });
        })
      }
      if(action === "Update"){
        this.checkStation(this.stationsToShow).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.updateStations(this.stationsToShow).subscribe((res) => {
            changeBDD.next(res);
          });
        }); 
      }
      if(action === "Delete"){
        let ids: string[] = [];
        this.stationsToDelete.forEach((station: Station) => {
          ids.push(station.id)
        });
        this.databaseService.deleteStations(ids).subscribe((res) => {
          changeBDD.next(res);
        });
      }
    }
    if(params === "Types"){
      if(action === "Add"){
        this.checkType(this.typesToAdd).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.addTypes(this.typesToAdd).subscribe((res) => {
            changeBDD.next(res);
          });
        });
      }
      if(action === "Update"){
        this.checkType(this.typesToShow).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.updateTypes(this.typesToShow).subscribe((res) => {
            changeBDD.next(res);
          });
        }); 
      }
      if(action === "Delete"){
        let ids: string[] = [];
        this.deleteTypes.forEach((type: Type) => {
          ids.push(type.id)
        });
        this.databaseService.deleteTypes(ids).subscribe((res) => {
          changeBDD.next(res);
        });
      }
    }
    if(params === "Users"){
      if(action === "Add"){
        this.checkUser(this.usersToAdd).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.addUsers(this.usersToAdd).subscribe((res) => {
            changeBDD.next(res);
          });
          else{
            changeBDD.next({
              error: true,
              message: "Les utilisateurs n'ont pas pu être ajoutés."
            })
          }
        });
      }
      if(action === "Update"){
        this.checkUser(this.usersToShow).subscribe((isValid: boolean) => {
          if(isValid) this.databaseService.updateUsers(this.usersToShow).subscribe((res) => {
            changeBDD.next(res);
          });
          else{
            changeBDD.next({
              error: true,
              message: "Les utilisateurs n'ont pas pu être modifiés."
            })
          }
        });
      }
      if(action === "Delete"){
        let ids: string[] = [];
        this.deleteUsers.forEach((user: User) => {
          ids.push(user.id)
        });
        this.databaseService.deleteUsers(ids).subscribe((res) => {
          changeBDD.next(res);
        });
      }
    }
  }
  private checkLigne(table: Ligne[]): boolean{
    let toReturn: boolean = true;
    table.forEach((ligne: Ligne) => {
      if(ligne.name.length === 0){
        this.error = true;
        this.errorMessage = "La ligne doit avoir un nom.";
        toReturn = false;
      }
      else if(!this.colorIsValid(ligne.color)){
        this.error = true;
        this.errorMessage = "La couleur de la ligne " + ligne.name + " est invalide.";
        toReturn = false;
      }
      else if(!this.nameLigneIsValid(ligne.name)){
        this.error = true;
        this.errorMessage = "Le nom"+ligne.name+" est déjà pris";
        toReturn = false;
      } 
    });
    return toReturn;
  }
  private checkStation(table: Station[]): Subject<boolean>{
    let toReturn: Subject<boolean> = new Subject();
    let counter: number = 0;
    table.forEach((station: Station) => {
      if(!this.error){
        if(station.name.length === 0){
          this.error = true;
          this.errorMessage = "La station doit avoir un nom";
          toReturn.next(false);
        }
        else if(isNaN(Number(station.lat))){
          this.error = true;
          this.errorMessage = "La latitude de la station " + station.name + " doit être un nombre";
          toReturn.next(false);
        }
        else if(isNaN(Number(station.lng))){
          this.error = true;
          this.errorMessage = "La longitude de la station " + station.name + " doit être un nombre";
          toReturn.next(false);
        }
        else if(station.lignes.filter((ligne: Ligne) => ligne.buttonInfos.backgroundColor !== 'transparent').length === 0){
          this.error = true;
          this.errorMessage = "La station " + station.name + " doit avoir au moins une ligne";
          toReturn.next(false);
        }
        if(!this.error){
          const lignes: Ligne[] = station.lignes.filter((ligne: Ligne) => ligne.buttonInfos.backgroundColor !== 'transparent');
          this.nameStationIsValid(station.name,lignes).subscribe((isValid) => {
            if(!isValid){
              this.error = true;
              this.errorMessage = "Le nom"+station.name+" est déjà pris sur cette ligne";
              toReturn.next(false);
            } else{
              counter++;
              if(counter === table.length)  toReturn.next(true);
            }
            setTimeout(() => {
              this.errorMessage = "";
            }, 3000);
          });
        } else{
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
        }
      }
      station.lat = Number(station.lat);
      station.lng = Number(station.lng);
    });
    return toReturn;
  }
  private checkType(table: Type[]): Subject<boolean>{
    let toReturn: Subject<boolean> = new Subject();
    let counter: number = 0;
    table.forEach((type: Type) => {
      if(!this.error){
        if(type.name.length === 0){
          this.error = true;
          this.errorMessage = "Le type doit avoir un nom";
          toReturn.next(false);
        }
        else if(!this.iconIsValid(type.icon)){
          this.error = true;
          this.errorMessage = "L'icône de " + type.name + " n'est pas valide";
          toReturn.next(false);
        }
        else if(!this.colorIsValid(type.color)){
          this.error = true;
          this.errorMessage = "La couleur du type " + type.name + " n'est pas valide";
          toReturn.next(false);
        }
        else if(!this.categoryIsValid(type.category)){
          this.error = true;
          this.errorMessage = "La catégorie de " + type.name + " n'est pas valide";
          toReturn.next(false);
        }
        if(!this.error){
          this.nameTypeIsValid(type.name,type.category).subscribe((isValid) => {
            if(!isValid){
              this.error = true;
              this.errorMessage = "Le nom"+ type.name+" est déjà pris sur cette catégorie";
              toReturn.next(false);
            }
            else{
              counter++;
              if(counter === table.length)  toReturn.next(true);
            }
            setTimeout(() => {
              this.errorMessage = "";
            }, 3000);
          });
        } else{
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
        }
      }
    });
    return toReturn;
  }
  private checkUser(table: User[]): Subject<boolean>{
    let toReturn: Subject<boolean> = new Subject();
    let counter: number = 0;
    table.forEach((user: User) => {
      if(!this.error){
        if(user.login.length === 0){
          this.error = true;
          this.errorMessage = "L'utilisateur doit avoir un login";
          toReturn.next(false);
        }
        else if(user.password.length < 4){
          this.error = true;
          this.errorMessage = "Le mot de passe de " + user.login + " n'est pas valide";
          toReturn.next(false);
        }
        else if(!this.roleIsValid(user.role)){
          this.error = true;
          this.errorMessage = "Le rôle de l'utilisateur " + user.login + " n'est pas valide";
          toReturn.next(false);
        }
        if(!this.error){
          this.loginUserIsValid(user.login).subscribe((isValid) => {
            if(!isValid){
              this.error = true;
              this.errorMessage = "Ce nom d'utilisateur est déjà pris";
              toReturn.next(false);
            }
            else{
              counter++;
              if(counter === table.length)  toReturn.next(true);
            }
            setTimeout(() => {
              this.errorMessage = "";
            }, 3000);
          });
        } else{
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
        }
      }
    });
    return toReturn;
  }
  private loginUserIsValid(name: string): Subject<boolean>{
    let toReturn: boolean = false;
    let getData: Subject<boolean> = new Subject<boolean>();
    this.databaseService.getValidName(name).subscribe((boolean: boolean) => {
      toReturn = boolean;
      getData.next(toReturn);
    });
    return getData;
  }
  private nameTypeIsValid(name: string,category: string): Subject<boolean>{
    let toReturn: boolean = false;
    let getData: Subject<boolean> = new Subject<boolean>();
    this.databaseService.getTypeByCategory(category).subscribe((types: Type[]) => {
      types.find((type: Type) => type.name === name) != null ? toReturn = false : toReturn = true;
      getData.next(toReturn);
    });
    return getData;
  }
  private nameStationIsValid(name: string, lignes: Ligne[]): Subject<boolean>{
    let toReturn: boolean = false;
    let getData: Subject<boolean> = new Subject<boolean>();
    let counter: number = 0;
    lignes.forEach((ligne: Ligne) => {
      this.databaseService.getStationsOfLigne(ligne.id).subscribe((station: Station[]) => {
        counter++;
        station.find((station: Station) => station.name === name) != null ? toReturn = false : toReturn = true;
        if(counter === lignes.length) getData.next(toReturn);
      });
    });
    return getData;
  }
  private nameLigneIsValid(name: string): boolean{
    let toReturn: boolean = false;
    if(this.lignesOfSelectedRegion.find((ligne: Ligne) => ligne.name === name) == null) toReturn = true;
    return toReturn;
  }
  private categoryIsValid(category: string): boolean{
    if(this.categoriesSelect.find((element: SelectData) => element.name === category) == null) return false;
    return true;
  }
  private roleIsValid(role: string): boolean{
    if(role !== "User") return false;
    return true;
  }
  private iconIsValid(icon: string): boolean{
    if(this.placesService.getIconFromName(icon) == null)  return false;
    return true;
  }
  private colorIsValid(color: string): boolean{
    console.log(color,/^#[0-9A-F]{6}$/i.test(color))
    return  /^#[0-9A-F]{6}$/i.test(color);
  }
}
