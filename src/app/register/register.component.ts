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
import { IconDefinition, faUser, faXmark, faCameraRetro, faArrowLeft, faCaretLeft, faCaretRight, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { blackLignesUserComponent, buttonColorGeneralRegisterComponent, buttonColorRegionRegisterComponent, buttonColorRegisterComponent, buttonColorTypeRegisterComponent, buttonPhoneInfosRegisterComponent, crossButtonRegisterComponent, iconsInfosRegisterComponent, uploadButtonInfosRegisterComponent, uploadButtonRegisterComponent } from '../shared/model/design/buttonsDesign';
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
  protected iconsInfos: ButtonInfos = iconsInfosRegisterComponent;
  protected buttonPhoneInfos: ButtonInfos = buttonPhoneInfosRegisterComponent;
  protected lignesButtonInfos: ButtonInfos = blackLignesUserComponent;
  protected categoriesButtonInfos: ButtonInfos = blackLignesUserComponent;

/*  Icon  */
  protected rightIcon: IconDefinition = faCaretRight;
  protected leftIcon: IconDefinition = faCaretLeft;
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected photoIcon: IconDefinition = faCameraRetro;
  protected signInIcon: IconDefinition = faRightToBracket;
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
  protected region: string = "";
  protected userInfos: User = {
    id: "",
    login: "",
    password: "",
    role: "User",
    img: "",
    couv: ""
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
  protected typesList: Type[] = [];

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
  protected removeImg(): void{
    this.userInfos.img = "";
  }
  protected getFile(event: string): void {
    this.userInfos.img = event;
  }
  protected navigateToLogin(): void{
    this.router.navigate(['/login']);
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
            img: "",
            couv: ''
          };
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
