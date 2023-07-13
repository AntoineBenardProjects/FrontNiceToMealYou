import { Component, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { InputInfos } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

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
  private themeSubscriber: Subscription;


  @Input() styleInfo!: InputInfos;
  @Input() preset: string = "";
  @Input() background: string = "white";
  @Input() text: string = "";
  @Output() filter: EventEmitter<string> = new EventEmitter();

  @HostBinding('style.--backgroundColor') backgroundColor: string = 'white';
  @HostBinding('style.--borderColor') borderColor: string = '#230C33';
  @HostBinding('style.--borderColorActive') borderColorActive: string = '#CAA8F5';
  @HostBinding('style.--textColor') textColor: string = '#230C33';
  @HostBinding('style.--placeholderColor') placeholderColor: string = '#592E83';
  @HostBinding('style.--placeholderColorActive') placeholderColorActive: string = '#CAA8F5';
  @HostBinding('style.--backgroundSearchColor') backgroundSearchColor: string = 'white';
  @HostBinding('style.--colorSearch') colorSearch: string = 'white';
  @HostBinding('style.--backgroundSearchColorHover') backgroundSearchColorHover: string = 'white';
  @HostBinding('style.--colorSearchHover') colorSearchHover: string = 'white';
  @HostBinding('style.--fontSize') fontSize: string = '16px';

  protected searchTerm: string = '';

  ngOnInit(){
    if(this.styleInfo != null)  this.setStyle();
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }

  setStyle(){
    this.backgroundColor = this.styleInfo.backgroundColor;
    this.borderColor = this.styleInfo.borderColor;
    this.borderColorActive = this.styleInfo.borderColorActive;
    this.textColor = this.styleInfo.color;
    this.placeholderColor = this.styleInfo.placeholderColor;
    this.placeholderColorActive = this.styleInfo.placeholderColorActive;
    this.backgroundSearchColor = this.styleInfo.backgroundSearchColor;
    this.colorSearch = this.styleInfo.colorSearch;
    this.backgroundSearchColorHover = this.styleInfo.backgroundSearchColorHover;
    this.colorSearchHover = this.styleInfo.colorSearchHover;
  }
  
  onClickMethod(){
    this.filter.emit(this.searchTerm);
  }
}
