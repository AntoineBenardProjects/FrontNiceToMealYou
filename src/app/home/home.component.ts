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
  protected overflow: string = "hidden";
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

  protected navigate(url: string, opacity?: number) : void{
    let valid: number = 1;
    if(opacity != null) valid = opacity;
    if(url === 'about'){
      const aboutElement: HTMLElement = document.getElementById("about");
      window.scrollTo({
        top: aboutElement.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    } else if(valid === 1){
      this.router.navigate([url]);
      sessionStorage.setItem("lastPage","/home");
    }
  }
  protected closeCard(id: string): void{
    this.stationsPlacesCards = this.stationsPlacesCards.filter((params: PlaceCardParams) => {
      if(params.place.id === id)  return false;
      return true;
    });
  }
  protected moveCarousel(direction: string, carousel: string): void{
    let find: SuggestionShow = this.favoritesStations.find((element: SuggestionShow) => element.name_station === carousel);
    if(direction === 'left' && find.transform !== 0){
      find.transform += 550;
    } else if(direction === 'right' && find.transform !== -(find.cards.length-1) * 550){
      find.transform -= 550;
    }
  }
  protected addPlace(id: string): void{
    this.databaseService.addPlaceOfUser({idPlace: id, idUser: localStorage.getItem("id")}).subscribe((message: Message) => {
      console.log(message);
    });
  }
  private setBackground(event: any): void {
    if(event.wheelDelta < 0 && !this.stopScrolling) this.scroll += 10;
    if(event.wheelDelta > 0 && this.scroll > 9) this.scroll -= 10;
    let verifyPosition: number = 0;
    510 - this.scroll > 0 ? verifyPosition = 510 - this.scroll : verifyPosition = 0;
    let scrollPosition: number = this.scroll/40 - 2;  
    if(this.isAdmin)  scrollPosition === 8.25 && (this.favoritesStations[0] == null || this.favoritesStations[0].cards.length === 0) ? this.stopScrolling = true : this.stopScrolling = false;
    else  scrollPosition === 6.75 && (this.favoritesStations[0] == null || this.favoritesStations[0].cards.length === 0) ? this.stopScrolling = true : this.stopScrolling = false;
    if(scrollPosition >= 9){
      scrollPosition === 12.5 + (this.favoritesStations.length - 1)*4.5 ? this.stopScrolling = true : this.stopScrolling = false;
      this.favoritesStations.forEach((suggestion: SuggestionShow,index: number) => {
        if(scrollPosition === 11 + (index)*4.5){
          suggestion.titlePosition = 8;  
          suggestion.titleOpacity = .5;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0.3;
          });
        } else if(scrollPosition === 11.25 + (index)*4.5){
          suggestion.titlePosition = 4;  
          suggestion.titleOpacity = .8;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0.8;
          });
        } else if(scrollPosition === 11.5 + (index)*4.5){
          suggestion.titlePosition = 2;  
          suggestion.titleOpacity = 1;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 1;
          });
        }else if(scrollPosition === 14.25 + (index)*4.5){
          suggestion.titlePosition = 2;  
          suggestion.titleOpacity = 1;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 1;
          });
        } else if(scrollPosition === 14.5 + (index)*4.5){
          suggestion.titlePosition = 4;  
          suggestion.titleOpacity = .8;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0.8;
          });
        } else if(scrollPosition === 14.75 + (index)*4.5){
          suggestion.titlePosition = 8;  
          suggestion.titleOpacity = .5;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0.3;
          });
        } else if(scrollPosition === 15 + (index)*4.5){
          suggestion.titlePosition = 20;  
          suggestion.titleOpacity = 0;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0;
          });
        } else if(scrollPosition < 11 + (index)*4.5){
          suggestion.titlePosition = 20;  
          suggestion.titleOpacity = 0;
          suggestion.categories.forEach((category: Counter) => {
            category.percent = 0;
          });
        }
      });
    }
    const scale: number = 1 - this.scroll/100;
    scale >= 0 ? this.scaleTypes = 1 - this.scroll/100 : this.scaleTypes = 0;
    this.styleTypes.forEach((style: StyleText, index: number) => {
      if(index === 0 || index === 1){
        const opacity: number = 1 - this.scroll/40;
        opacity > 0 ? style.opacity = opacity : style.opacity = 0;
        if(style.left != null)  opacity > 0 ? style.left = opacity*10 : style.left = 0;
        if(style.right != null)  opacity > 0 ? style.right = opacity*10 : style.right = 0;
      }
    });
    this.styleFirst.forEach((style: StyleText, index: number) => {
      if(index === 0 || index === 1){
        const opacity: number = this.scroll/40 - 2;
        opacity > 0 ? style.opacity = opacity : style.opacity = 0;
        if(style.left != null)  opacity > 0 ? style.left = opacity*10 : style.left = 0;
        if(style.right != null)  opacity > 0 ? style.right = opacity*10 : style.right = 0;
        if(opacity >= 1 && opacity < 2.5){
          this.opacityCards = [1,0,0,0,0];
          style.backgroundImage = "url('../../assets/common/map.jpg')";
          style.color = "transparent";
        }
        else if(opacity > 2.5 && opacity < 4){
          this.opacityCards = [0,1,0,0,0];
          style.backgroundImage = "url('../../assets/common/add.jpg')";
          style.color = "transparent";
        }
        else if(opacity > 4 && opacity < 5.5){
          this.opacityCards = [0,0,1,0,0];
          style.backgroundImage = "url('../../assets/common/help.jpg')";
          style.color = "transparent";
        }
        else if(opacity > 5.5 && opacity < 7){
          this.opacityCards = [0,0,0,1,0];
          style.backgroundImage = "url('../../assets/common/profile.jpg')";
          style.color = "transparent";
        }
        else if(opacity > 7 && opacity < 8.5 && this.isAdmin){
          this.opacityCards = [0,0,0,0,1];
          style.backgroundImage = "url('../../assets/common/admin.jpg')";
          style.color = "transparent";
        }
        else{
          this.opacityCards = [0,0,0,0,0];
        }
        if(opacity > 9){
          style.color = "transparent";
          style.backgroundImage = "url('../../assets/common/profile.jpg')";
          style.opacity = 10 - opacity;
          this.opacityNavbar = 10 - opacity;
        } else{
          this.opacityNavbar = 1;
        }
      }
    });
    const maxScroll: number = this.isAdmin ? 7 : 8;
    if(scrollPosition > maxScroll){
      verifyPosition > 0 ? this.topSuggestions = verifyPosition : this.topSuggestions = 0;
      verifyPosition > 0 ? this.overflow = "hidden" : this.overflow = "auto";
    }
    sessionStorage.setItem("scroll",this.scroll.toString());
  }
  private ngOnInit(): void{
    if(localStorage.getItem("role") === "Admin")  this.isAdmin = true;
    if(sessionStorage.getItem("scroll") != null)  this.scroll = Number(sessionStorage.getItem("scroll"));
    this.setBackground(this.scroll);
    this.databaseService.getPlacesSuggestionsOfUser(localStorage.getItem('id')).subscribe((stationsOfUser: any) => {
      const favoritesStationsName = Array.from(new Set(stationsOfUser.near_stations.map((item) => item.name_station)));
      favoritesStationsName.forEach((name: string,index) => {        
        this.favoritesStations.push({
          name_station: name,
          cards: [],
          transform: 0,
          titlePosition: 10,
          titleOpacity: 0,
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
              this.showSuggestion = true;
              this.favoritesStations.forEach((suggestion: SuggestionShow) => {
                categories.forEach((category: string) => {
                  const counter: number = suggestion.cards.filter((element: PlaceCardParams) => element.place.category === category).length
                  if(counter > 0) suggestion.categories.push({
                    value: category.toLocaleLowerCase(),
                    counter: counter,
                    icon: this.placesService.getIconOfCategory(category),
                    percent: 0
                  });
                });
              });
              let scrollPosition: number = this.scroll/40 - 2;  
              if(scrollPosition >= 11){
                this.favoritesStations.forEach((suggestion: SuggestionShow,index: number) => {
                  if(scrollPosition === 11 + (index)*4.5){
                    suggestion.titlePosition = 8;  
                    suggestion.titleOpacity = .5;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0.3;
                    });
                  } else if(scrollPosition === 11.25 + (index)*4.5){
                    suggestion.titlePosition = 4;  
                    suggestion.titleOpacity = .8;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0.8;
                    });
                  } else if(scrollPosition === 11.5 + (index)*4.5){
                    suggestion.titlePosition = 2;  
                    suggestion.titleOpacity = 1;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 1;
                    });
                  }else if(scrollPosition === 14.25 + (index)*4.5){
                    suggestion.titlePosition = 2;  
                    suggestion.titleOpacity = 1;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 1;
                    });
                  } else if(scrollPosition === 14.5 + (index)*4.5){
                    suggestion.titlePosition = 4;  
                    suggestion.titleOpacity = .8;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0.8;
                    });
                  } else if(scrollPosition === 14.75 + (index)*4.5){
                    suggestion.titlePosition = 8;  
                    suggestion.titleOpacity = .5;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0.3;
                    });
                  } else if(scrollPosition === 15 + (index)*4.5){
                    suggestion.titlePosition = 20;  
                    suggestion.titleOpacity = 0;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0;
                    });
                  } else if(scrollPosition < 11 + (index)*4.5){
                    suggestion.titlePosition = 20;  
                    suggestion.titleOpacity = 0;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 0;
                    });
                  } else{
                    suggestion.titlePosition = 2;  
                    suggestion.titleOpacity = 1;
                    suggestion.categories.forEach((category: Counter) => {
                      category.percent = 1;
                    });
                  }
                });
              }
            }
          });
        });
      } else{
        this.loadingValue = 50;
        setTimeout(() => {
          this.showSuggestion = true;
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
  categories: Counter[]
}
