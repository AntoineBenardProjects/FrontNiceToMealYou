import { Component } from '@angular/core';
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
/*  Selects  */
  protected autocompleteLogins: SelectData[] = [];
/*  Algos  */
  protected searchLogin: string = "";
  protected searchedCardParams: UserCardParams;
  protected suggestedCardsParams: UserCardParams[] = [];
  protected requestCardsParams: UserCardParams[] = [];
  protected titlePosition: number = -20;
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";

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
            width: 80,
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
          width: 80,
          height: 30,
          accessToCard: true
        });
      });
    });
  }
  private ngAfterViewInit(): void{
    window.addEventListener("wheel", () => {
      this.setTitlePosition(window.scrollY);
    });    
    window.addEventListener("scroll", () => {
      this.setTitlePosition(window.scrollY);
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
          width: 80,
          height: 30,
          accessToCard: true
        }
      }, 300);
    } else if(this.searchedCardParams == null){
      this.searchedCardParams = {
        id: id,
        width: 80,
        height: 30,
        accessToCard: true
      }
    }
  }
  private setTitlePosition(scrollPosition: number){
    if(document.getElementById("suggestion")!=null){
      const titlePositionEnd:number = document.getElementById("suggestion").getBoundingClientRect().height/5;    
      this.titlePosition = -20 - 5 * (scrollPosition/titlePositionEnd);  
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
            width: 80,
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
          width: 80,
          height: 30,
          accessToCard: true
        });
      });
    });  
  }

  protected navigate(url: string): void{
    this.router.navigate([url]);
  }
}
