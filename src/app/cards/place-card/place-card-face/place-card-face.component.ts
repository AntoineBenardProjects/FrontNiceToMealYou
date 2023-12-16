import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PlaceCardParams } from 'src/app/shared/model/params/cardParams';
import { PlacesService } from 'src/app/services/places.service';
import { IconDefinition, faTrainSubway, faCommentDots, faChartColumn, faGlasses, faXmark, faEdit, faTrashCan, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Comment } from 'src/app/shared/model/table/comment';
import { Horaires } from 'src/app/shared/model/table/horaires';
import { Ligne } from 'src/app/shared/model/table/transports';
import { ButtonInfos, CheckboxInfos, RoundProgressBarInfos } from 'src/app/shared/model/designs';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';
import { Type } from 'src/app/shared/model/table/type';
import { blackButtonPlaceCard, whiteButtonPlaceCard, categoryButtonPlaceCard } from 'src/app/shared/model/design/buttonsDesign';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Message } from 'src/app/shared/model/params/message';
import { checkboxInfosPlaceCardFaceComponent } from 'src/app/shared/model/design/checkboxesDesign';
import { City } from 'src/app/shared/model/table/places';

@Component({
  selector: 'place-card-face',
  templateUrl: './place-card-face.component.html',
  styleUrls: ['./place-card-face.component.scss']
})
export class PlaceCardFaceComponent {
  constructor(private placesService: PlacesService,private themeService: ThemeService,private router: Router,private databaseService: DatabaseService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

      if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
        this.black = Palette.black;
      });
  }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Metadata  */
  @Input() face: string = "";
  @Input() infos: PlaceCardParams;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addPlace: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newFace: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeHeight: EventEmitter<number> = new EventEmitter<number>();
  /*  Style infos  */
  protected blackButtonInfos: ButtonInfos = blackButtonPlaceCard;
  protected whiteButtonInfos: ButtonInfos = whiteButtonPlaceCard;
  protected categoryButtonInfos: ButtonInfos = categoryButtonPlaceCard;
  protected checkboxInfos: CheckboxInfos = checkboxInfosPlaceCardFaceComponent;

  /*  Icons  */
  protected closeIcon: IconDefinition = faXmark;
  protected editIcon: IconDefinition = faEdit;
  protected deleteIcon: IconDefinition = faTrashCan;
  protected categoryIcon: IconDefinition;
  protected subwayIcon: IconDefinition = faTrainSubway;
  protected usersIcon: IconDefinition = faCommentDots;
  protected commentIcon: IconDefinition = faChartColumn;
  protected generalIcon: IconDefinition = faGlasses;
  protected addIcon: IconDefinition = faThumbsUp;
  /*  Css  */
  @HostBinding('style.--textColor') textColor: string = "";
  @HostBinding('style.--backgroundColor') backgroundColor: string = "";
  private noteColor: string = "var(--white)";
  private black: string = '';
  protected paletteName: string = 'Default';
  protected background: string = "linear-gradient(0.1turn,";
  protected heightHoraires: number = 0;
  /*  Algo  */
  private themeSubscriber: Subscription;
  protected grades: Comment;
  protected idUser: string = localStorage.getItem("id");
  protected comments: UsersComments[] = [];
  protected isOpen: boolean = false;
  protected displayHoraires: boolean = false;
  protected today: string = '';
  protected horairesOfPlace: ShowHoraires[] = [];
  protected category: string = "";
  protected imgSrc: string = "";
  protected userComment: Comment;
  protected restaurantRoundProgressBars: RestaurantRoundProgressBar = {
    quality_price: null,
    quantity: null,
    service: null,
    price: null
  };
  protected barRoundProgressBars: BarRoundProgressBar = {
    quality_price: null,
    prix_cocktail: null,
    prix_coffee: null,
    prix_pinte: null,
  };
  protected commonRoundProgressBars: RoundProgressBarInfos = null
  protected comment: string = "";
  protected lignes: Ligne[] = [];
  protected reg: string = "";

  private ngOnInit(): void{
    if(this.face !== '' && this.infos != null) this.initCard();
  }
  private ngOnChanges(): void{
    if(this.face !== '' && this.infos != null) this.initCard();
  }
  private ngOnDestroy(): void{
    this.themeSubscriber.unsubscribe();
  }
  private initCard(): void{
    if(this.infos.stations != null) this.initStations();
    this.initStyle();
    this.initNotes();
    this.initHoraires();
    this.initIcon();
  }
  private initIcon(): void{
    this.infos.types.forEach((type: Type) => {
      type.faIcon = this.placesService.getIconFromName(type.icon);
    });
  }
  protected navigate(id: string):void {
    this.router.navigate(["edit"],{queryParams: {id: id}});
  }
  protected suppress(): void{

  }
  private initHoraires(): void{
    this.horairesOfPlace = [];
    if(this.infos.horaires.length > 0) this.isOpen = this.placesService.isOpened(this.infos.horaires);
    const today: Date = new Date();
    this.today = this.placesService.convertDayTimeToDay(today.getDay());
    this.infos.horaires.sort((a: Horaires, b:Horaires) => {
      const numberA: number = this.placesService.convertDayToNumber(a.day);
      const numberB: number = this.placesService.convertDayToNumber(b.day);
      if(numberA < numberB) return -1;
      return 1;
    });
    this.infos.horaires.forEach((horaires: Horaires) => {
      let find: ShowHoraires = this.horairesOfPlace.find((element: ShowHoraires) => {
        const checkOuverture: boolean = element.horaires.ouverture === horaires.ouverture;
        const checkFermetureMidi: boolean = element.horaires.fermeture_midi === horaires.fermeture_midi;
        const checkOuvertureSoir: boolean = element.horaires.ouverture_soir === horaires.ouverture_soir;
        const checkFermeture: boolean = element.horaires.fermeture === horaires.fermeture;
        if(checkOuverture && checkFermetureMidi && checkOuvertureSoir && checkFermeture)  return true;
        return false;
      });
      if(find != null)  find.days.push(horaires.day);
      else if(horaires.ouverture !== ''){
        const toPush: ShowHoraires = {
          days: [horaires.day],
          horaires: {
            ouverture: horaires.ouverture,
            fermeture_midi: horaires.fermeture_midi,
            ouverture_soir: horaires.ouverture_soir,
            fermeture: horaires.fermeture
          }
        }
        this.horairesOfPlace.push(toPush);
      } 
    });
  }
  protected changeHoraires(): void{
    this.displayHoraires = !this.displayHoraires;
    this.displayHoraires ? this.heightHoraires = this.horairesOfPlace.length * 80 + 70 : this.heightHoraires = 0;
    let addedHeight: number = 0;
    this.displayHoraires ? addedHeight += this.horairesOfPlace.length * 38 + 70 : addedHeight -= this.horairesOfPlace.length * 80 + 70;
    this.changeHeight.next(addedHeight);
  }
  protected hasDay(days: string[]): boolean{
    let toReturn: boolean = false
    days.find((day: string) => this.today === day) != null ? toReturn = true : toReturn = false;
    return toReturn;
  }
  private initStyle(): void{
    this.background = "linear-gradient(0.1turn,";
    this.category = this.infos.place.category;
    this.categoryIcon = this.placesService.getIconOfCategory(this.category);
    this.infos.pictures.length > 0 ? this.imgSrc = this.infos.pictures[0].src : this.imgSrc = this.infos.types[0].picture;
    this.backgroundColor = this.black;
    this.textColor = 'var(--white)';
    this.background += this.placesService.hexToRgba(this.backgroundColor,0.5) + "," + this.placesService.hexToRgba(this.backgroundColor,0.3) + "," + this.placesService.hexToRgba(this.backgroundColor,0.5) + ")";
  }
  private initNotes(): void{
    if(this.infos.user){
      this.userComment = this.infos.comments.find((comment: Comment) => comment.id_user === localStorage.getItem("id"));
      if(this.infos.comments.find((comment: Comment) => comment.id_user === localStorage.getItem("id")) != null)  this.grades = this.infos.comments.find((comment: Comment) => comment.id_user === localStorage.getItem("id"));
      else  this.grades = {
        comment: "",
        tested: false,
        id_place: this.infos.place.id,
        id_user: localStorage.getItem("id"),
        quality_price: 0,
        quantity: 0,
        service: 0,
        price: 0
      }
      this.setNotes();
      if(this.infos.comments.find((comment: Comment) => comment.id_user === localStorage.getItem("id")) != null)  this.comment = this.infos.comments.find((comment: Comment) => comment.id_user === localStorage.getItem("id")).comment;  
    } else{
      this.grades = {
        comment: "",
        tested: false,
        id_place: this.infos.place.id,
        id_user: localStorage.getItem("id"),
        quality_price: 0,
        quantity: 0,
        service: 0,
        price: 0
      }
      if(this.infos.place.category === "Restaurant"){
        let quality_price: number[] = [0,0];
        let quantity: number[] = [0,0];
        let service: number[] = [0,0];
        let price: number[] = [0,0];

        this.infos.comments.forEach((comment: Comment) => {
          if(comment.quality_price != null){
            quality_price[0] += comment.quality_price;
            quality_price[1]++;
          }
          if(comment.quantity != null){
            quantity[0] += comment.quantity;
            quantity[1]++;
          }
          if(comment.service != null){
            service[0] += comment.service;
            service[1]++;
          }
          if(comment.price != null){
            price[0] += comment.price;
            price[1]++;
          }
        });
        if(quality_price[1] > 0)  quality_price[0] /= quality_price[1];
        if(quantity[1] > 0)  quantity[0] /= quantity[1];
        if(service[1] > 0)  service[0] /= service[1];
        if(price[1] > 0)  price[0] /= price[1];
        this.grades.quality_price = quality_price[0];
        this.grades.quantity = quantity[0];
        this.grades.service = service[0];
        this.setNotes();
      } else if(this.infos.place.category === "Bar"){
        this.commonRoundProgressBars = null;
        this.restaurantRoundProgressBars = null;
        let quality_price: number[] = [0,0];
        this.infos.comments.forEach((comment: Comment) => {
          if(comment.quality_price != null){
            quality_price[0] += comment.quality_price;
            quality_price[1]++;
          }
        });
        if(quality_price[1] > 0)  quality_price[0] /= quality_price[1];
        this.grades.quality_price = quality_price[0];
        this.setNotes();
      }
      else if(this.infos.place.category !== "Restaurant" && this.infos.place.category !== "Bar"){
        this.restaurantRoundProgressBars = null;
        this.barRoundProgressBars = null;
        let quality_price: number[] = [0,0];
        this.infos.comments.forEach((comment: Comment) => {
          if(comment.quality_price != null){
            quality_price[0] += comment.quality_price;
            quality_price[1]++;
          }
        });
        if(quality_price[1] > 0)  quality_price[0] /= quality_price[1];
        this.grades.quality_price = quality_price[0];
        this.setNotes();
      }
      
    }
  }
  private setNotes():void{
    if(this.infos.place.category === "Restaurant"){
      this.barRoundProgressBars = null;
      this.commonRoundProgressBars = null;
      this.restaurantRoundProgressBars = {
        quality_price: this.getRoundProgressBarInfosByNote(this.grades.quality_price),
        quantity: this.getRoundProgressBarInfosByNote(this.grades.quantity),
        service: this.getRoundProgressBarInfosByNote(this.grades.service),
        price: this.grades.price
      };  
    } else if(this.infos.place.category === "Bar"){
      this.commonRoundProgressBars = null;
      this.restaurantRoundProgressBars = null;
      this.barRoundProgressBars = {
        quality_price: this.getRoundProgressBarInfosByNote(this.grades.quality_price),
        prix_cocktail: this.infos.place.prix_cocktail,
        prix_pinte: this.infos.place.prix_pinte,
        prix_coffee: this.infos.place.prix_coffee,
      }; 
    }
    else if(this.infos.place.category !== "Restaurant" && this.infos.place.category !== "Bar"){
      this.restaurantRoundProgressBars = null;
      this.barRoundProgressBars = null;
      this.commonRoundProgressBars = {
        color: this.getStyleNotes(this.grades.quality_price).color,
        width: this.getStyleNotes(this.grades.quality_price).width,
        textColor: this.noteColor,
        note: this.grades.quality_price,
        editable: this.infos.user ? true : false
      }
    }
  }
  private getRoundProgressBarInfosByNote(note: number): RoundProgressBarInfos{
    return {
      color: this.getStyleNotes(note).color,
      width: this.getStyleNotes(note).width,
      textColor: this.noteColor,
      note: note,
      editable: this.infos.user ? true : false
    }
  }
  protected setComment(event: any): void{
    this.grades.comment = event.target.textContent;
    this.databaseService.updateComment(this.grades,this.infos.place.category).subscribe((message: Message) => {
      console.log(message);
    });
  }
  protected getStyleNotes(note: number): WidthAndColor{
    let styleNote: WidthAndColor;
    if(note > 9)  styleNote = {
      color: "#daa520",
      width: 4
    }
    else if(note >= 8)  styleNote = {
      color: "var(--thirdColor)",
      width: 4
    }
    else if(note > 7)  styleNote = {
      color: "var(--black)",
      width: 4
    } 
    else if(note > 4)  styleNote = {
      color: "var(--mainColor)",
      width: 4
    }
    else  styleNote = {
      color: "var(--secondColor)",
      width: 4
    }
    return styleNote;
  }
  protected setTested(event: boolean): void{
    event ? this.changeHeight.next(250) : this.changeHeight.next(-250);
    this.grades.tested = event;
    if(!this.grades.tested){
      this.grades = {
        comment: this.grades.comment,
        tested: false,
        id_place: this.infos.place.id,
        id_user: localStorage.getItem("id"),
        quality_price: 0,
        quantity: 0,
        service: 0,
        price: 0
      }
      this.setNotes();
      this.databaseService.updateComment(this.grades,this.infos.place.category).subscribe((message: Message) => {
        console.log(message);
      });
    }
  }
  protected changeNote(event: any, category: string, params: string): void{
    if(event.target != null)  this.grades[params] = Number(event.target.value);
    else  this.grades[params] = Number(event);
    if(this.userComment != null)  this.databaseService.updateComment(this.grades,category).subscribe((res: Message) => {
      console.log(res)
    }); else{
      this.databaseService.addComment(this.grades,category).subscribe((res: Message) => {
        this.userComment = this.grades;
      });
    }
    if(category === "Bar"){
      this.barRoundProgressBars[params] = {
        color: this.getStyleNotes(this.grades[params]).color,
        width: this.getStyleNotes(this.grades[params]).width,
        textColor: this.noteColor,
        note: this.grades[params],
        editable: this.infos.user ? true : false
      }
    } else if(category === "Restaurant"){
      params === "price" ? this.restaurantRoundProgressBars[params] = this.grades.price : this.restaurantRoundProgressBars[params] = {
        color: this.getStyleNotes(this.grades[params]).color,
        width: this.getStyleNotes(this.grades[params]).width,
        textColor: this.noteColor,
        note: this.grades[params],
        editable: this.infos.user ? true : false
      };
    } else{
      this.commonRoundProgressBars = {
        color: this.getStyleNotes(this.grades[params]).color,
        width: this.getStyleNotes(this.grades[params]).width,
        textColor: this.noteColor,
        note: this.grades[params],
        editable: this.infos.user ? true : false
      }
    }
  }
  private initStations(): void{
    this.infos.stations.forEach((station: any) => {
      this.lignes.push(...station.lignes);
    });
    this.lignes = this.placesService.removeDuplicate(this.lignes);
    if(this.infos.stations[0] == null){
      this.databaseService.getCityById(this.infos.place.id_city).subscribe((city: City) => {
        this.reg = city.reg;
      });
    } 
    else  this.reg = this.infos.stations[0].reg;
  }
  protected openInBrowser(url: string): void{
    window.open(url, "_blank");
  }
  protected close(): void{
    this.onClose.next(true);
  }
  protected add(): void{
    this.addPlace.next(true);
  }
  protected swap(newFace: string): void{
    this.newFace.next(newFace);
  }
}
interface RestaurantRoundProgressBar{
  quality_price: RoundProgressBarInfos,
  quantity: RoundProgressBarInfos,
  service: RoundProgressBarInfos,
}
interface BarRoundProgressBar{
  quality_price: RoundProgressBarInfos,
  prix_pinte: number,
  prix_cocktail: number,
  prix_coffee: number,
}
interface RestaurantRoundProgressBar{
  quality_price: RoundProgressBarInfos,
  quantity: RoundProgressBarInfos,
  service: RoundProgressBarInfos,
  price: number
}
interface UsersComments{
  user: {
    id: string
    name: string,
    login: string
  },
  comment: string,
  barGrades?: Comment,
  restaurantGrades?: Comment
}
interface ShowHoraires{
  days: string[],
  horaires: {
    ouverture: string,
    fermeture_midi: string,
    ouverture_soir: string,
    fermeture: string
  }
}
interface WidthAndColor{
  width: number,
  color: string
}