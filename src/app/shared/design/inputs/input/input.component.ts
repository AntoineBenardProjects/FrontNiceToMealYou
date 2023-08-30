import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { AutocompleteInfos, InputInfos, SelectData } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() styleInfo!: InputInfos;
  @Input() autocompleteInfos!: AutocompleteInfos;
  @Input() text: string = "";
  @Input() type: string = "text";
  @Input() autocomplete: SelectData[] = [];
  @Input() value: string | number = "";
  @Input() errorMessage: string = '';

  @Output() selectAutocomplete: EventEmitter<string> = new EventEmitter();

  @HostBinding('style.--backgroundColor') backgroundColor: string = 'var(--white)';
  @HostBinding('style.--borderColor') borderColor: string = 'var(--black)';
  @HostBinding('style.--borderColorActive') borderColorActive: string = 'var(--mainColor)';
  @HostBinding('style.--textColor') textColor: string = 'var(--black)';
  @HostBinding('style.--placeholderColor') placeholderColor: string = 'var(--black)';
  @HostBinding('style.--placeholderColorActive') placeholderColorActive: string = 'var(--mainColor)';
  @HostBinding('style.--fontSize') fontSize: string = '16px';
  @HostBinding('style.--backgroundColorAuto') backgroundColorAuto: string = 'var(--white)';
  @HostBinding('style.--textColorAuto') textColorAuto: string = 'var(--black)';
  @HostBinding('style.--backgroundColorAutoActive') backgroundColorAutoActive: string = 'var(--white)';
  @HostBinding('style.--textColorAutoActive') textColorAutoActive: string = 'var(--black)';
  @HostBinding('style.--hoverTextColor') hoverTextColor: string = 'var(--white)';
  @HostBinding('style.--hoverBackgroundColor') hoverBackgroundColor: string = 'var(--black)';
  @HostBinding('style.--hoverTransition') hoverTransition: string = '.5s';
  @HostBinding('style.--hoverBorderColor') hoverBorderColor: string = 'var(--black)';


  protected showGrade: boolean = false;
  protected autocompleteValues: SelectData[] = [];
  protected filteredValues: SelectData[] = [];
  protected autocompleteSize: string = "";
  protected autocompleteOpened: boolean = false;
  protected errorAnimation: boolean = false;
  protected inputClass: string = "placeholderDown";
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

  ngOnInit(){
    if(this.styleInfo != null){
      this.backgroundColor = this.styleInfo.backgroundColor;
      this.textColor = this.styleInfo.color;
      this.placeholderColor = this.styleInfo.placeholderColor;
      this.placeholderColorActive = this.styleInfo.placeholderColorActive;
      if(this.styleInfo.borderColor != null)  this.borderColor = this.styleInfo.borderColor;
      if(this.styleInfo.borderColorActive != null)  this.borderColorActive = this.styleInfo.borderColorActive;
      if(this.styleInfo.fontSize != null)  this.fontSize = this.styleInfo.fontSize;
      if(this.styleInfo.type != null)  this.type = this.styleInfo.type;
    }
    if(this.type === "grade"){
      this.showGrade = true;
      this.type = "number";
    }
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

  ngOnChanges(changes: SimpleChanges){
    this.autocompleteValues = [];
    if(this.styleInfo != null){
      this.backgroundColor = this.styleInfo.backgroundColor;
      this.textColor = this.styleInfo.color;
      this.placeholderColor = this.styleInfo.placeholderColor;
      this.placeholderColorActive = this.styleInfo.placeholderColorActive;
      if(this.styleInfo.borderColor != null)  this.borderColor = this.styleInfo.borderColor;
      if(this.styleInfo.borderColorActive != null)  this.borderColorActive = this.styleInfo.borderColorActive;
      if(this.styleInfo.fontSize != null)  this.fontSize = this.styleInfo.fontSize;
      if(this.styleInfo.type != null)  this.type = this.styleInfo.type;
      if(this.styleInfo.hoverBackgroundColor != null)  this.hoverBackgroundColor = this.styleInfo.hoverBackgroundColor;
      if(this.styleInfo.hoverTextColor != null)  this.hoverTextColor = this.styleInfo.hoverTextColor;
      if(this.styleInfo.hoverBorderColor != null)  this.hoverBorderColor = this.styleInfo.hoverBorderColor;
      if(this.styleInfo.hoverTransition != null)  this.hoverTransition = this.styleInfo.hoverTransition;

    }
    if(this.type === "grade"){
      this.showGrade = true;
      this.type = "number";
    }
    if(this.autocomplete.length > 0){
      this.autocomplete.forEach((res: SelectData) => {
        this.autocompleteValues.push({
          id: res.id,
          name: res.name,
          selected: false,
          subtitle: res.subtitle
        })
      });
    }
    if(this.autocompleteInfos != null){
      this.backgroundColorAuto = this.autocompleteInfos.backgroundColor;
      this.textColorAuto = this.autocompleteInfos.textColor;
      this.backgroundColorAutoActive = this.autocompleteInfos.backgroundColorActive;
      this.textColorAutoActive = this.autocompleteInfos.textColorActive;
    }

    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'errorMessage': {
            setTimeout(() => {
              changes[propName].currentValue !== '' ? this.errorAnimation = true : this.errorAnimation = false;
            },400);
          }
        }
      }
    }

  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }

  checkValidGrade(event: string){
    this.filteredValues = [];
    this.value = event;
    event.length > 0 ? this.inputClass = "placeholderUp" : this.inputClass = "placeholderDown";

    if(this.autocompleteValues.length > 0 && event.length > 0){
      const filterValue: string = event.toLowerCase();

      this.filteredValues = this.autocompleteValues.filter((element: SelectData) => {
        const nameToLowerCase: string = element.name.toLowerCase();
        if(nameToLowerCase.includes(filterValue)) return true;
        return false;
      });
      
      let sizeDiv: number = this.filteredValues.length * 7;
      this.autocompleteSize = sizeDiv.toString() + "vh";
      if(sizeDiv > 0) this.autocompleteOpened = true;
      else  this.autocompleteOpened = false;
    }

  }

  sendAutocomplete(value:SelectData){
    this.value = value.name;
    this.filteredValues = [];
    this.selectAutocomplete.next(value.id);
  }

  closeAutocomplete(){
    setTimeout(() => {
      this.autocompleteOpened = false;
    },1000);
  }

}