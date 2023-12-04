import { Component, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'graph-bar',
  templateUrl: './graph-bar.component.html',
  styleUrls: ['./graph-bar.component.scss']
})
export class GraphBarComponent {
  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService
  ){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);

    });
  }
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Metadata  */
  @Input()  quantity: number;
  @Input()  quality_price: number;
  @Input()  note_deco: number;
  @Input()  width: number = 50;
  @Input()  height: number = 35;
/*  Css  */
  protected colorQuantity: string = "white";
  protected colorQuality: string = "white";
  protected colorQualityPrice: string = "white";
  protected colorDeco: string = "white";
  private themeSubscriber: Subscription = new Subscription();

  private ngOnInit(): void{
    this.colorQuantity = this.setColors(this.quantity);
    this.colorQualityPrice = this.setColors(this.quality_price);
    this.colorDeco = this.setColors(this.note_deco);
  }
  private ngOnDestroy(): void{
    this.themeSubscriber.unsubscribe();
  }
  private setColors(note): string{
    let color: string = "";
    if(note > 7.5) color = "#60993E";
    else if(note >= 4 && note <= 7.5) color = "var(--mainColor)"; 
    else color = "#9E2B25"; 

    return color;
  }
}

interface Size{
  height: number,
  width: number,
}
