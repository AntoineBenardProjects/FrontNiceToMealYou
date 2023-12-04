import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { faUtensils, faMartiniGlass, IconDefinition, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { TypeCardParams } from 'src/app/shared/model/params/cardParams';
import { whiteButtonPlaceCard } from 'src/app/shared/model/design/buttonsDesign';
import { TypeStatistics } from 'src/app/shared/model/table/type';
import { DatabaseService } from 'src/app/services/database.service';
import { PlacesService } from 'src/app/services/places.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ButtonInfos, RoundProgressBarInfos } from 'src/app/shared/model/designs';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'type-card',
  templateUrl: './type-card.component.html',
  styleUrls: ['./type-card.component.scss']
})
export class TypeCardComponent {

  constructor(private databaseService: DatabaseService, private placesService: PlacesService,private themeService: ThemeService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

      if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
        this.black = Palette.black;
      });
  }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Metadata  */
  @Input() infos!: TypeCardParams;
  @Output() onClose: EventEmitter<string> = new EventEmitter<string>();
  /*  Css  */
  @HostBinding('style.--textColor') textColor: string = "";
  @HostBinding('style.--color') color: string = "";
  @HostBinding('style.--gradient') gradient: string = "linear-gradient(0.1turn,";
  protected paletteName: string = 'Default';
  private black: string = "";
  /*  Style infos/Icon  */
  protected whiteButtonInfos: ButtonInfos = whiteButtonPlaceCard;
  protected closeIcon: IconDefinition = faXmark;
  protected categoryIcon: IconDefinition;
  /*  Algo  */
  private themeSubscriber: Subscription;
  protected stats!: TypeStatistics;
  protected imgSrc: string = "";

  private ngOnInit(): void{
    if(this.infos != null){
      this.color = "var(--black)";
      this.textColor = "white";
      this.gradient += this.placesService.hexToRgba(this.black,0.5) + "," + this.placesService.hexToRgba(this.black,0.3) + "," + this.placesService.hexToRgba(this.black,0.5) + ")";
      this.imgSrc = this.infos.type.picture;
      this.databaseService.getStatsOfType(this.infos.type).subscribe((statsOfType: TypeStatistics) => {
        this.stats = this.placesService.getCopyOfElement(statsOfType);
      });
      this.infos.type.faIcon = this.placesService.getIconFromName(this.infos.type.icon);
      if(this.infos.type.category === "Restaurant")  this.categoryIcon = faUtensils;
      if(this.infos.type.category === "Bar")  this.categoryIcon = faMartiniGlass;  
    }
  }
  protected close(): void{
    this.onClose.next(this.infos.type.id);
  }
  protected getRoundProgressBarInfos(note: number): RoundProgressBarInfos{
    if(note === null) note = -1;
    let toReturn: RoundProgressBarInfos = {
      note: note,
      width: 2,
      fontWeight: 400,
      color: 'var(--black)',
      textColor: 'var(--black)',
    }
    return toReturn;
  }
}
