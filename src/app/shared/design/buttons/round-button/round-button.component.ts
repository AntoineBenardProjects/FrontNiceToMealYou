import { Component, HostBinding, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ButtonInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'round-button',
  templateUrl: './round-button.component.html',
  styleUrls: ['./round-button.component.scss']
})
export class RoundButtonComponent {
  @Input() styleInfos: ButtonInfos;
  @Input() preset: string = '';
  @Input() icon: IconDefinition;
  @Input() text: string = "Ajouter";

  @HostBinding('style.--heightCssVariable') heightCssVariable = '100%';
  @HostBinding('style.--cursorCssVariable') cursorCssVariable = 'pointer';
  @HostBinding('style.--borderRadiusCssVariable') borderRadiusCssVariable = '5px';
  @HostBinding('style.--borderColor') borderColorCssVariable = 'transparent';
  @HostBinding('style.--borderColorActive') borderColorActiveCssVariable = 'transparent';
  @HostBinding('style.--backgroundColor') backgroundColorCssVariable = 'transparent';
  @HostBinding('style.--backgroundColorActive') backgroundColorActiveCssVariable = '';
  @HostBinding('style.--textColor') textColorCssVariable = '';
  @HostBinding('style.--textColorHover') textColorHoverCssVariable = '';

  protected fontSize: string = "16px";

  constructor(){}

  ngOnInit(){
    if(this.styleInfos != null){
      if(this.styleInfos.borderColor != null)  this.borderColorCssVariable = this.styleInfos.borderColor;
      if(this.styleInfos.borderColorActive != null)  this.borderColorActiveCssVariable = this.styleInfos.borderColorActive;

      this.backgroundColorActiveCssVariable = this.styleInfos.backgroundColorActive;
      if(this.styleInfos.backgroundColor != null)  this.backgroundColorCssVariable = this.styleInfos.backgroundColor;
      this.textColorCssVariable = this.styleInfos.color;
      this.textColorHoverCssVariable = this.styleInfos.colorActive;
      if(this.styleInfos.fontSize != null) this.fontSize = this.styleInfos.fontSize;
      if(this.styleInfos.radius != null) this.borderRadiusCssVariable = this.styleInfos.radius;
      if(this.styleInfos.cursor != null) this.cursorCssVariable = this.styleInfos.cursor;
      if(this.styleInfos.heightIcon != null) this.heightCssVariable = this.styleInfos.heightIcon;
    }
  }

  ngOnChanges(){
    if(this.styleInfos != null){
      if(this.styleInfos.borderColor != null)  this.borderColorCssVariable = this.styleInfos.borderColor;
      if(this.styleInfos.borderColorActive != null)  this.borderColorActiveCssVariable = this.styleInfos.borderColorActive;

      this.backgroundColorActiveCssVariable = this.styleInfos.backgroundColorActive;
      if(this.styleInfos.backgroundColor != null)  this.backgroundColorCssVariable = this.styleInfos.backgroundColor;
      this.textColorCssVariable = this.styleInfos.color;
      this.textColorHoverCssVariable = this.styleInfos.colorActive;
      if(this.styleInfos.fontSize != null) this.fontSize = this.styleInfos.fontSize;
      if(this.styleInfos.radius != null) this.borderRadiusCssVariable = this.styleInfos.radius;
      if(this.styleInfos.cursor != null) this.cursorCssVariable = this.styleInfos.cursor;
      if(this.styleInfos.heightIcon != null) this.heightCssVariable = this.styleInfos.heightIcon;
    }
  }
}
