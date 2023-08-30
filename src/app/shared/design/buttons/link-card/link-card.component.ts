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
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }

  @HostBinding('style.--textColor') textColorCssVariable = 'var(--mainColor)';
  @HostBinding('style.--selectedBorderColor') selectedBorderColorCssVariable = 'var(--secondColor)';
  @HostBinding('style.--borderColor') borderColorCssVariable = 'var(--secondColor)';

  private themeSubscriber: Subscription = new Subscription();

  ngOnInit(){
    if(this.styleInfos != null){
      this.textColorCssVariable = this.styleInfos.color;
      this.borderColorCssVariable = this.styleInfos.borderColor;
      this.selectedBorderColorCssVariable = this.styleInfos.selectedBorderColor;
    }
  }

  ngOnChanges(){
    if(this.styleInfos != null){
      this.textColorCssVariable = this.styleInfos.color;
      this.borderColorCssVariable = this.styleInfos.borderColor;
      this.selectedBorderColorCssVariable = this.styleInfos.selectedBorderColor;
    }
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
