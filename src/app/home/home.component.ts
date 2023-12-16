import { Component } from '@angular/core';
import { ButtonInfos, LinkCardInfos } from '../shared/model/designs';
import { Router } from '@angular/router';
import { iconsCarouselInfosHomeComponent, iconsCategoryInfosHomeComponent, myPlacesButtonInfosHomeComponent, myPlacesButtonInfosHomeComponent2 } from '../shared/model/design/buttonsDesign';
import { DatabaseService } from '../services/database.service';
import { PlaceCardParams } from '../shared/model/params/cardParams';
import { IconDefinition, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../shared/model/params/message';
import { Counter } from '../shared/model/table/user';
import { categories } from '../shared/data';
import { PlacesService } from '../services/places.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private placesService: PlacesService
  ) {}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected myPlacesButtonInfos: ButtonInfos = myPlacesButtonInfosHomeComponent;
  protected iconsCarouselInfos: ButtonInfos = iconsCarouselInfosHomeComponent;
  protected iconsCategoryInfos: ButtonInfos = iconsCategoryInfosHomeComponent;

/*  Css/Icons  */
  protected backgroundColor: string = 'var(--black)';
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";
  protected leftIcon: IconDefinition = faCaretLeft;
  protected rightIcon: IconDefinition = faCaretRight;
  protected scaleTypes: number = 1;
  protected topSuggestions: number = 150;
  protected scroll: number = 0;
  private stopScrolling: boolean = false;
  protected styleTypes: StyleText[] = [
    {opacity: 1,top: 15, left: 10,text: "NiceTo",font:"'Arvo', sans-serif",color: "var(--white)"},
    {opacity: 1,bottom: 15, right: 10,text: "MealYou",font:"'Arvo', sans-serif",color: "var(--white)"},
  ];
  protected styleFirst: StyleText[] = [
    {opacity: 0,top: 10, left: 10,text: "NiceTo",font:"'Poppins', sans-serif",color: "var(--white)",backgroundImage:"url('../../assets/common/map.jpg')"},
    {opacity: 0,bottom: 10, right: 10,text: "MealYou",font:"'Poppins', sans-serif",color: "var(--white)",backgroundImage:"url('../../assets/common/map.jpg')"},
  ];
  protected opacityCards: number[] = [0,0,0,0,0];
  protected opacityNavbar: number = 1;
  protected transformLinks: number[] = [0,0,0,0];
  protected typesOpacity: number = 1;
  protected textTransitionDuration: number = .3;

/*  Algo  */
  protected isAdmin: boolean = false;
  protected linkCardInfos: LinkCardInfos = {
    color: 'var(--white)',
    colorActive: 'var(--black)',
    textColorActive: 'var(--white)',
    borderColor: 'var(--white)',
    selectedBorderColor: 'var(--white)'
  }
  protected stationsPlacesCards: PlaceCardParams[] = [];
  protected showSuggestion: boolean = false;
  protected loadingValue: number = 0;
  protected counterSuggestion: number = 0;
  protected favoritesStations: SuggestionShow[] = [];

  protected init(): void{
    this.showSuggestion = true;
    if(this.scroll === 0) this.animateStart();
  }
  protected navigate(url: string, opacity?: number) : void{
    let valid: number = 1;
    if(opacity != null) valid = opacity;
    this.router.navigate([url]);
    sessionStorage.setItem("lastPage","/home");
  }
  protected closeCard(id: string): void{
    this.stationsPlacesCards = this.stationsPlacesCards.filter((params: PlaceCardParams) => {
      if(params.place.id === id)  return false;
      return true;
    });
  }
  protected moveCarousel(direction: string, carousel: string): void{
    const move: number = sessionStorage.getItem("device") !== 'desktop' ? 420 : 550;
    let find: SuggestionShow = this.favoritesStations.find((element: SuggestionShow) => element.name_station === carousel);
    if(direction === 'left' && find.transform !== 0){
      find.transform += move;
    } else if(direction === 'right' && find.transform !== -(find.cards.length-1) * move){
      find.transform -= move;
    }
  }
  protected addPlace(id: string): void{
    this.databaseService.addPlaceOfUser({idPlace: id, idUser: localStorage.getItem("id")}).subscribe((message: Message) => {
      console.log(message);
    });
  }
  private setBackground(event: any): void {
    if(event.wheelDelta < 0 && !this.stopScrolling) this.scroll++;
    if(event.wheelDelta > 0 && this.scroll > 0) this.scroll--;
    const scaleSpeed: number = 30;
    const minScale: number = .4
    const scale: number = 1 - this.scroll/scaleSpeed;
    scale >= minScale ? this.scaleTypes = scale : this.scaleTypes = minScale;
    this.styleTypes.forEach((style: StyleText, index: number) => {
      const textSpeed: number = 10;
      const opacity: number = 1 - this.scroll/textSpeed;
      style.opacity = opacity;
      if(style.left != null)  style.left = opacity*10;
      if(style.right != null)   style.right = opacity*10;
    });
    const textFirstAppear: number = 13;
    const opacityTextSpeed: number = 3;
    const positionTextSpeed: number = .5;
    const cardsAppear: number[] = [23,28,33,38,43,48];
    if(this.scroll > cardsAppear[0]) this.scaleTypes = 0;
    this.styleFirst.forEach((style: StyleText, index: number) => {
      if(index === 0 || index === 1){
        style.opacity = (this.scroll - textFirstAppear)/opacityTextSpeed - 1;
        if(this.scroll >= textFirstAppear && this.scroll < 260){
          if(style.left != null)  style.left = (this.scroll - textFirstAppear)/positionTextSpeed;
          if(style.right != null)  style.right = (this.scroll - textFirstAppear)/positionTextSpeed;  
        }
        if(this.scroll >= textFirstAppear && this.scroll < cardsAppear[0]){
          style.color = "var(--white)";
          this.opacityCards = [0,0,0,0,0];
        }
        else if(this.scroll >= cardsAppear[0] && this.scroll < cardsAppear[1]){
          this.opacityCards = [1,0,0,0,0];
          style.backgroundImage = "url('../../assets/common/map.jpg')";
          style.color = "transparent";
        }
        else if(this.scroll >= cardsAppear[1] && this.scroll < cardsAppear[2]){
          this.opacityCards = [0,1,0,0,0];
          style.backgroundImage = "url('../../assets/common/add.jpg')";
          style.color = "transparent";
        }
        else if(this.scroll >= cardsAppear[2] && this.scroll < cardsAppear[3]){
          this.opacityCards = [0,0,1,0,0];
          style.backgroundImage = "url('../../assets/common/help.jpg')";
          style.color = "transparent";
        }
        else if(this.scroll >= cardsAppear[3] && this.scroll <= cardsAppear[4]){
          this.opacityCards = [0,0,0,1,0];
          style.backgroundImage = "url('../../assets/common/profile.jpg')";
          style.color = "transparent";
        }
        else if(this.scroll >= cardsAppear[4] && this.scroll <= cardsAppear[5]){
          this.opacityCards = [0,0,0,0,1];
          this.isAdmin ? style.backgroundImage = "url('../../assets/common/admin.jpg')" : style.backgroundImage = "url('../../assets/common/about.jpg')"
          style.color = "transparent";
        }
        else{
          this.opacityCards = [0,0,0,0,0];
        }
        if(this.scroll > cardsAppear[5]){
          style.color = "transparent";
          this.isAdmin ? style.backgroundImage = "url('../../assets/common/admin.jpg')" : style.backgroundImage = "url('../../assets/common/about.jpg')"
          style.opacity = 50 - (this.scroll - cardsAppear[5])/50;
          this.opacityNavbar = 1 - (this.scroll - cardsAppear[5])/10;
        }
        else{
          this.opacityNavbar = 1;
        }
      }
    });

    const maxScroll: number = cardsAppear[5];
    const verifyPosition: number = this.scroll - maxScroll;
    if(this.scroll >= maxScroll){
      const topSuggestionSpeed: number = 7;
      const top: number = 100 - verifyPosition*topSuggestionSpeed;
      top >= 0 ? this.topSuggestions = top : this.topSuggestions = 0;
    }
    this.scroll === cardsAppear[5] && (this.favoritesStations[0] == null || this.favoritesStations[0].cards.length === 0) ? this.stopScrolling = true : this.stopScrolling = false;
    this.scroll === this.setFavoritesStationParams() ? this.stopScrolling = true : this.stopScrolling = false;    
    sessionStorage.setItem("scroll",this.scroll.toString());
  }
  private setFavoritesStationParams(): number{
    const start: number = 62;
    const offsetScroll: number = 10;
    const coeffScroll: number = 28;
    this.favoritesStations.forEach((suggestion: SuggestionShow,index: number) => {
      if(this.scroll >= start + (index)*coeffScroll && this.scroll <= start + offsetScroll + (index)*coeffScroll){
        const value: number = (this.scroll - (start + (index)*coeffScroll))/offsetScroll
        suggestion.titlePosition = 20 - 20*value + 2;  
        suggestion.titleOpacity = value;
        suggestion.categories.forEach((category: Counter) => {
          category.percent = 0;
        });
        suggestion.elementOpacity = 1;
      } else if(this.scroll >= start + 2*offsetScroll + (index)*coeffScroll && this.scroll <= start + 3*offsetScroll + (index)*coeffScroll){
        const value: number = (this.scroll - (start + 2*offsetScroll + (index)*coeffScroll))/offsetScroll;
        suggestion.titlePosition = 20 * value + 2;  
        suggestion.titleOpacity = 1 - value;
        suggestion.categories.forEach((category: Counter) => {
          category.percent = 0;
        });
        suggestion.elementOpacity = 1;
        if(this.scroll === start + 3*offsetScroll + (index)*coeffScroll){
          suggestion.elementOpacity = 0;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 40;
          });
        }
      } else if(this.scroll < start + (index)*coeffScroll){
        suggestion.titlePosition = 20;  
        suggestion.titleOpacity = 0;
        suggestion.categories.forEach((category: Counter) => {
          category.percent = 40;
        });
        suggestion.elementOpacity = 0;
      }
    });
    return start + offsetScroll + (this.favoritesStations.length - 1)*coeffScroll;
  }
  private animateStart(): void{
    this.typesOpacity = 0;
    this.transformLinks = [100,100,100,100];
    this.textTransitionDuration = 2;
    this.styleTypes.forEach((style: StyleText, index: number) => {;
      style.opacity = 0;
      if(style.left != null)  style.left = -10;
      if(style.right != null)   style.right = -10;
    });
    setTimeout(() => {
      this.textTransitionDuration = .3;
    }, 2000);
    setTimeout(() => {
      this.styleTypes.forEach((style: StyleText, index: number) => {;
        style.opacity = 1;
        if(style.left != null)  style.left = 10;
        if(style.right != null)   style.right = 10;
      });
      this.transformLinks[0] = 0;
      this.typesOpacity = 1;
      setTimeout(() => {
        this.transformLinks[1] = 0;
        setTimeout(() => {
          this.transformLinks[2] = 0;
          setTimeout(() => {
            this.transformLinks[3] = 0;
          }, 100);
        }, 100);
      }, 100);
    }, 500);
  }
  private ngOnInit(): void{
    this.databaseService.isAdmin(localStorage.getItem("id")).subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
      this.setBackground(this.scroll);
    });
    if(sessionStorage.getItem("scroll") != null)  this.scroll = Number(sessionStorage.getItem("scroll"));
    this.databaseService.getPlacesSuggestionsOfUser(localStorage.getItem('id')).subscribe((stationsOfUser: any) => {
      const favoritesStationsName = Array.from(new Set(stationsOfUser.near_stations.map((item) => item.name_station)));
      favoritesStationsName.forEach((name: string,index) => {        
        this.favoritesStations.push({
          name_station: name,
          cards: [],
          transform: 0,
          titlePosition: 10,
          titleOpacity: 0,
          elementOpacity: 0,
          categories: []
        });
      });
      let counter: number = 0;
      if(this.favoritesStations.length > 0){
        stationsOfUser.near_stations.forEach((infos: any) => {
          this.databaseService.getPlaceInfos(infos.id_place,null).subscribe((infosPlaces: PlaceCardParams) => {
            let find: SuggestionShow = this.favoritesStations.find((suggestion: SuggestionShow) => suggestion.name_station === infos.name_station); 
            find.cards.push(infosPlaces);
            counter++;
            this.loadingValue = counter/stationsOfUser.near_stations.length * 100;
            if(counter === stationsOfUser.near_stations.length){
              this.favoritesStations.forEach((suggestion: SuggestionShow) => {
                categories.forEach((category: string) => {
                  const counter: number = suggestion.cards.filter((element: PlaceCardParams) => element.place.category === category).length
                  if(counter > 0) suggestion.categories.push({
                    value: category.toLocaleLowerCase(),
                    counter: counter,
                    icon: this.placesService.getIconOfCategory(category),
                    percent: 40
                  });
                });
              });
              let scrollPosition: number = this.scroll/40 - 2;  
              if(scrollPosition >= 360){
                this.setFavoritesStationParams();
              }
            }
          });
        });
      } else{
        this.loadingValue = 50;
        setTimeout(() => {
          this.loadingValue = 100;
        }, 1000);
      }
      
    });
  }
  private ngAfterContentInit(): void {
    window.addEventListener("wheel", (event:Event) => {
      if(this.showSuggestion) this.setBackground(event);
    });    
    window.addEventListener("scroll", (event:Event) => {
      if(this.showSuggestion) this.setBackground(event);
    });
  }
  private ngOnDestroy(): void{
    window.removeAllListeners("wheel");    
    window.removeAllListeners("scroll");    
  }
}
interface StyleText{
  opacity: number,
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
  text: string,
  backgroundImage?: string,
  color: string
  font: string
}
interface SuggestionShow{
  name_station: string,
  cards: PlaceCardParams[],
  transform: number,
  titlePosition: number,
  titleOpacity: number,
  elementOpacity: number,
  categories: Counter[]
}
