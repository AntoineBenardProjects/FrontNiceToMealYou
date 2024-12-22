import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/model/table/user';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { ButtonInfos, InputInfos } from '../shared/model/designs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { desktopButtonsLoginComponent, uploadButtonRegisterComponent } from '../shared/model/design/buttonsDesign';
import { inputInfosLoginComonent, invalidInputRegisterComponent, validInputRegisterComponent } from '../shared/model/design/inputsDesign';
import { Message } from '../shared/model/params/message';
import { ChangeBackgroundColorComponentInfos, ChangeBackgroundColorInfos, MovingRectangleBackground } from '../shared/model/displayValues/general';
import { selectionableColors } from '../shared/design/buttons/change-background-buttons/change-background-buttons.component';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { CardsBackgroundInfos } from './infos-design/cardsBackground.infos';
import { IconDefinition, faUser, faXmark, faCameraRetro, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { CardsBackgroundRegisterInfos } from './infos-design/cardsBackgroundRegister.infos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
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
export class LoginComponent implements OnInit {

  constructor( 
    private dataService: DatabaseService, 
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService) { }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected desktopButtonColorInfos: ButtonInfos = desktopButtonsLoginComponent;
  protected inputInfos: InputInfos = inputInfosLoginComonent;
  protected validInput: InputInfos = validInputRegisterComponent;
  protected invalidInput: InputInfos = invalidInputRegisterComponent;
  protected uploadButton: ButtonInfos = uploadButtonRegisterComponent;
  /*  Icon  */
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected photoIcon: IconDefinition = faCameraRetro;
  protected signInIcon: IconDefinition = faRightToBracket;

/*  Algo  */
  protected userInfos: User = new User();
  protected validName: boolean = false;
  protected validPassword: boolean = false;
  protected message: string = "";
  protected showMessage: string="hidden";
  protected valid: boolean = false;
  protected backgroundColor: ChangeBackgroundColorInfos = {
    color: "var(--white)",
    logoToShow: "mainColor",
  };
  protected selectionableColors: ChangeBackgroundColorInfos[] = selectionableColors;
  protected paletteName: string;
  protected secondComplementaryColor: string = "var(--secondColor)";
  protected complementaryColor: string = "var(--mainColor)";
  protected textColor: string = "var(--black)";
  protected infosCardsBackground: MovingRectangleBackground[] = JSON.parse(JSON.stringify(CardsBackgroundInfos));

  protected isLoginPage: boolean = true;

  ngOnInit(): void {
    this.checkForIdentificationToken();
    this.route.params.subscribe(params => {
      params['page'] === 'login' ? this.isLoginPage = true :
      this.isLoginPage = false;
      this.setAnimationInPageChange();
    });
    this.themeService.getPalette().subscribe((palette: ColorPalette) => {
      this.paletteName = palette.name;
    });
  }
  private checkForIdentificationToken() {
    setTimeout(() => {
      this.auth.isAuthenticated();
    }, 1);
  }
  private setColorInfosCardsBackground() {
    this.infosCardsBackground.forEach((infos: MovingRectangleBackground) => {
      infos.color = this.getBackgroundColor(infos);
    });
  }
  private getBackgroundColor(infos: MovingRectangleBackground): string{
    if(infos.height < 40 || infos.width < 40)  return this.secondComplementaryColor;
    return this.complementaryColor;
  }
  protected changeBackgroundColor(color: ChangeBackgroundColorComponentInfos){
    this.backgroundColor = color.background;
    this.textColor = color.textColor;
    this.complementaryColor = color.complementaryColor;
    this.secondComplementaryColor = color.secondComplementaryColor;
    this.setNavbarButtonsStyle();
    this.setColorInfosCardsBackground();
  }

  private setNavbarButtonsStyle() {
    let textButtonColor: string = "var(--white)";
    if(this.backgroundColor.color === 'var(--black)') textButtonColor = 'var(--black)';
    this.uploadButton.color = textButtonColor;
    this.uploadButton.colorActive = this.complementaryColor;
    this.uploadButton.backgroundColor = this.complementaryColor;
    this.uploadButton.backgroundColorActive = textButtonColor;
    this.uploadButton.borderColor = this.complementaryColor;
    this.uploadButton.borderColorActive = this.complementaryColor;

    this.desktopButtonColorInfos.color = textButtonColor;
    this.desktopButtonColorInfos.colorActive = this.complementaryColor;
    this.desktopButtonColorInfos.backgroundColor = this.complementaryColor;
    this.desktopButtonColorInfos.backgroundColorActive = textButtonColor;
    this.desktopButtonColorInfos.borderColor = this.complementaryColor;
    this.desktopButtonColorInfos.borderColorActive = this.complementaryColor;

    this.inputInfos.color = this.complementaryColor;
    this.inputInfos.placeholderColor = this.complementaryColor;
    this.inputInfos.hoverTextColor = textButtonColor;
    this.inputInfos.placeholderColorActive = this.complementaryColor;
    this.inputInfos.backgroundColor = textButtonColor;
    this.inputInfos.hoverBackgroundColor = this.complementaryColor;
    this.inputInfos.borderColor = textButtonColor;
    this.inputInfos.borderColorActive = textButtonColor;
    this.inputInfos.bottomOnly = false;

    this.uploadButton = JSON.parse(JSON.stringify(this.uploadButton));
    this.desktopButtonColorInfos = JSON.parse(JSON.stringify(this.desktopButtonColorInfos));
    this.inputInfos = JSON.parse(JSON.stringify(this.inputInfos));
  }

  protected setValue(event: any, params: string): void{
    if(params === 'Login')  this.userInfos.login = event.target.value;
    else if(params === 'Password')  this.userInfos.password = event.target.value;
  }
  
  protected demoConnexion(): void{
    const userInfo: User = new User();
    this.dataService.login(userInfo).subscribe((navigate: any) => {
      if(!navigate.error){
        this.getUserInfos(navigate as User);
      }
      else{
        this.showConnexionErrorMessage(navigate);
      }
    });
  }

  protected getFile(event: string): void {
    this.userInfos.img = event;
  }
  protected removeImg(): void{
    this.userInfos.img = "";
  }
  protected connexion(): void{
    const userInfo: User = new User(this.userInfos.login,this.userInfos.password);
    this.dataService.login(userInfo).subscribe((navigate: any) => {
      if(!navigate.error){
        this.getUserInfos(navigate)
      }
      else{
        this.showConnexionErrorMessage(navigate);
      }
    });
  }

  protected create(): void{
    this.valid = false;
    const arePasswordAndLoginValid: boolean = this.validName && this.validPassword
    if(arePasswordAndLoginValid){
      this.sendSignupInfos();
    } else{
      this.showErorMessageLoginOrPasswordInvalid();
    }
  }

  protected navigateToOtherPage(): void{
    this.isLoginPage = !this.isLoginPage;
    this.setAnimationInPageChange();
  }

  private setAnimationInPageChange(){
    this.userInfos = new User();
    this.userIcon = JSON.parse(JSON.stringify(this.userIcon));
    this.infosCardsBackground.forEach((infos: MovingRectangleBackground, index: number) => {
      let cardsBackgroundInfosToSet: MovingRectangleBackground;
      if(this.isLoginPage){
        cardsBackgroundInfosToSet = CardsBackgroundInfos[index];
      } else{
        cardsBackgroundInfosToSet = CardsBackgroundRegisterInfos[index];
      }            
      infos.width = cardsBackgroundInfosToSet.width;
      infos.left = cardsBackgroundInfosToSet.left;
      infos.originalLeft = cardsBackgroundInfosToSet.originalLeft;
      infos.top = cardsBackgroundInfosToSet.top;
      infos.originalTop = cardsBackgroundInfosToSet.originalTop;
      infos.height = cardsBackgroundInfosToSet.height;

    });
    this.infosCardsBackground = this.infosCardsBackground.slice();
  }
  private showErorMessageLoginOrPasswordInvalid() {
    if (!this.validName && this.userInfos.login.length <= 2) this.message = "Le login doit faire au moins 3 caractères.";
    else if (!this.validName && this.userInfos.login.length > 2) this.message = "Ce login est déjà pris.";
    else this.message = "Le mot de passe doit faire au moins 4 caractères.";
    this.showMessage = "show";
    setTimeout(() => {
      this.showMessage = "hidden";
    }, 2000);
  }

  private sendSignupInfos() {
    this.userInfos.id = this.dataService.setId();
    this.dataService.signup(this.userInfos).subscribe(res => {
      if (res.error) {
        this.showErrorMessageOnSignup(res);
      } else {
        this.navigateToOtherPage();
      }
    });
  }

  private showErrorMessageOnSignup(res: Message) {
    this.message = res.message;
    this.showMessage = "show";
    setTimeout(() => {
      this.showMessage = "hidden";
    }, 2000);
    this.userInfos = new User();
    this.userInfos.login = "";
  }

  private checkIfPasswordIsValid(event: any) {
    event.target.value.length > 3 ? this.validPassword = true : this.validPassword = false;
  }
  private checkIfLoginIsValid() {
    this.userInfos.login.length <= 2 ? this.validName = false : this.dataService.getValidLogin(this.userInfos.login).subscribe((res: boolean) => {
      this.validName = res;
    });
  }

  private setPageAsRegisterPage(){

  }

  private setPageAsLoginPage(){

  }

  private showConnexionErrorMessage(errorMessage: Message) {
    this.message = errorMessage.message;
    this.showMessage = "show";
    setTimeout(() => {
      this.showMessage = "hidden";
    }, 2000);
  }

  private getUserInfos(user: any) {
    localStorage.setItem("id", user.params.id);
    localStorage.setItem("login", user.params.login);
    localStorage.setItem("token", user.token);
    this.dataService.getImage(user.params.id).subscribe((pictures: string[]) => {
      localStorage.setItem("img", pictures[0]);
      localStorage.setItem("couv", pictures[1]);
      this.router.navigate(['/home']);
    });
  }

}
