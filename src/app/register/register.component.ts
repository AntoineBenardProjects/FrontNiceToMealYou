import { Component } from '@angular/core';
import { User } from '../model/user';
import { DatabaseService } from '../services/database.service';
import { ButtonInfos, InputInfos, SelectData, SelectInfos } from '../shared/model/designs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Ligne, Station } from '../model/transports';
import { Data } from 'src/data';
import { TypePicture } from '../model/typePicture';
import { Subject } from 'rxjs';

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

  protected buttonColor: ButtonInfos = {
    color: 'var(--white)',
    borderColor: 'var(--white)',
    borderColorActive: 'var(--white)',
    colorActive: 'var(--black)',
    backgroundColor: 'transparent',
    backgroundColorActive: 'var(--white)'
  }
  protected buttonColorGeneral: ButtonInfos = {
    color: 'var(--white)',
    borderColor: 'var(--white)',
    borderColorActive: 'var(--white)',
    colorActive: 'var(--black)',
    backgroundColor: 'transparent',
    backgroundColorActive: 'var(--white)'
  }
  protected buttonColorRegion: ButtonInfos = {
    color: 'var(--white)',
    borderColor: 'var(--black)',
    borderColorActive: 'var(--black)',
    backgroundColor: 'var(--black)',
    colorActive: 'var(--black)',
    backgroundColorActive: 'var(--white)'
  }
  protected buttonColorType: ButtonInfos = {
    color: 'var(--mainColor)',
    borderColor: 'var(--secondColor)',
    borderColorActive: 'var(--secondColor)',
    backgroundColor: 'var(--secondColor)',
    colorActive: 'var(--secondColor)',
    backgroundColorActive: 'var(--mainColor)'
  }
  protected uploadButtonInfos: ButtonInfos = {
    color: 'var(--black)',
    backgroundColor: 'var(--white)'
  }

  protected validInput: InputInfos = {
    color: "var(--white)",
    placeholderColor: "var(--white)",
    placeholderColorActive: "var(--thirdColor)",
    backgroundColor: "var(--secondColor)",
    borderColor: "var(--thirdColor)",
    borderColorActive: "var(--thirdColor)",
    hoverBackgroundColor: "var(--thirdColor)",
    hoverTextColor: "var(--white)",
    hoverBorderColor: "var(--thirdColor)",
  }
  protected invalidInput: InputInfos = {
    color: "var(--white)",
    placeholderColor: "var(--white)",
    placeholderColorActive: "var(--white)",
    backgroundColor: "var(--secondColor)",
    borderColor: "var(--white)",
    borderColorActive: "var(--white)",
    hoverBackgroundColor: "var(--white)",
    hoverTextColor: "var(--secondColor)",
    hoverBorderColor: "var(--secondColor)",
  }

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
  constructor(private dataService: DatabaseService, private router: Router) { }

  protected nextStepButtonMessage: string = "Vos stations";
  protected generalAnimation: string = "show";
  protected regionAnimation: string = "hidden";
  protected typeAnimation: string = "hidden";
  protected titleGeneralAnimation: string = "show";
  protected titleRegionAnimation: string = "hidden";
  protected titleTypeAnimation: string = "hidden";
  
  
  ngOnInit(){
    this.dataService.getAllRegion().subscribe((res: string[]) => {
      res.forEach((element: string) => {
        this.regionSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
      this.regionSelect = this.regionSelect.slice();
    });
  }

  setValue(event: any, params: string){
    if(params === 'Login'){
      this.userInfos.login = event.target.value;
      if(this.userInfos.login.length > 2){
        this.dataService.getValidName(this.userInfos.login).subscribe((res: boolean) => {
          this.validName = res;
        });
      } else{
        this.validName = false;
      }
    }
    else if(params === 'Password'){
      this.userInfos.password = event.target.value;
      event.target.value.length > 3 ? this.validPassword = true : this.validPassword = false;
    }
  }

  protected selectInfosRegion: SelectInfos = {
    backgroundColor: 'var(--white)',
    topHoverBackgroundColor: 'var(--black)',
    topHoverColor: 'var(--white)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--black)',
    optionBackgroundColor: 'var(--white)',
    hoverBackgroundColor: 'var(--black)',
    hoverTextColor: 'var(--white)',
    borderColor: 'var(--black)',
    width: 10
  }
  protected regionSelect: SelectData[] = [];
  protected transportSelect: SelectData[] = [];
  protected ligneSelect: SelectData[] = [];
  protected stationSelect: SelectData[] = [];
  protected stations: SelectData[] = [];
  protected region: string = "";
  setPreferenceGeo(event: any, params: string){
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
        this.stations.push(filter[0]);
        let counter: number = 0;
        this.stations.forEach((element: SelectData) => {
          this.dataService.getLignesOfStation(element.id).subscribe((res: Ligne[]) => {
            element.originalData = res;
            counter++;
            if(counter === this.stations.length - 1)  this.stations = this.stations.slice();
          });
        });
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
      }
    }
  }

  protected selectInfosType: SelectInfos = {
    backgroundColor: 'var(--mainColor)',
    topHoverBackgroundColor: 'var(--black)',
    topHoverColor: 'var(--mainColor)',
    textColor: 'var(--black)',
    optionTextColor: 'var(--black)',
    optionBackgroundColor: 'var(--mainColor)',
    hoverBackgroundColor: 'var(--black)',
    hoverTextColor: 'var(--mainColor)',
    borderColor: 'var(--black)',
    width: 10
  }
  protected categorySelect: SelectData[] = [{id: "Restaurant", name: "Restaurant", selected: false}];
  protected typeSelect: SelectData[] = [];
  protected types: SelectData[] = [];
  setPreferenceType(event: any, params: string){
    if(params === 'cat'){
      let category = event.find((element: SelectData) => element.selected === true)?.name;
      this.typeSelect = [];
      Data.forEach((type: TypePicture) => {
        const find: SelectData = this.types.find((element: SelectData) => type.type === element.id);
        let selected: boolean = false;
        if(find != null)  selected = true;
        if(type.place === category)  this.typeSelect.push({
          id: type.type,
          name: type.type,
          originalData: type.urlIcon,
          selected: selected
        });
      });
    } else if(params === 'type'){
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
    }
  }

  removeImg(){
    this.userInfos.img = "";
  }
  facadeImage(event: string) {
    this.userInfos.img = event;
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  protected firstClickPrevious: boolean = false;
  protected dblClickPrevious: boolean = false;
  previousStep(){
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

  protected firstClickNext: boolean = false;
  protected dblClickNext: boolean = false;
  nextStep(){
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
  }

  create(){
    this.valid = false;
    if(this.validName && this.validPassword){
      this.dataService.signup(this.userInfos).subscribe(res => {
        this.userInfos = {
          id: "",
          login: "",
          password: "",
          role: "User",
          img: ""
        };
        if(res.error){
          this.message = res.message;
          this.showMessage = "show";
          setTimeout(() => {
            this.showMessage = "hidden";
          },2000);
        } else{
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
