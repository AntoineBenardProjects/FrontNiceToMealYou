import { Component, HostBinding } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';
import { AutocompleteInfos, InputInfos, SelectData } from '../shared/model/designs';
import { Follow, User } from '../shared/model/table/user';
import { autocompleteInfosFilter, searchInputFilter } from '../shared/model/design/inputsDesign';
import { UserCardParams } from '../shared/model/params/cardParams';
import { Position } from '../add/add.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent {

  constructor(private databaseService: DatabaseService, private placesService: PlacesService, private router: Router){}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Infos style  */
  protected searchInputInfos: InputInfos = searchInputFilter;
  protected autocompleteInfos: AutocompleteInfos = autocompleteInfosFilter;
/*  Css  */
  @HostBinding("style.--navbarTextColor") navbarTextColor: string = 'var(--black)';
  protected topSuggestion: number = 100;
  protected rightFriends: number = 100;
  protected opacityNavbar: number = 1;
  protected positionBody: string = "fixed";
  protected translateLinks: number[] = [100,100,100,100];
/*  Selects  */
  protected autocompleteLogins: SelectData[] = [];
/*  Algos  */
  protected searchLogin: string = "";
  protected searchedCardParams: UserCardParams;
  protected suggestedCardsParams: UserCardParams[] = [];
  protected requestCardsParams: UserCardParams[] = [];
  protected friendsCardsParams: UserCardParams[] = [];
  protected logoImageSrc: string = "../../assets/logo/black_logo.png";
  private scroll: number = 0;
  private stopScrolling: boolean = false;
  private device: string = sessionStorage.getItem("device");

  private ngOnInit(): void{
    this.databaseService.getAllUsersLogin().subscribe((logins: User[]) => {
      logins.forEach((user: User) => {
        if(user.id !== localStorage.getItem("id")){
          this.autocompleteLogins.push({
            id: user.id,
            name: user.login
          });
          this.suggestedCardsParams.push({
            id: user.id,
            width: this.device === 'desktop' ? 30 : 80,
            height: 30,
            accessToCard: true
          });
        } 
      });
    });
    this.databaseService.getFriends(localStorage.getItem("id")).subscribe((ids: string[]) => {
      ids.forEach((id: string) => {
        this.friendsCardsParams.push({
          id: id,
          width: this.device === 'desktop' ? 30 : 80,
          height: 30,
          accessToCard: true
        });
      });
    });
    this.databaseService.getRequestsOfRelation(localStorage.getItem("id")).subscribe((ids: Follow[]) => {
      ids.forEach((id: Follow) => {
        this.requestCardsParams.push({
          id: id.id_user,
          width: this.device === 'desktop' ? 30 : 80,
          height: 30,
          accessToCard: true
        });
      });
    });
  }
  private ngAfterViewInit(): void{
    this.setStartingAnimation();
    
    window.addEventListener("wheel", (event) => {
      this.setScroll(event);
    });    
    window.addEventListener("scroll", (event) => {
      this.setScroll(event);
    });
  }
  protected setValue(event: any): void{
    this.searchLogin = event.target.value;
  }
  protected searchUser(id: any): void{
    if(this.searchedCardParams != null && id !== this.searchedCardParams.id){
      this.searchedCardParams = null;
      setTimeout(() => {
        this.searchedCardParams = {
          id: id,
          width: this.device === 'desktop' ? 30 : 80,
          height: 30,
          accessToCard: true
        }
      }, 700);
    } else if(this.searchedCardParams == null){
      this.searchedCardParams = {
        id: id,
        width: this.device === 'desktop' ? 30 : 80,
        height: 30,
        accessToCard: true
      }
    }
  }
  protected modifyRelation(id: string): void{
    this.suggestedCardsParams = [];
    this.requestCardsParams = [];
    this.databaseService.getAllUsersLogin().subscribe((logins: User[]) => {
      logins.forEach((user: User) => {
        if(user.id !== localStorage.getItem("id")){
          this.suggestedCardsParams.push({
            id: user.id,
            width: this.device === 'desktop' ? 30 : 80,
            height: 30,
            accessToCard: true
          });
        } 
      });
    });
    this.databaseService.getRequestsOfRelation(localStorage.getItem("id")).subscribe((ids: Follow[]) => {
      ids.forEach((id: Follow) => {
        this.requestCardsParams.push({
          id: id.id_user,
          width: this.device === 'desktop' ? 30 : 80,
          height: 30,
          accessToCard: true
        });
      });
    });  
  }
  private setScroll(event: any): void{
    if(event.wheelDelta < 0 && !this.stopScrolling) this.scroll++;
    if(event.wheelDelta > 0 && this.scroll > 0) this.scroll--;
    const topSuggestionMaxScroll: number = 100 - (this.scroll*3);
    topSuggestionMaxScroll < 0 ? this.topSuggestion = 0 : this.topSuggestion = topSuggestionMaxScroll;
    
    const startStoppingNavbarOpacity: number = 20;
    const speedNavbarOpacityChanging: number = 10;
    if(this.scroll >= startStoppingNavbarOpacity){
      this.opacityNavbar = 1 - (this.scroll - startStoppingNavbarOpacity)/speedNavbarOpacityChanging;
    }

    const startNormalScrolling: number = 34;
    this.scroll >= startNormalScrolling ? this.positionBody = "relative" : this.positionBody = "fixed";
    
    const scrollTopSuggestionElement: number = document.getElementById("allCards")?.getBoundingClientRect().top;
    scrollTopSuggestionElement <= 0 ?  this.positionBody = "relative" : this.positionBody = "fixed";
    scrollTopSuggestionElement <= 0 ?  this.scroll = startNormalScrolling : this.scroll = this.scroll;

  }
  private setStartingAnimation(): void{
    setTimeout(() => {
      this.translateLinks[0] = 0;
      setTimeout(() => {
        this.translateLinks[1] = 0;
        setTimeout(() => {
          this.translateLinks[2] = 0;
          setTimeout(() => {
            this.translateLinks[3] = 0;
          },200);
        },200);
      },200);
    },100);
  }
  protected navigate(url: string): void{
    this.router.navigate([url]);
  }
  private ngOnDestroy(): void{
    window.removeAllListeners("wheel");    
    window.removeAllListeners("scroll");    
  }
}
