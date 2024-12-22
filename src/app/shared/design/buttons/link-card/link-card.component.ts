import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { LinkCardInfos } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'link-card',
  templateUrl: './link-card.component.html',
  styleUrls: ['./link-card.component.scss']
})
export class LinkCardComponent {

  @Input() src: string = '';
  @Input() setAnimation: boolean = false;
  @Input() text: string = '';
  @Input() styleInfos: LinkCardInfos;

  constructor(private elementRef: ElementRef,
    private themeService: ThemeService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--errorColor', Palette.errorColor);
      this.elementRef.nativeElement.style.setProperty('--successColor', Palette.successColor);
    });
  }

  @HostBinding('style.--textColor') textColorCssVariable = 'var(--black)';
  @HostBinding('style.--selectedBorderColor') selectedBorderColorCssVariable = 'var(--errorColor)';
  @HostBinding('style.--borderColor') borderColorCssVariable = 'var(--errorColor)';
  @HostBinding('style.--colorActive') colorActive = 'var(--mainColor)';
  @HostBinding('style.--textColorActive') textColorActive = 'var(--mainColor)';
  @HostBinding('style.--backgroundImage') backgroundImage = 'var(--black)';

  private themeSubscriber: Subscription = new Subscription();

  ngOnInit(){
    if(this.styleInfos != null){
      this.textColorCssVariable = this.styleInfos.color;
      this.borderColorCssVariable = this.styleInfos.borderColor;
      this.selectedBorderColorCssVariable = this.styleInfos.selectedBorderColor;
      this.colorActive = this.styleInfos.colorActive;
      this.textColorActive = this.styleInfos.textColorActive;
      this.backgroundImage = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('"+this.src+"')";
    }
  }

  ngOnChanges(){
    if(this.styleInfos != null){
      this.textColorCssVariable = this.styleInfos.color;
      this.borderColorCssVariable = this.styleInfos.borderColor;
      this.selectedBorderColorCssVariable = this.styleInfos.selectedBorderColor;
      this.colorActive = this.styleInfos.colorActive;
      this.textColorActive = this.styleInfos.textColorActive;
    }
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
