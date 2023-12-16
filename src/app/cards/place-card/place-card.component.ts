import { Component, EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceCardParams } from 'src/app/shared/model/params/cardParams';
import { PlacesService } from 'src/app/services/places.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss']
})
export class PlaceCardComponent {


  constructor(private placesService: PlacesService,private themeService: ThemeService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

      if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
        this.black = Palette.black;
      });
  }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Metadata  */
  @Input() infos!: PlaceCardParams;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() displayed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() add: EventEmitter<string> = new EventEmitter<string>();
  /*  Css  */
  protected transition: string = "height .5s, width .5s, transform 1s, overflow .5s";
  protected paletteName: string = 'Default';
  private black: string = '';
  protected height: number = 2;
  protected width: number = 0;
  protected overflow:string = 'hidden';
  protected backgroundColor: string = "";
  /*  Algo  */
  protected toShowFront: string = "general";
  protected toShowBack: string = "general";
  protected front: boolean = true;
  protected typeOfCard: string = "glass";
  private themeSubscriber: Subscription;
  private setAnimation: boolean = false;
  protected frontId: string = "";
  protected backId: string = "";

  private ngOnInit(): void{
    this.frontId = this.placesService.setId();
    this.backId = this.placesService.setId();
    this.transition = "height .5s, width .5s, transform 1s, overflow .5s";
  }
  private ngOnChanges(): void{
    this.transition = "height .5s, width .5s, transform 1s, overflow .5s";
    if(this.infos != null && !this.infos.startAnimation){
      this.transition = "0s";
      sessionStorage.getItem("device") === "desktop" ?  this.width = 500 : this.width = 370;
      this.height = 195 + this.infos.types.length * 40;
      this.overflow = "inherit";
      this.displayed.next(true);
    }
    if(this.infos != null && !this.setAnimation && this.infos.startAnimation){
      this.setAnimation = true;
      setTimeout(() => {
        sessionStorage.getItem("device") === "desktop" ?  this.width = 500 : this.width = 370;
        setTimeout(() => {
          this.height = 195 + this.infos.types.length * 40;
          setTimeout(() => {
            this.overflow = "inherit";
          },500);
        },500);
      },0);
    }
  }
  private initStyle(): void{
    this.backgroundColor = this.black;
  }
  protected swap(toShow: string): void{
    this.front = !this.front;
    this.front ? this.toShowFront = toShow : this.toShowBack = toShow;
    setTimeout(() => {
      this.front ? this.height = document.getElementById(this.frontId).clientHeight : this.height = document.getElementById(this.backId).clientHeight;
    }, 100);
  }
  protected calculHeight(toAdd: number): void{
    this.height += toAdd;
  }
  protected close(): void{
    if(!this.front){
      this.transition = "height .5s, width .5s, transform 0s, overflow .5s";
      this.toShowFront = this.toShowBack;
      this.front = true;
    }
    setTimeout(() => {
      this.height = 2;
      this.overflow = "hidden";
      setTimeout(() => {
        this.width = 0;
        setTimeout(() => {
          this.front = true;
          this.toShowBack = "general";
          this.toShowFront = "general";
          this.setAnimation = false;
          this.onClose.next(true);
        },500);
      },500);
    },0);
  }
  protected addPlace(): void{
    this.add.next(this.infos.place.id);
    this.onClose.next(true);
  }
  private ngOnDestroy(): void{
    this.themeSubscriber.unsubscribe();
  }
  
}