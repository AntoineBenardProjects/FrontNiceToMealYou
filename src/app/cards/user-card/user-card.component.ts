import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faAdd, faHeart, faHourglassStart, faMap, faPaperPlane, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatabaseService } from 'src/app/services/database.service';
import { PlacesService } from 'src/app/services/places.service';
import { addButtonInfosFollowComponent, categoryButtonUserCard, iconsAddUserCard, iconsFriendsUserCard, iconsUserCard } from 'src/app/shared/model/design/buttonsDesign';
import { ButtonInfos } from 'src/app/shared/model/designs';
import { UserCardParams } from 'src/app/shared/model/params/cardParams';
import { Message } from 'src/app/shared/model/params/message';
import { Counter, Follow } from 'src/app/shared/model/table/user';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {

  constructor(private databaseService: DatabaseService, private placesService: PlacesService, private router: Router){}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Metadata  */
  @Input() infos: UserCardParams;
  @Output() addRelation: EventEmitter<string> = new EventEmitter();
  @Output() acceptRelation: EventEmitter<string> = new EventEmitter();
/*  Css  */
  protected background = "";
  protected opacityPicture: number = 0;
  protected login: MovingText[] = [];
  protected scaleMap: number = 0;
  protected scaleRelation: number = 0;
  protected opacityBackground: number = 0;
/*  Style infos  */
  protected categoryButtonInfos: ButtonInfos = categoryButtonUserCard;
  protected addButtonInfos: ButtonInfos = addButtonInfosFollowComponent;
  protected iconMap: ButtonInfos = iconsUserCard;
  protected iconAdd: ButtonInfos = iconsAddUserCard;
  protected iconFriend: ButtonInfos = iconsFriendsUserCard;
/*  Icons  */
  protected userIcon: IconDefinition = faUser;
  protected mapIcon: IconDefinition = faMap;
  protected addIcon: IconDefinition = faAdd;
  protected askIcon: IconDefinition = faPaperPlane;
  protected waitIcon: IconDefinition = faHourglassStart;
  protected friendIcon: IconDefinition = faThumbsUp;
  protected categoriesIcon: CategoryIcon;
/*  Algos  */
  protected data: UserInfos;
  protected relation: string = "";
  protected idNumber: string = "";
  protected idPicture: string = "";
  protected idIcon: string = "";
  protected idText: string = "";
  protected idRelation: string = "";
  protected idCouv: string = "";
  protected idMap: string = "";
  protected stopAnimation: boolean[] = [false,false,false,false,false];
  protected counter: number = 0;
  

  private ngOnInit(): void{
    this.idNumber = this.placesService.setId();
    this.idPicture = this.placesService.setId();
    this.idIcon = this.placesService.setId();
    this.idText = this.placesService.setId();
    this.idRelation = this.placesService.setId();
    this.idMap = this.placesService.setId();
    this.idCouv = this.placesService.setId();

    this.databaseService.getUserInfo(this.infos.id).subscribe((infos: UserInfos) => {
      this.data = this.placesService.getCopyOfElement(infos);
      for(let i = 0; i < this.data.login.length; i++){
        this.login.push({
          text: this.data.login[i],
          translate: 30
        });
      }
      this.data.infos.sort((a: Counter, b: Counter) => {
        if(Number(a.counter) > Number(b.counter)) return -1;
        return 1;
      });
      this.data.infos[0] == null ? this.categoriesIcon = null : this.categoriesIcon = {
        category: this.data.infos[0].value,
        counter: this.data.infos[0].counter,
        icon: this.placesService.getIconOfCategory(this.data.infos[0].value)
      };
    });
    const follow: Follow = {
      id_user: this.infos.id,
      id_asked: localStorage.getItem("id"),
    }
    this.databaseService.getRelationBetweenUsers(follow).subscribe((relation: Message) => {
      this.relation = relation.message;
    });
  }
  private ngAfterViewInit(): void{
    setTimeout(() => {
      this.setNumberAnimation();
    }, 1000);
    this.setNumberAnimation();
    window.addEventListener("wheel", (event) => {
      this.setNumberAnimation();
    });    
    window.addEventListener("scroll", (event) => {
      this.setNumberAnimation();
    });
  }

  setNumberAnimation(){
    if(document.getElementById(this.idNumber) != null && !this.stopAnimation[0]){
      let position: number = 0;
      let element: HTMLElement = null;
      if(document.getElementById(this.idNumber) != null) element = document.getElementById(this.idNumber);
      if(element != null) position = element.getBoundingClientRect().top - element.getBoundingClientRect().height;
      if(window.innerHeight - position > 0){
        this.stopAnimation[0] = true;
        this.counter = 0;
        let interval = 500;
        let endValue: number = Number(this.categoriesIcon.counter);
        let duration: number = Math.floor(interval / endValue);
        let counter = setInterval(() => {
          this.counter += 1;
          if(this.counter === endValue) clearInterval(counter);
        }, duration);
      }
    }
    if((document.getElementById(this.idPicture) != null || document.getElementById(this.idIcon) != null) && !this.stopAnimation[1]){
      let position: number = 0;
      let element: HTMLElement = null;
      if(document.getElementById(this.idPicture) != null) element = document.getElementById(this.idPicture);
      else if(document.getElementById(this.idIcon) != null){
        element = document.getElementById(this.idIcon);      
      }
      if(element != null) position = element.getBoundingClientRect().top - element.getBoundingClientRect().height;
      if(window.innerHeight - position > 0){
        this.stopAnimation[1] = true;
        this.opacityPicture = 1;
      }
    }
    if(document.getElementById(this.idText) != null && !this.stopAnimation[2]){
      let position: number = 0;
      let element: HTMLElement = null;
      if(document.getElementById(this.idText) != null) element = document.getElementById(this.idText);
      if(element != null) position = element.getBoundingClientRect().top - element.getBoundingClientRect().height;
      if(window.innerHeight - position > 0){
        this.stopAnimation[2] = true;
        let startValue: number = 0;
        const length: number = this.login.length;
        let duration: number = Math.floor(500 / length);

        let move = setInterval(() => {
          this.login[startValue].translate = 0;
          startValue += 1;
          if(startValue === length) clearInterval(move);
        }, duration);
      }
    }
    if(document.getElementById(this.idRelation) != null && !this.stopAnimation[3]){
      let position: number = 0;
      let element: HTMLElement = null;
      if(document.getElementById(this.idRelation) != null) element = document.getElementById(this.idRelation);
      if(element != null) position = element.getBoundingClientRect().top - element.getBoundingClientRect().height;
      if(window.innerHeight - position > 0){
        this.stopAnimation[3] = true;
        this.scaleMap = 1;
        setTimeout(() => {
          this.scaleRelation = 1;
        }, 300);
      }
    }
    if(document.getElementById(this.idCouv) != null && !this.stopAnimation[4]){
      let position: number = 0;
      let element: HTMLElement = null;
      if(document.getElementById(this.idCouv) != null) element = document.getElementById(this.idCouv);
      if(element != null) position = element.getBoundingClientRect().top - element.getBoundingClientRect().height;
      if(window.innerHeight - position > 0){
        this.stopAnimation[4] = true;
        this.opacityBackground = 1;
        this.data.couv != null ? this.background = 'url('+this.data.couv+')' : this.background = "var(--mainColor)"
      }
    }
  }

  protected openMap(): void{
    this.router.navigate(['filter',this.infos.id])
  }
  protected accept(): void{
    if(this.relation === "Répondre à la demande"){
      this.databaseService.updateFollower({id_asked: localStorage.getItem("id"), id_user: this.infos.id, accepted: true}).subscribe((message: Message) => {
        if(!message.error)  this.relation = "Amis";
      });
    }
  }
  protected add(): void{
    this.databaseService.addFollower({id_asked: this.infos.id, id_user: localStorage.getItem("id")}).subscribe((message: Message) => {
      if(!message.error)  this.relation = "Demande en cours";
    });
  }
}
export interface MovingText{
  text: string,
  translate: number,
}
interface CategoryIcon{
  icon: IconDefinition,
  category: string,
  counter: number
}
export interface UserInfos{
  login: string,
  couv: string,
  img: string,
  totalPlaces: number,
  infos: Counter[]
}

