import { Component, HostBinding, Input, SimpleChanges } from '@angular/core';
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

  @HostBinding('style.--width') width = '';
  @HostBinding('style.--heightCssVariable') heightCssVariable = '100%';
  @HostBinding('style.--cursorCssVariable') cursorCssVariable = 'pointer';
  @HostBinding('style.--borderRadiusCssVariable') borderRadiusCssVariable = '5px';
  @HostBinding('style.--borderColor') borderColorCssVariable = 'transparent';
  @HostBinding('style.--borderColorActive') borderColorActiveCssVariable = 'transparent';
  @HostBinding('style.--borderWidth') borderWidth = '2px';
  @HostBinding('style.--backgroundColor') backgroundColorCssVariable = 'transparent';
  @HostBinding('style.--backgroundColorActive') backgroundColorActiveCssVariable = '';
  @HostBinding('style.--textColor') textColorCssVariable = '';
  @HostBinding('style.--textColorHover') textColorHoverCssVariable = '';

  protected fontSize: string = "16px";
  private animationMade: boolean = false;
  constructor(){}

  ngOnInit(){
    if(this.styleInfos != null){
      if(this.styleInfos.animationWidth == null){
        if(this.styleInfos.heightIcon != null){ 
          this.width = this.styleInfos.heightIcon;
          this.heightCssVariable = this.styleInfos.heightIcon;
        } else{
          this.width = '100%'
        }
        this.textColorCssVariable = this.styleInfos.color;
      }
      if(this.styleInfos.animationWidth === false){
        this.width = "0%";
        this.textColorCssVariable = "transparent";
      } else if(this.styleInfos.animationWidth){
        this.animationMade = true;
        setTimeout(() => {
          this.width = "100%";
          setTimeout(() => {
            this.textColorCssVariable = this.styleInfos.color;
          },800)
        }, 100);
      }
      if(this.styleInfos.borderColor != null)  this.borderColorCssVariable = this.styleInfos.borderColor;
      if(this.styleInfos.borderColorActive != null)  this.borderColorActiveCssVariable = this.styleInfos.borderColorActive;

      this.backgroundColorActiveCssVariable = this.styleInfos.backgroundColorActive;
      if(this.styleInfos.backgroundColor != null)  this.backgroundColorCssVariable = this.styleInfos.backgroundColor;
      this.textColorHoverCssVariable = this.styleInfos.colorActive;
      if(this.styleInfos.fontSize != null) this.fontSize = this.styleInfos.fontSize;
      if(this.styleInfos.radius != null) this.borderRadiusCssVariable = this.styleInfos.radius;
      if(this.styleInfos.cursor != null) this.cursorCssVariable = this.styleInfos.cursor;
      if(this.styleInfos.borderWidth != null) this.borderWidth = this.styleInfos.borderWidth;
    }
  }

  ngOnChanges(changes: SimpleChanges) : void{
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'styleInfos':{
            if(changes[propName].currentValue !== changes[propName].previousValue){
              if(this.styleInfos.animationWidth == null){
                if(this.styleInfos.heightIcon != null){ 
                  this.width = this.styleInfos.heightIcon;
                  this.heightCssVariable = this.styleInfos.heightIcon;
                } else{
                  this.width = '100%'
                }
                this.textColorCssVariable = this.styleInfos.color;
              }
              
              if(this.styleInfos.animationWidth === false && !this.animationMade){
                this.width = "0%";
                this.textColorCssVariable = "transparent";
              } else if(this.styleInfos.animationWidth && !this.animationMade){
                this.animationMade = true;
                setTimeout(() => {
                  this.width = "100%";
                  setTimeout(() => {
                    this.textColorCssVariable = this.styleInfos.color;
                  },800)
                }, 100);
              }
              if(this.styleInfos.borderColor != null)  this.borderColorCssVariable = this.styleInfos.borderColor;
              if(this.styleInfos.borderColorActive != null)  this.borderColorActiveCssVariable = this.styleInfos.borderColorActive;
        
              this.backgroundColorActiveCssVariable = this.styleInfos.backgroundColorActive;
              if(this.styleInfos.backgroundColor != null)  this.backgroundColorCssVariable = this.styleInfos.backgroundColor;
              this.textColorHoverCssVariable = this.styleInfos.colorActive;
              if(this.styleInfos.fontSize != null) this.fontSize = this.styleInfos.fontSize;
              if(this.styleInfos.radius != null) this.borderRadiusCssVariable = this.styleInfos.radius;
              if(this.styleInfos.cursor != null) this.cursorCssVariable = this.styleInfos.cursor;        
              if(this.styleInfos.borderWidth != null) this.borderWidth = this.styleInfos.borderWidth;
            }
          }
          break;
        }
      }
    }
  }
}
