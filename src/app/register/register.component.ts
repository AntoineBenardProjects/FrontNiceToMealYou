import { Component } from '@angular/core';
import { User } from '../shared/model/table/user';
import { DatabaseService } from '../services/database.service';
import { ButtonInfos, InputInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Ligne, Station } from '../shared/model/table/transports';
import { Type } from '../shared/model/table/type';
import { Subject } from 'rxjs';
import { StationCardParams, TypeCardParams } from '../shared/model/params/cardParams';
import { IconDefinition, faUser, faXmark, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { buttonColorGeneralRegisterComponent, buttonColorRegionRegisterComponent, buttonColorRegisterComponent, buttonColorTypeRegisterComponent, crossButtonRegisterComponent, uploadButtonInfosRegisterComponent, uploadButtonRegisterComponent } from '../shared/model/design/buttonsDesign';
import { invalidInputRegisterComponent, validInputRegisterComponent } from '../shared/model/design/inputsDesign';
import { selectInfosRegionRegisterComponent, selectInfosTypeRegisterComponent } from '../shared/model/design/selectsDesign';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('general', [
      state('show', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(-100vw)'
      })),
      state('half', style({
        transform: 'translateX(-200vw)'
      })),
      transition('* => half', [
        animate('400ms ease-out')
      ]),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('region', [
      state('show', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(100vw)'
      })),
      state('half', style({
        transform: 'translateX(-100vw)'
      })),
      transition('* => half', [
        animate('400ms ease-out')
      ]),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('type', [
      state('show', style({
        transform: 'translateX(0)'
      })),
      state('half', style({
        transform: 'translateX(100vw)'
      })),
      state('hidden', style({
        transform: 'translateX(200vw)'
      })),
      transition('* => half', [
        animate('400ms ease-out')
      ]),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('titleGeneral', [
      state('show', style({
        height: '60px'
      })),
      state('hidden', style({
        height: 0
      })),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('titleRegion', [
      state('show', style({
        height: '60px'
      })),
      state('hidden', style({
        height: 0
      })),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('titleType', [
      state('show', style({
        height: '60px'
      })),
      state('hidden', style({
        height: 0
      })),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('error', [
      state('show', style({
        height: 'calc(2vh + 20px)'
      })),
      state('hidden', style({
        height: '0'
      })),
      transition('* => hidden', [
        animate('400ms ease-out')
      ]),
      transition('* => show', [
        animate('400ms ease-out')
      ])
    ]),
  ]
})
export class RegisterComponent {
  constructor(private dataService: DatabaseService, private router: Router) { }

  //////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected buttonColor: ButtonInfos = buttonColorRegisterComponent;
  protected buttonColorGeneral: ButtonInfos = buttonColorGeneralRegisterComponent;
  protected buttonColorRegion: ButtonInfos = buttonColorRegionRegisterComponent;
  protected buttonColorType: ButtonInfos = buttonColorTypeRegisterComponent;
  protected uploadButtonInfos: ButtonInfos = uploadButtonInfosRegisterComponent;
  protected validInput: InputInfos = validInputRegisterComponent;
  protected invalidInput: InputInfos = invalidInputRegisterComponent;
  protected uploadButton: ButtonInfos = uploadButtonRegisterComponent;
  protected crossButton: ButtonInfos = crossButtonRegisterComponent;
  protected selectInfosRegion: SelectInfos = selectInfosRegionRegisterComponent;
  protected selectInfosType: SelectInfos = selectInfosTypeRegisterComponent;
/*  Icon  */
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected photoIcon: IconDefinition = faCameraRetro;
/*  Select  */
  protected regionSelect: SelectData[] = [];
  protected transportSelect: SelectData[] = [];
  protected ligneSelect: SelectData[] = [];
  protected stationSelect: SelectData[] = [];
  protected stations: SelectData[] = [];
  protected categorySelect: SelectData[] = [
    {id: "res", name: "Restaurant",selected: false},
    {id: "bar", name: "Bar",selected: false},
    {id: "loi", name: "Loisir",selected: false},
    {id: "mag", name: "Magasin",selected: false},
    {id: "ser", name: "Service",selected: false},
    {id: "aut", name: "Autre",selected: false}
  ];
  protected typeSelect: SelectData[] = [];
  protected types: SelectData[] = [];
/*  Algo  */
  protected nextStepButtonMessage: string = "Vos stations";
  protected generalAnimation: string = "show";
  protected regionAnimation: string = "hidden";
  protected typeAnimation: string = "hidden";
  protected titleGeneralAnimation: string = "show";
  protected titleRegionAnimation: string = "hidden";
  protected titleTypeAnimation: string = "hidden";
  protected stationsCardInfos: StationCardParams[] = [];
  protected typesCardInfos: TypeCardParams[] = [];
  protected region: string = "";
  protected userInfos: User = {
    id: "",
    login: "",
    password: "",
    role: "User",
    img: ""
  };
  protected validName: boolean = false;
  protected validPassword: boolean = false;
  protected message: string = "";
  protected showMessage: string="hidden";
  protected valid: boolean = false;
  protected firstClickPrevious: boolean = false;
  protected dblClickPrevious: boolean = false;
  protected firstClickNext: boolean = false;
  protected dblClickNext: boolean = false;

  private ngOnInit(): void{
    this.dataService.getAllRegion().subscribe((regions: string[]) => {
      regions.forEach((element: string) => {
        this.regionSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
      this.regionSelect = this.regionSelect.slice();
    });
  }
  protected setValue(event: any, params: string): void{
    this.userInfos[params.toLocaleLowerCase()] = event.target.value;
    if(params === 'Login'){
      this.userInfos.login.length <= 2 ? this.validName = false : this.dataService.getValidName(this.userInfos.login).subscribe((res: boolean) => {
        this.validName = res;
      });
    }
    else if(params === 'Password'){
      event.target.value.length > 3 ? this.validPassword = true : this.validPassword = false;
    }
  }
  protected setPreferenceGeo(event: any, params: string): void{
    if(params === 'reg'){
      this.transportSelect = [];
      this.ligneSelect = [];
      this.stationSelect = [];
      this.region = event.find((element: SelectData) => element.selected === true)?.name;
      this.dataService.getTransportsOfRegion(this.region).subscribe((res: string[]) => {
        res.forEach((transport: string) => {
          this.transportSelect.push({
            id: transport,
            name: transport,
            selected: false
          });
        });
        this.transportSelect = this.transportSelect.slice();
      });
    } else if(params === 'trans'){
      this.ligneSelect = [];
      this.stationSelect = [];
      let transport = event.find((element: SelectData) => element.selected === true)?.name;
      this.dataService.getLignesOfRegionByTransport(this.region,transport).subscribe((res: Ligne[]) => {
        res.forEach((ligne: Ligne) => {
          this.ligneSelect.push({
            id: ligne.id,
            name: ligne.name,
            selected: false
          });
        });
        this.ligneSelect = this.ligneSelect.slice();
      });
    } else if(params === 'lig'){
      this.stationSelect = [];
      const ligne = event.find((element: SelectData) => element.selected === true)?.id;
      this.dataService.getStationsOfLigne(ligne).subscribe((res: Station[]) => {
        res.forEach((station: Station) => {
          const find: SelectData = this.stations.find((element: SelectData) => station.id === element.id);
          let selected: boolean = false;
          if(find != null)  selected = true;
          this.stationSelect.push({
            id: station.id,
            name: station.name,
            selected: selected
          });
        });
        this.stationSelect = this.stationSelect.slice();
      });
    } else if(params === 'stat'){
      let filter = event.filter((station: SelectData) =>{
        const find = this.stations.find((check: SelectData) => check.id === station.id);
        if(find != null)  return false;
        else if(station.selected) return true;
        return false;
      });
      if(filter.length > 0) {
        this.dataService.getLignesOfStation(filter[0].id).subscribe((lignes: Ligne[]) => {
          filter.originalData = lignes;
        });
        this.stations.push(filter[0]);
        this.stationsCardInfos.push({
          station: {
            id: filter[0].id,
            name: filter[0].name
          },
          width: 20,
          height: 450,
        });
        this.stations = this.stations.slice();
      }
      else{
        filter = event.filter((station: SelectData) => {
          const find = this.stations.find((check: SelectData) => check.id === station.id);
          if(find != null && !station.selected)  return true;
          return false;
        });
        const idToSuppress = filter[0].id;
        this.stations = this.stations.filter((station: SelectData) => {
          if(station.id === idToSuppress) return false;
          return true;
        }).slice();
        this.stationsCardInfos = this.stationsCardInfos.filter((params: StationCardParams) => {
          if(params.station.id === idToSuppress) return false;
          return true;
        }).slice();
      }
    }
  }
  protected removeStation(id: string): void{
    this.stations = this.stations.filter((station: SelectData) => {
      if(station.id === id) return false;
      return true;
    }).slice();
    this.stationsCardInfos = this.stationsCardInfos.filter((params: StationCardParams) => {
      if(params.station.id === id) return false;
      return true;
    }).slice();
  }
  protected setPreferenceType(event: any, params: string): void{
    if(params === 'cat'){
      let category = event.find((element: SelectData) => element.selected === true)?.name;
      this.typeSelect = [];
      this.dataService.getTypeByCategory(category).subscribe((types: Type[]) => {
        types.forEach((type: Type) => {
          let selected: boolean = false;
          if(this.types.find((element: SelectData) => type.id === element.id) != null)  selected = true;
          this.typeSelect.push({
            id: type.id,
            name: type.name,
            originalData: type,
            selected: selected
          });
        });
        this.typeSelect = [...this.typeSelect];
      });
    } else if(params === 'type'){
      this.typesCardInfos = [];
      let filter = event.filter((type: SelectData) =>{
        const find = this.types.find((check: SelectData) => check.id === type.id);
        if(find != null)  return false;
        else if(type.selected) return true;
        return false;
      });
      if(filter.length > 0) this.types.push(filter[0]);
      else{
        filter = event.filter((type: SelectData) => {
          const find = this.types.find((check: SelectData) => check.id === type.id);
          if(find != null && !type.selected)  return true;
          return false;
        });
        const idToSuppress = filter[0].id;
        this.types = this.types.filter((type: SelectData) => {
          if(type.id === idToSuppress) return false;
          return true;
        }).slice();
      }
      this.types.forEach((element: SelectData) => {
        this.typesCardInfos.push({
          type: element.originalData,
          width: 20,
          height: 400
        });
      });
    }
  }
  protected removeImg(): void{
    this.userInfos.img = "";
  }
  protected getFile(event: string): void {
    this.userInfos.img = event;
  }
  protected navigateToLogin(): void{
    this.router.navigate(['/login']);
  }
  protected previousStep(): void{
    if(this.firstClickPrevious){
      this.dblClickPrevious = true;
    }
    this.firstClickPrevious = true;
    setTimeout(() => {
      if(!this.dblClickPrevious){
        this.firstClickPrevious = false;
        fireTitle.next(this.firstClickPrevious);  
      } else{
        this.firstClickPrevious = false;
        this.dblClickPrevious = false;
      }
    },500);

    let fireTitle: Subject<boolean> = new Subject();
    if(this.regionAnimation === "show"){
      this.buttonColor = this.buttonColorGeneral;
      this.generalAnimation = "show";
      this.regionAnimation = "hidden";
      this.typeAnimation = "hidden";
      this.titleRegionAnimation = "hidden";
      setTimeout(() => {
        this.titleGeneralAnimation = "show";
      },500);
      this.nextStepButtonMessage = "Vos stations";
    }
    else if(this.typeAnimation === "show"){
      this.buttonColor = this.buttonColorRegion;
      this.generalAnimation = "hidden";
      this.regionAnimation = "show";
      this.typeAnimation = "half";
      this.titleTypeAnimation = "hidden";
      fireTitle.subscribe(() => {
        this.titleRegionAnimation = "show";
      });
      this.nextStepButtonMessage = "Vos préférences";
    }
  }
  protected nextStep(): void{
    if(this.firstClickNext){
      this.dblClickNext = true;
    }
    this.firstClickNext = true;
    setTimeout(() => {
      if(!this.dblClickNext){
        this.firstClickNext = false;
        fireTitle.next(this.firstClickNext);  
      } else{
        this.firstClickNext = false;
        this.dblClickNext = false;
      }
    },500);

    let fireTitle: Subject<boolean> = new Subject();
    
    if(this.generalAnimation === "show"){
      this.buttonColor = this.buttonColorRegion;
      this.generalAnimation = "hidden";
      this.regionAnimation = "show";
      this.typeAnimation = "half";
      this.titleGeneralAnimation = "hidden";
      fireTitle.subscribe(() => {
        this.titleRegionAnimation = "show";
      });
      this.nextStepButtonMessage = "Vos préférences";
    }
    else if(this.regionAnimation === "show"){
      this.buttonColor = this.buttonColorType;
      this.generalAnimation = "half";
      this.regionAnimation = "half";
      this.typeAnimation = "show";
      this.titleRegionAnimation = "hidden";
      this.nextStepButtonMessage = "Terminer";
      setTimeout(() => {
        this.titleTypeAnimation = "show";
      },500);
    }
    else if(this.titleTypeAnimation === "show"){
      this.create();
    }
  }
  protected create(): void{
    this.valid = false;
    if(this.validName && this.validPassword){
      this.userInfos.id = this.dataService.setId();
      this.dataService.signup(this.userInfos).subscribe(res => {
        if(res.error){
          this.message = res.message;
          this.showMessage = "show";
          setTimeout(() => {
            this.showMessage = "hidden";
          },2000);
          this.userInfos = {
            id: "",
            login: "",
            password: "",
            role: "User",
            img: ""
          };
        } else{
          this.stations.forEach((station: SelectData) => {
            this.dataService.addStationOfUser(this.userInfos.id,station.id);
          });
          this.types.forEach((type: SelectData) => {
            this.dataService.addTypeOfUser(this.userInfos.id,type.id);
          });
          this.valid = true;
          this.message = "Utilisateur créé avec succès";
          this.showMessage = "show";
          setTimeout(() => {
            this.showMessage = "hidden";
            this.router.navigate(['/login'])
          },2000);
        }
      });
    } else{
      if(!this.validName && this.userInfos.login.length <= 2) this.message = "Le login doit faire au moins 3 caractères.";
      else if(!this.validName && this.userInfos.login.length > 2) this.message = "Ce login est déjà pris.";
      else  this.message = "Le mot de passe doit faire au moins 4 caractères.";
      this.showMessage = "show";
      setTimeout(() => {
        this.showMessage = "hidden";
      },2000);
    }
  }

}
