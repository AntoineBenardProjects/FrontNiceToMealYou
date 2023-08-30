import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  constructor(private elementRef: ElementRef,
    private themeService: ThemeService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

  @Input() card: boolean = true;
  @Input() note: number = 0;
  @Input() tested: boolean = false;
  @Input() unitColor: string = 'var(--black)'
  @Input() mediumColor: string = 'var(--mainColor)';

  protected percent: number = 0;
  protected size: string = '130px';
  protected center: Coordinates = {
    x: 65,
    y: 65
  };
  protected radius: number = 64;
  protected strokeDashArray: number = 402;
  protected strokeDashOffset: number = 402;
  protected fontSizeNote: number = 25;
  protected fontSizeUnit: number = 16;

  @HostBinding('style.--dashPosition') dashPosition: string = '';
  @HostBinding('style.--color') color: string = '';

  ngOnInit(){
    this.tested ? this.percent = this.note * 10 : this.percent = this.note * 20;
    this.setColor();
    if(!this.card){
      this.fontSizeNote = 50;
      this.fontSizeUnit = 32;
      this.size = "152px";
      this.center = {
        x: 76,
        y: 76
      }
      this.radius = 75;
      this.strokeDashArray = 471;
      this.strokeDashOffset = 471;
    }
    this.strokeDashOffset = this.strokeDashArray - (this.strokeDashArray * (this.percent/100));
    this.dashPosition = 'rotate(calc(3.6deg * ' + this.percent + '))';
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }

  setColor(){
    if(this.percent > 75) this.color = "#60993E";
    else if(this.percent < 25)  this.color = "#9E2B25";
    else this.color = this.mediumColor;
  }

}

interface Coordinates{
  x: number,
  y: number
}