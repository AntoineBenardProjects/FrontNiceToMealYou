import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatabaseService } from 'src/app/services/database.service';
import { PlacesService } from 'src/app/services/places.service';
import { addButtonInfosFollowComponent, categoryButtonUserCard } from 'src/app/shared/model/design/buttonsDesign';
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

/*  Style infos  */
  protected categoryButtonInfos: ButtonInfos = categoryButtonUserCard;
  protected addButtonInfos: ButtonInfos = addButtonInfosFollowComponent;
/*  Icons  */
  protected userIcon: IconDefinition = faUser;
  protected categoriesIcon: CategoryIcon[] = [];
/*  Algos  */
  protected data: UserInfos;
  protected relation: string = "";
  

  private ngOnInit(): void{
    this.categoriesIcon = [];
    this.databaseService.getUserInfo(this.infos.id).subscribe((infos: UserInfos) => {
      this.data = this.placesService.getCopyOfElement(infos);
      this.data.infos.forEach((info: Counter) => {
        this.categoriesIcon.push({
          category: info.value,
          counter: info.counter,
          icon: this.placesService.getIconOfCategory(info.value)
        });
      });
    });
    const follow: Follow = {
      id_user: this.infos.id,
      id_asked: localStorage.getItem("id"),
    }
    this.databaseService.getRelationBetweenUsers(follow).subscribe((relation: Message) => {
      this.relation = relation.message;
    });
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
interface CategoryIcon{
  icon: IconDefinition,
  category: string,
  counter: number
}
export interface UserInfos{
  login: string,
  img: string,
  totalPlaces: number,
  infos: Counter[]
}

