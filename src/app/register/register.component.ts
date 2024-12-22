import { Component } from '@angular/core';
import { User } from '../shared/model/table/user';
import { DatabaseService } from '../services/database.service';
import { ButtonInfos, InputInfos } from '../shared/model/designs';
import { Router } from '@angular/router';
import { IconDefinition, faUser, faXmark, faCameraRetro, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { buttonColorGeneralRegisterComponent, buttonColorRegisterComponent, desktopButtonsLoginComponent, iconsInfosRegisterComponent, uploadButtonInfosRegisterComponent, uploadButtonRegisterComponent } from '../shared/model/design/buttonsDesign';
import { invalidInputRegisterComponent, validInputRegisterComponent } from '../shared/model/design/inputsDesign';
import { Message } from '../shared/model/params/message';
import { CardsBackgroundInfos } from '../login/infos-design/cardsBackground.infos';
import { selectionableColors } from '../shared/design/buttons/change-background-buttons/change-background-buttons.component';
import { ChangeBackgroundColorComponentInfos, ChangeBackgroundColorInfos, MovingRectangleBackground } from '../shared/model/displayValues/general';
import { ThemeService } from '../services/theme.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private dataService: DatabaseService, 
    private themeService: ThemeService,
    private router: Router) { }

  //////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected buttonColor: ButtonInfos = buttonColorRegisterComponent;
  protected buttonColorGeneral: ButtonInfos = buttonColorGeneralRegisterComponent;
  protected uploadButtonInfos: ButtonInfos = uploadButtonInfosRegisterComponent;
  protected validInput: InputInfos = validInputRegisterComponent;
  protected invalidInput: InputInfos = invalidInputRegisterComponent;
  protected uploadButton: ButtonInfos = uploadButtonRegisterComponent;
  protected desktopButtonColorInfos: ButtonInfos = desktopButtonsLoginComponent;
  protected iconsInfos: ButtonInfos = iconsInfosRegisterComponent;

/*  Icon  */
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected photoIcon: IconDefinition = faCameraRetro;
  protected signInIcon: IconDefinition = faRightToBracket;
/*  Algo  */
  protected userInfos: User = new User();
  protected validLogin: boolean = false;
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
  protected infosCardsBackground: MovingRectangleBackground[] = CardsBackgroundInfos;

  ngOnInit(){
    this.themeService.getPalette().subscribe((palette: ColorPalette) => {
      this.paletteName = palette.name;
    });
  }

  protected setLoginValue(event: any): void{
    this.userInfos.login = event.target.value;
    this.checkIfLoginIsValid();
  } 
  protected setPasswordValue(event: any){
    this.userInfos.login = event.target.value;
    this.checkIfPasswordIsValid(event);
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

    this.desktopButtonColorInfos.color = textButtonColor;
    this.desktopButtonColorInfos.colorActive = this.complementaryColor;
    this.desktopButtonColorInfos.backgroundColor = this.complementaryColor;
    this.desktopButtonColorInfos.backgroundColorActive = textButtonColor;
    this.desktopButtonColorInfos.borderColor = this.complementaryColor;
    this.desktopButtonColorInfos.borderColorActive = this.complementaryColor;

    textButtonColor = 'var(--white)';
    if(this.textColor === 'var(--white)') textButtonColor = 'var(--black)';

    this.desktopButtonColorInfos = JSON.parse(JSON.stringify(this.desktopButtonColorInfos));
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
    const arePasswordAndLoginValid: boolean = this.validLogin && this.validPassword
    if(arePasswordAndLoginValid){
      this.sendSignupInfos();
    } else{
      this.showErorMessageLoginOrPasswordInvalid();
    }
  }


  private showErorMessageLoginOrPasswordInvalid() {
    if (!this.validLogin && this.userInfos.login.length <= 2) this.message = "Le login doit faire au moins 3 caractères.";
    else if (!this.validLogin && this.userInfos.login.length > 2) this.message = "Ce login est déjà pris.";
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
        this.navigateToLoginPage();
      }
    });
  }

  private navigateToLoginPage() {
    this.showSuccessMessage();
    setTimeout(() => {
      this.showMessage = "hidden";
      this.router.navigate(['/login']);
    }, 2000);
  }

  private showSuccessMessage() {
    this.valid = true;
    this.message = "Utilisateur créé avec succès";
    this.showMessage = "show";
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
    this.userInfos.login.length <= 2 ? this.validLogin = false : this.dataService.getValidLogin(this.userInfos.login).subscribe((res: boolean) => {
      this.validLogin = res;
    });
  }
}
