import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faAddressCard, faFilter, faBurger, faMartiniGlass, faScrewdriverWrench, faCity, faTrain, faCircleInfo, faAddressBook, faGears, faArrowTrendUp, faRightToBracket, faUserPlus, faArrowDown, faPencil, faSignsPost, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonInfos } from '../shared/model/designs';
import { bottomBarIconsFirstPageComponent, iconsCardsFirstPrincipesInfos, iconsCardsSecondPrincipesInfos, iconsCardsThirdPrincipesInfos, iconsFirstPageComponent, loginButtonColorInfosFirstPageComponent, registerButtonColorInfosFirstPageComponent } from '../shared/model/design/buttonsDesign';
import { ChangeBackgroundColorComponentInfos, ChangeBackgroundColorInfos, ColorsAndText, IdValue, MovingRectangleBackground, PositionIconFirstPage, StyleLineFirstPage, TopHeight } from '../shared/model/displayValues/general';
import { ThemeService } from '../services/theme.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { CardsBackgroundInfos } from './infos-design/cardsBackground.infos';
import { selectionableColors } from '../shared/design/buttons/change-background-buttons/change-background-buttons.component';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
  animations: [
    trigger('rotateBoussole', [
      state('rotate', style({
        transform: 'rotate(1440deg)'
      })),
      state('normal', style({
        transform: '0'
      })),
      transition('* => rotate', [
        animate('5s ease-in-out')
      ]),
      transition('* => normal', [
        animate('1s ease')
      ])
    ]),

  ]
})
export class FirstPageComponent {
  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected loginButtonColorInfos: ButtonInfos = loginButtonColorInfosFirstPageComponent;
  protected registerButtonColorInfos: ButtonInfos = registerButtonColorInfosFirstPageComponent;
  protected iconsInfos: ButtonInfos = iconsFirstPageComponent;
  protected iconsCardsFirstPrincipesInfos: ButtonInfos = iconsCardsFirstPrincipesInfos;
  protected iconsCardsSecondPrincipesInfos: ButtonInfos = iconsCardsSecondPrincipesInfos;
  protected iconsCardsThirdPrincipesInfos: ButtonInfos = iconsCardsThirdPrincipesInfos;
  protected bottomBarIconsInfos: ButtonInfos = bottomBarIconsFirstPageComponent;
/*  Css  */
  @HostBinding('style.--logoColor') logoColor: string = "var(--black)";
  @HostBinding('style.--roundBackgroundColor') roundBackgroundColor: string = "var(--mainColor)";
  @HostBinding('style.--centralRoundBackgroundColor') centralRoundBackgroundColor: string = "var(--successColor)";
  @HostBinding('style.--textColor') textColor: string = "var(--black)";
  protected secondComplementaryColor: string = "var(--secondColor)";
  protected complementaryColor: string = "var(--mainColor)";
  protected backgroundColor: ChangeBackgroundColorInfos = {
    color: "var(--white)",
    logoToShow: "mainColor",
  };
  
  protected logoImageSrc: string = "../../assets/logo/boussole.png";
/*  Icons  */
  protected arrowDownIcon: IconDefinition = faArrowDown;
  protected arrowUpIcon: IconDefinition = faArrowUp;
  protected barIcon: IconDefinition = faMartiniGlass;
  protected benefitsIcon: IconDefinition = faArrowTrendUp;
  protected burgerIcon: IconDefinition = faBurger;
  protected cityIcon: IconDefinition = faCity;
  protected filterIcon: IconDefinition = faFilter;
  protected infosIcon: IconDefinition = faCircleInfo;
  protected locationIcon: IconDefinition = faGears;
  protected metroIcon: IconDefinition = faTrain;
  protected presentationIcon: IconDefinition = faAddressCard;
  protected professionnalIcon: IconDefinition = faScrewdriverWrench;
  protected propertyIcon: IconDefinition = faAddressBook;
  protected signInIcon: IconDefinition = faRightToBracket;
  protected signUpIcon: IconDefinition = faUserPlus;
/*  Algos  */
  protected positionPresentationIcon: PositionIconFirstPage = new PositionIconFirstPage();
  protected positionLocationIcon: PositionIconFirstPage = new PositionIconFirstPage();
  protected positionBenefitsIcon: PositionIconFirstPage = new PositionIconFirstPage();
  protected infosCardsBackground: MovingRectangleBackground[] = CardsBackgroundInfos;

  protected styleLine: StyleLineFirstPage = new StyleLineFirstPage();
  protected firstSectionPosition:TopHeight = new TopHeight();
  protected secondSectionPosition:TopHeight = new TopHeight();
  protected presentationSectionPosition:TopHeight = new TopHeight();
  protected locationSectionPosition:TopHeight = new TopHeight();
  protected benefitsSectionPosition: TopHeight = new TopHeight();
/*  Infos affichage section avantages  */
  protected infosAffichagesSectionPrincipes: ColorsAndText[] = [
    {
      backgroundColor: "var(--mainColor)",
      color: "var(--black)", 
      texts: [
        "Ajoutez une adresse dans votre carnet et notez toutes les informations qui vous importent.",
        "Renseignement"
      ],
      iconInfos: this.iconsCardsFirstPrincipesInfos,
      icon: faPencil
    },
    {
      backgroundColor: "var(--secondColor)",
      color: "var(--black)", 
      texts: [
        "Nous trouvons les stations de transports à proximité de cette adresse.",
        "Analyse"
      ],
      iconInfos: this.iconsCardsSecondPrincipesInfos,
      icon: faSignsPost
    },
    {
      backgroundColor: "var(--black)",
      color: "var(--black)", 
      texts: [
        "Vous pouvez maintenant utiliser des filtres de localisations et d'informations dans votre carnet d'adresses.",
        "Choix"
      ],
      iconInfos: this.iconsCardsThirdPrincipesInfos,
      icon: faSignsPost
    }
  ];
/*  Infos affichage section avantages  */
  protected infosAffichagesSectionAvantage: IdValue[] = [
    {
      id: "share", 
      value: [
        "Partagez vos bonnes adresses à vos amis et profitez de ce qu'ils ont a vous offrir.",
        "Partage"
      ]
    },
    {
      id: "proximity", 
      value: [
        "Mettez la main sur votre futur repère près de votre station de métro.",
        "Proximité"
      ]
    },
    {
      id: "diversity", 
      value: [
        "Dénichez un restaurant, un bar, un cinéma ou même un plombier selon votre besoin.",
        "Diversité"
      ]
    },
    {
      id: "discovery", 
      value: [
        "Découvrez de nouveaux lieux grâce à nos recommandation en fonction de vos goûts.",
        "Découverte"
      ]
    },
    {
      id: "fast", 
      value: [
        "5 minutes maximum pour trouver.",
        "Rapidité"
      ]
    },
    {
      id: "efficient", 
      value: [
        "Trouvez n'importe quelle adresse en une seule recherche.",
        "Efficacité"
      ]
    },
  ];
/*  Animation  */
  protected rotateBoussoleState: string = "normal";
  protected beginInfiniteAnimationBoussole: boolean = false;
  protected paletteName: string;
  private allPageHeight: number;
  protected opacityLinks: boolean[] = [true,false,false];
  protected selectionableColors: ChangeBackgroundColorInfos[] = selectionableColors;
  
////////////////////////////////////////////  Initialisation  ////////////////////////////////////////////
  ngOnInit(): void{
    this.setStyleColor(1);
    this.themeService.getPalette().subscribe((palette: ColorPalette) => {
      this.paletteName = palette.name;
    });
  }
  ngAfterContentInit(): void {
    this.setScrollEvents();
    this.startLogoAnimation();
    if(document.getElementById('page')){
      this.allPageHeight = document.getElementById('page').clientHeight;
    }
    this.setColorInfosCardsBackground();
  }

  private setColorInfosCardsBackground() {
    this.infosCardsBackground.forEach((infos: MovingRectangleBackground) => {
      infos.color = this.getBackgroundColor(infos);
    });
  }

  private getBackgroundColor(infos: MovingRectangleBackground): string{
    if(infos.height < 50 || infos.width < 50)  return this.secondComplementaryColor;
    return this.complementaryColor;
  }
  
  protected changeBackgroundColor(color: ChangeBackgroundColorComponentInfos){
    this.backgroundColor = color.background;
    this.complementaryColor = color.complementaryColor;
    this.secondComplementaryColor = color.secondComplementaryColor;
    this.textColor = color.textColor;
    
    if(this.backgroundColor.color === 'var(--white)'){
      this.infosAffichagesSectionPrincipes[0].backgroundColor = 'var(--mainColor)';
      this.infosAffichagesSectionPrincipes[1].backgroundColor = 'var(--secondColor)';
      this.infosAffichagesSectionPrincipes[2].backgroundColor = 'var(--black)';
      this.setNavbarButtonsStyle('var(--white)');
    } else if(this.backgroundColor.color === 'var(--secondColor)'){
      this.infosAffichagesSectionPrincipes[0].backgroundColor = 'var(--mainColor)';
      this.infosAffichagesSectionPrincipes[1].backgroundColor = 'var(--white)';
      this.infosAffichagesSectionPrincipes[2].backgroundColor = 'var(--black)';
      this.setNavbarButtonsStyle('var(--secondColor)');
    } else if(this.backgroundColor.color === 'var(--mainColor)'){
      this.infosAffichagesSectionPrincipes[0].backgroundColor = 'var(--white)';
      this.infosAffichagesSectionPrincipes[1].backgroundColor = 'var(--secondColor)';
      this.infosAffichagesSectionPrincipes[2].backgroundColor = 'var(--black)';
      this.setNavbarButtonsStyle('var(--mainColor');
    } else if(this.backgroundColor.color === 'var(--black)'){
      this.infosAffichagesSectionPrincipes[0].backgroundColor = 'var(--mainColor)';
      this.infosAffichagesSectionPrincipes[1].backgroundColor = 'var(--secondColor)';
      this.infosAffichagesSectionPrincipes[2].backgroundColor = 'var(--white)';
      this.setNavbarButtonsStyle('var(--black)');
    }
    this.setColorInfosCardsBackground();
  }

  private setNavbarButtonsStyle(secondColor: string) {
    this.loginButtonColorInfos.color = this.textColor;
    this.loginButtonColorInfos.colorActive = secondColor;
    this.loginButtonColorInfos.backgroundColor = secondColor;
    this.loginButtonColorInfos.backgroundColorActive = this.textColor;
    this.loginButtonColorInfos.borderColor = this.textColor;
    this.loginButtonColorInfos.borderColorActive = this.textColor;

    let textColorRegister: string = this.textColor;
    if(secondColor === "var(--black)"){
      textColorRegister = "var(--black)";
    }  
    this.registerButtonColorInfos.color = textColorRegister;
    this.registerButtonColorInfos.colorActive = this.complementaryColor;
    this.registerButtonColorInfos.backgroundColor = this.complementaryColor;
    this.registerButtonColorInfos.backgroundColorActive = textColorRegister;
    this.registerButtonColorInfos.borderColor = this.complementaryColor;
    this.registerButtonColorInfos.borderColorActive = this.complementaryColor;
    if(secondColor === 'var(--white)'){
      this.registerButtonColorInfos.color = 'var(--white)';
      this.registerButtonColorInfos.backgroundColorActive = 'var(--white)';
    }
    this.registerButtonColorInfos = JSON.parse(JSON.stringify(this.registerButtonColorInfos));
    this.loginButtonColorInfos = JSON.parse(JSON.stringify(this.loginButtonColorInfos));
  }

  protected navigate(page: string) : void{
    this.router.navigate(['login', page]);
    sessionStorage.setItem("lastPage","/firstPage");
  }
  

  private moveCardsBackground(scrollPosition: number): void{
    const coeff: number = (scrollPosition)/this.allPageHeight;

    this.infosCardsBackground.forEach((infos: MovingRectangleBackground) => {
      if(infos.movingSide){
        infos.left = infos.originalLeft + (infos.movingSpeed * coeff);
      } else{
        infos.top = infos.originalTop + (infos.movingSpeed * coeff);
      }
    });
  }
  private moveIcon(scrollPosition: number) : void{
    this.getEachSectionPosition();
    this.setSectionsAnimationByScrollPosition();
    this.setColorByScrollPosition(scrollPosition);
  }

  private getEachSectionPosition() {
    this.getFirstSectionPosition();
    this.getAboutSectionPosition();
    this.getPresentationSectionPosition();
    this.getPrincipesSectionPosition();
    this.getBenefitsSectionPosition();
  }

  private setSectionsAnimationByScrollPosition() {
    this.setObjectifAnimation();
    this.setPrincipeAnimation();
    this.setBeneficesAnimation();
  }

  private setColorByScrollPosition(scrollPosition: number) {
    if (scrollPosition < window.innerHeight) {
      this.setStyleColor(1);
    } else if (this.benefitsSectionPosition.top > 50) {
      this.setStyleColor(3);
    } else if (this.benefitsSectionPosition.top <= 50) {
      this.setStyleColor(2);
    }
  }

  protected goToDiv(divName: string){
    if (document!.getElementById(divName) != null) {
      const scrollTop = document!.getElementById(divName).offsetTop;
      window.scrollTo({behavior: "smooth",top: scrollTop});
    }
  }

  private setBeneficesAnimation() {
    if (this.benefitsSectionPosition.top > 0 && this.benefitsSectionPosition.top < this.benefitsSectionPosition.height) {
      if (40 - 100 * (this.benefitsSectionPosition.top / this.benefitsSectionPosition.height) < 30) this.positionBenefitsIcon.paddingIcon = 40 - 100 * (this.benefitsSectionPosition.top / this.benefitsSectionPosition.height);
      this.positionBenefitsIcon.scaleShadow = 1 - 0.4 * (this.benefitsSectionPosition.top / this.benefitsSectionPosition.height);
      if (this.positionBenefitsIcon.paddingIcon > -35) this.positionBenefitsIcon.titleOpacity = true;
      else this.positionBenefitsIcon.titleOpacity = false;
      if (this.positionBenefitsIcon.paddingIcon > -15) this.positionBenefitsIcon.textOpacity = true;
      else this.positionBenefitsIcon.textOpacity = false;
    }
  }
  private setPrincipeAnimation() {
    if (this.locationSectionPosition.top > 0 && this.locationSectionPosition.top < this.locationSectionPosition.height) {
      if (40 - 100 * (this.locationSectionPosition.top / this.locationSectionPosition.height) < 30) this.positionLocationIcon.paddingIcon = 40 - 100 * (this.locationSectionPosition.top / this.locationSectionPosition.height);
      this.positionLocationIcon.scaleShadow = 1 - 0.4 * (this.locationSectionPosition.top / this.locationSectionPosition.height);
      if (this.positionLocationIcon.paddingIcon > -35) this.positionLocationIcon.titleOpacity = true;
      else this.positionLocationIcon.titleOpacity = false;
      if (this.positionLocationIcon.paddingIcon > -15) this.positionLocationIcon.textOpacity = true;
      else this.positionLocationIcon.textOpacity = false;
    }
  }
  private setObjectifAnimation() {
    if (this.presentationSectionPosition.top > 0 && this.presentationSectionPosition.top < this.presentationSectionPosition.height) {
      if (40 - 100 * (this.presentationSectionPosition.top / this.presentationSectionPosition.height) < 15) this.positionPresentationIcon.paddingIcon = 40 - 100 * (this.presentationSectionPosition.top / this.presentationSectionPosition.height);
      this.positionPresentationIcon.scaleShadow = 1 - 0.4 * (this.presentationSectionPosition.top / this.presentationSectionPosition.height);
      if (this.positionPresentationIcon.paddingIcon > -35) this.positionPresentationIcon.titleOpacity = true;
      else this.positionPresentationIcon.titleOpacity = false;
      if (this.positionPresentationIcon.paddingIcon > -15) this.positionPresentationIcon.textOpacity = true;
      else this.positionPresentationIcon.textOpacity = false;
    }
  }


  

  private getBenefitsSectionPosition() {
    if (document!.getElementById("benefits") != null) {
      this.benefitsSectionPosition = {
        top: document!.getElementById("benefits").getBoundingClientRect().top,
        height: document!.getElementById("benefits").getBoundingClientRect().height
      };
    }
  }
  private getPrincipesSectionPosition() {
    if (document!.getElementById("principes") != null) {
      this.locationSectionPosition = {
        top: document!.getElementById("principes").getBoundingClientRect().top,
        height: window.innerHeight
      };
    }
  }
  private getPresentationSectionPosition() {
    if (document!.getElementById("presentation") != null) {
      this.presentationSectionPosition = {
        top: document!.getElementById("presentation").getBoundingClientRect().top,
        height: window.innerHeight
      };
    }
  }
  private getAboutSectionPosition() {
    if (document!.getElementById("about") != null) {
      this.secondSectionPosition = {
        top: document!.getElementById("about").getBoundingClientRect().top + document.getElementById("about").getBoundingClientRect().height,
        height: document!.getElementById("about").getBoundingClientRect().height
      };
    }
  }
  private getFirstSectionPosition() {
    if (document.getElementById("first") != null) {
      this.firstSectionPosition = {
        top: (document.getElementById("first").getBoundingClientRect().top + document.getElementById("first").getBoundingClientRect().height) * 0.6,
        height: document.getElementById("first").getBoundingClientRect().height * 0.6
      };
    }
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

  private setLinksOpacity(){
    const sizeOfVisible: number = window.innerHeight / 2;
    if (document!.getElementById("firstLink") != null) {
      let firstLinkElementTop = document!.getElementById("firstLink").getBoundingClientRect().top 
      + document.getElementById("firstLink").getBoundingClientRect().height;
      if(firstLinkElementTop > sizeOfVisible){
        this.opacityLinks[0] = true;
      } else{
        this.opacityLinks[0] = false;
      }
    } else{
      this.opacityLinks[0] = true
    }
    
    if (document!.getElementById("secondLink") != null) {
      let secondLinkElementTop = document!.getElementById("secondLink").getBoundingClientRect().top
       + document.getElementById("secondLink").getBoundingClientRect().height;
      if(secondLinkElementTop < sizeOfVisible){
        this.opacityLinks[1] = true;
      } else{
        this.opacityLinks[1] = false;
      }
    } else{
      this.opacityLinks[1] = true
    }

    if (document!.getElementById("thirdLink") != null) {
      let thirdLinkElementTop = document!.getElementById("thirdLink").getBoundingClientRect().top
       + document.getElementById("thirdLink").getBoundingClientRect().height;
      if(thirdLinkElementTop < sizeOfVisible){
        this.opacityLinks[2] = true;
      } else{
        this.opacityLinks[2] = false;
      }
    } else{
      this.opacityLinks[2] = true
    }

  }

  private startLogoAnimation() {
    this.rotateBoussoleState = "rotate";
    setTimeout(() => {
      this.beginInfiniteAnimationBoussole = true;
    }, 5000);
  }
  private setScrollEvents() {
    window.addEventListener("wheel", () => {
      this.moveIcon(window.scrollY);
      this.moveCardsBackground(window.scrollY);
      this.setLinksOpacity();
    });
    window.addEventListener("scroll", () => {
      this.moveIcon(window.scrollY);
      this.moveCardsBackground(window.scrollY);
      this.setLinksOpacity();
    });
  }

}



