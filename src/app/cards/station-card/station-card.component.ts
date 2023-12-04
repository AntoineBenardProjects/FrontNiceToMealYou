import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { IconDefinition, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { StationCardParams } from 'src/app/shared/model/params/cardParams';
import { statsStationCard, whiteButtonPlaceCard } from 'src/app/shared/model/design/buttonsDesign';
import { Ligne, StationStats } from 'src/app/shared/model/table/transports';
import { DatabaseService } from 'src/app/services/database.service';
import { PlacesService } from 'src/app/services/places.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ButtonInfos } from 'src/app/shared/model/designs';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent {
  constructor(private databaseService: DatabaseService,private placesService: PlacesService,private themeService: ThemeService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

      if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
        this.black = Palette.black;
      });
  }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Metadata  */
  @Input() infos!: StationCardParams;
  @Output() onClose: EventEmitter<string> = new EventEmitter<string>();
  /*  Css  */
  @HostBinding('style.--textColor') textColor: string = "";
  @HostBinding('style.--color') color: string = "";
  @HostBinding('style.--gradient') gradient: string = "linear-gradient(0.1turn,";
  protected paletteName: string = 'Default';
  private black: string = "";
  /*  Style infos/Icon  */
  protected statsButton: ButtonInfos = statsStationCard;
  protected whiteButtonInfos: ButtonInfos = whiteButtonPlaceCard;
  protected closeIcon: IconDefinition = faXmark;
  /*  Algo  */
  private themeSubscriber: Subscription;
  protected lignes: Ligne[] =[];
  protected stats: StationStats;
  protected imgSrc: string = "";
  

  private ngOnInit(): void{
    this.databaseService.getLignesOfStation(this.infos.station.id).subscribe((lignesOfStation: Ligne[]) => {
      this.lignes = this.placesService.getCopyOfElement(lignesOfStation);
      this.lignes.forEach((ligne: Ligne) => {
        ligne.buttonInfos = {
          color: ligne.color,
          colorActive: this.placesService.isColorLight(ligne.color) ? 'var(--black)' : 'white',
          borderColor: ligne.color,
          borderColorActive: ligne.color,
          backgroundColor: 'transparent',
          backgroundColorActive: ligne.color,
          fontSize: "16px",
          heightIcon: "30px",
          radius: "50%"
        }        
      });
      this.color = "var(--black)";
      this.imgSrc = lignesOfStation[0].picture;
      this.textColor = "white";
      this.gradient += this.placesService.hexToRgba(this.black,0.5) + "," + this.placesService.hexToRgba(this.black,0.3) + "," + this.placesService.hexToRgba(this.black,0.5) + ")";
    });
    this.databaseService.getStatisticsOfStation(this.infos.station.id).subscribe((statsOfStation: StationStats) => {
      this.stats = this.placesService.getCopyOfElement(statsOfStation);
    });
  }

  protected getButtonInfos(nbOpen: number): ButtonInfos{
    const toReturn: ButtonInfos = {
      color: "white",
      colorActive: nbOpen > 0 ? "var(--thirdColor)" : "var(--secondColor)",
      borderColor: nbOpen > 0 ? "var(--thirdColor)" : "var(--secondColor)",
      borderColorActive: nbOpen > 0 ? "var(--thirdColor)" : "var(--secondColor)",
      backgroundColor: nbOpen > 0 ? "var(--thirdColor)" : "var(--secondColor)",
      backgroundColorActive: 'var(--white)',
      fontSize: "16px",
      heightIcon: "30px",
      radius: "50%"
    }
    return toReturn;
  }

  protected getIconFromCategory(category: string): IconDefinition{
    return this.placesService.getIconOfCategory(category);
  }

  protected close(): void{
    this.onClose.next(this.infos.station.id);
  }
}
