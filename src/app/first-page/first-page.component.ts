import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faAddressCard, faFilter, faBurger, faMartiniGlass, faScrewdriverWrench, faCity, faTrain, faCircleInfo, faAddressBook, faGears, faArrowTrendUp, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonInfos } from '../shared/model/designs';
import { Position } from '../add/add.component';
import { bottomBarIconsFirstPageComponent, iconsFirstPageComponent, loginButtonColorInfosFirstPageComponent, registerButtonColorInfosFirstPageComponent } from '../shared/model/design/buttonsDesign';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
  animations: [
    trigger('bottomLogo', [
      state('show', style({
        opacity: '1',
        right: '10vw'
      })),
      state('hidden', style({
        opacity: '0',
        right: '0'
      })),
      transition('* => hidden', [
        animate('2s ease-out')
      ]),
      transition('* => show', [
        animate('2s ease-out')
      ])
    ]),
    trigger('topLogo', [
      state('show', style({
        opacity: '1',
        left: '10vw'
      })),
      state('hidden', style({
        opacity: '0',
        left: '0'
      })),
      transition('* => hidden', [
        animate('2s ease-out')
      ]),
      transition('* => show', [
        animate('2s ease-out')
      ])
    ]),
    trigger('resultDiv', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
    ]),
    trigger('button', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
    ]),
    trigger('showTitle', [
      state('show', style({
        opacity: '1'
      })),
      transition('* => show', [
        animate('2s ease')
      ])
    ])
  ]
})
export class FirstPageComponent {
  constructor(
    private router: Router
  ) {}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected loginButtonColorInfos: ButtonInfos = loginButtonColorInfosFirstPageComponent;
  protected registerButtonColorInfos: ButtonInfos = registerButtonColorInfosFirstPageComponent;
  protected iconsInfos: ButtonInfos = iconsFirstPageComponent;
  protected bottomBarIconsInfos: ButtonInfos = bottomBarIconsFirstPageComponent;
/*  Css  */
  @HostBinding('style.--logoColor') logoColor: string = "var(--black)";
  @HostBinding('style.--roundBackgroundColor') roundBackgroundColor: string = "var(--mainColor)";
  @HostBinding('style.--centralRoundBackgroundColor') centralRoundBackgroundColor: string = "var(--thirdColor)";
  protected textColor: string = "var(--thirdColor)";
  protected diversityColor: string = "var(--thirdColor)";
  protected efficientColor: string = "var(--secondColor)";
  protected fastColor: string = "#F5B700";
  protected discoveryColor: string = "#FF715B";
  protected proximityColor: string = "#8963BA";
  protected shareColor: string = "#274690";
  protected backgroundColor: string = "linear-gradient(to bottom, var(--mainColor),var(--white),white)";
  protected logoImageSrc: string = "../../assets/logo/black_logo.png";
/*  Icons  */
  protected presentationIcon: IconDefinition = faAddressCard;
  protected filterIcon: IconDefinition = faFilter;
  protected burgerIcon: IconDefinition = faBurger;
  protected locationIcon: IconDefinition = faGears;
  protected barIcon: IconDefinition = faMartiniGlass;
  protected professionnalIcon: IconDefinition = faScrewdriverWrench;
  protected cityIcon: IconDefinition = faCity;
  protected metroIcon: IconDefinition = faTrain;
  protected infosIcon: IconDefinition = faCircleInfo;
  protected propertyIcon: IconDefinition = faAddressBook;
  protected benefitsIcon: IconDefinition = faArrowTrendUp;
  protected signInIcon: IconDefinition = faRightToBracket;
  protected signUpIcon: IconDefinition = faUserPlus;
/*  Algos  */
  protected triggerLogoAnimation: string = "hidden";  
  protected positionPresentationIcon: PositionIcon;
  protected positionLocationIcon: PositionIcon;
  protected positionBenefitsIcon: PositionIcon;
  protected styleLine: StyleLine = {
    textColor: "",
    backgroundColor: "",
    titleColor: "",
    shadowGradient: "",
  }
  protected logoPosition: number = 0;

  protected navigate(url: string, filterType?: string) : void{
    this.router.navigate([url]);
    sessionStorage.setItem("lastPage","/firstPage");
  }
  private moveIcon(scrollPosition: number) : void{
    let firstSectionPosition:Position = this.initIconPosition();
    let secondSectionPosition:Position = this.initIconPosition();
    let presentationSectionPosition:Position = this.initIconPosition();
    let locationSectionPosition:Position = this.initIconPosition();
    let benefitsSectionPosition: Position = this.initIconPosition();

    if(document.getElementById("first") != null){
      firstSectionPosition = {
        top:(document.getElementById("first").getBoundingClientRect().top + document.getElementById("first").getBoundingClientRect().height) * 0.6,
        height: document.getElementById("first").getBoundingClientRect().height * 0.6
      } 
    }
    if(document!.getElementById("about") != null){
      secondSectionPosition = {
        top:document!.getElementById("about").getBoundingClientRect().top + document.getElementById("about").getBoundingClientRect().height,
        height: document!.getElementById("about").getBoundingClientRect().height
      } 
    }
    if(document!.getElementById("presentation") != null){
      presentationSectionPosition = {
        top:document!.getElementById("presentation").getBoundingClientRect().top,
        height: window.innerHeight
      } 
    }
    if(document!.getElementById("iconLine") != null){
      locationSectionPosition = {
        top:document!.getElementById("iconLine").getBoundingClientRect().top,
        height: window.innerHeight
      } 
    }
    if(document!.getElementById("benefits") != null){
      benefitsSectionPosition = {
        top:document!.getElementById("benefits").getBoundingClientRect().top,
        height: document!.getElementById("benefits").getBoundingClientRect().height
      } 
    }
    if(firstSectionPosition.top >= 0 && firstSectionPosition.top <= firstSectionPosition.height){
      this.logoPosition = 15 - 5 * (firstSectionPosition.top/firstSectionPosition.height);
    }
    if(presentationSectionPosition.top > 0 && presentationSectionPosition.top < presentationSectionPosition.height){
      if(40 - 100 * (presentationSectionPosition.top/presentationSectionPosition.height) < 30)  this.positionPresentationIcon.paddingIcon = 40 - 100 * (presentationSectionPosition.top/presentationSectionPosition.height);
      this.positionPresentationIcon.scaleShadow = 1 - 0.4 * (presentationSectionPosition.top/presentationSectionPosition.height);
      if(this.positionPresentationIcon.paddingIcon > -35) this.positionPresentationIcon.titleOpacity = true;
      else this.positionPresentationIcon.titleOpacity = false;
      if(this.positionPresentationIcon.paddingIcon > -15) this.positionPresentationIcon.textOpacity = true;
      else this.positionPresentationIcon.textOpacity = false;
    }
    if(locationSectionPosition.top > 0 && locationSectionPosition.top < locationSectionPosition.height){
      if(40 - 100 * (locationSectionPosition.top/locationSectionPosition.height) < 30) this.positionLocationIcon.paddingIcon = 40 - 100 * (locationSectionPosition.top/locationSectionPosition.height);
      this.positionLocationIcon.scaleShadow = 1 - 0.4 * (locationSectionPosition.top/locationSectionPosition.height);
      if(this.positionLocationIcon.paddingIcon > -35) this.positionLocationIcon.titleOpacity = true;
      else this.positionLocationIcon.titleOpacity = false;
      if(this.positionLocationIcon.paddingIcon > -15) this.positionLocationIcon.textOpacity = true;
      else this.positionLocationIcon.textOpacity = false;
    }
    if(benefitsSectionPosition.top > 0 && benefitsSectionPosition.top < benefitsSectionPosition.height){
      if(40 - 100 * (benefitsSectionPosition.top/benefitsSectionPosition.height) < 30)  this.positionBenefitsIcon.paddingIcon = 40 - 100 * (benefitsSectionPosition.top/benefitsSectionPosition.height);
      this.positionBenefitsIcon.scaleShadow = 1 - 0.4 * (benefitsSectionPosition.top/benefitsSectionPosition.height);
      if(this.positionBenefitsIcon.paddingIcon > -35) this.positionBenefitsIcon.titleOpacity = true;
      else this.positionBenefitsIcon.titleOpacity = false;
      if(this.positionBenefitsIcon.paddingIcon > -15) this.positionBenefitsIcon.textOpacity = true;
      else this.positionBenefitsIcon.textOpacity = false;
    }
    if(scrollPosition < window.innerHeight){
      this.setStyleColor(1);
    } else if(benefitsSectionPosition.top > 50){
      this.setStyleColor(3);
    } else if(benefitsSectionPosition.top <= 50){
      this.setStyleColor(2);
    }
  }
  private initIconPosition() : Position{
    return  {
      top:0,
      height: 0
    };
  }
  private setStyleColor(style: number) : void{
    if(style === 1){
      this.styleLine = {
        textColor: "var(--black)",
        titleColor: "var(--black)",
        shadowGradient: "linear-gradient(rgba(12,18,18,0.2),rgba(12,18,18,0.2))",
        backgroundColor: 'var(--mainColor)'
      }
    } else if(style === 2){
      this.styleLine = {
        textColor: "white",
        titleColor: "var(--black)",
        shadowGradient: "linear-gradient(rgba(12,18,18,0.2),rgba(12,18,18,0.2))",
        backgroundColor: "var(--black)"
      }
    } else if(style === 3){
      this.styleLine = {
        textColor: "var(--black)",
        titleColor: "var(--black)",
        shadowGradient: "linear-gradient(rgba(12,18,18,0.2),rgba(12,18,18,0.2))",
        backgroundColor: "var(--black)"
      }
    }
  }
  private ngOnInit(): void{
    this.setStyleColor(1);
    this.positionBenefitsIcon = this.initIconStyle();
    this.positionLocationIcon = this.initIconStyle();
    this.positionPresentationIcon = this.initIconStyle();
  }
  private initIconStyle(): PositionIcon{
    return {
      paddingIcon: 0,
      scaleShadow: 1,
      textOpacity: true,
      titleOpacity: true
    };
  }
  private ngAfterContentInit(): void {
    window.addEventListener("wheel", () => {
      this.moveIcon(window.scrollY);
    });    
    window.addEventListener("scroll", () => {
      this.moveIcon(window.scrollY);
    });
    this.triggerLogoAnimation = "show";
  }
}

interface StyleLine{
  textColor: string,
  backgroundColor: string,
  titleColor: string,
  shadowGradient: string
}
interface PositionIcon{
  paddingIcon: number,
  scaleShadow: number,
  textOpacity: boolean,
  titleOpacity: boolean
}