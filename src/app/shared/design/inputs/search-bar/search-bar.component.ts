import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AutocompleteInfos, InputInfos, SelectData } from 'src/app/shared/model/designs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  constructor(){}


  @Input() styleInfo!: InputInfos;
  @Input() autocompleteInfos!: AutocompleteInfos;
  @Input() preset: string = "";
  @Input() autocomplete: SelectData[] = [];
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
  @HostBinding('style.--backgroundColorAuto') backgroundColorAuto: string = 'var(--white)';
  @HostBinding('style.--textColorAuto') textColorAuto: string = 'var(--black)';
  @HostBinding('style.--backgroundColorAutoActive') backgroundColorAutoActive: string = 'var(--white)';
  @HostBinding('style.--textColorAutoActive') textColorAutoActive: string = 'var(--black)';

  protected searchTerm: string = '';
  protected autocompleteValues: SelectData[] = [];
  protected filteredValues: SelectData[] = [];
  protected autocompleteSize: string = "";
  protected autocompleteOpened: boolean = false;

  ngOnInit(){
    if(this.styleInfo != null)  this.setStyle();
    if(this.autocomplete.length > 0){
      this.autocomplete.forEach((res: SelectData) => {
        this.autocompleteValues.push({
          id: res.id,
          name: res.name,
          selected: false,
          subtitle: res.subtitle
        });
      });
    }
    if(this.autocompleteInfos != null){
      this.backgroundColorAuto = this.autocompleteInfos.backgroundColor;
      this.textColorAuto = this.autocompleteInfos.textColor;
      this.backgroundColorAutoActive = this.autocompleteInfos.backgroundColorActive;
      this.textColorAutoActive = this.autocompleteInfos.textColorActive;
    }
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
