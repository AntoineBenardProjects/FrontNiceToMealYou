import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ButtonInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() styleInfos: ButtonInfos;
  @Input() type !: string;
  @Output() file: EventEmitter<string> = new EventEmitter();
  @Output() json: EventEmitter<any> = new EventEmitter();
  @HostBinding('style.--heightCssVariable') heightCssVariable = '100%';
  @HostBinding('style.--cursorCssVariable') cursorCssVariable = 'pointer';
  @HostBinding('style.--borderRadiusCssVariable') borderRadiusCssVariable = '5px';
  @HostBinding('style.--borderColor') borderColorCssVariable = 'transparent';
  @HostBinding('style.--borderColorActive') borderColorActiveCssVariable = 'transparent';
  @HostBinding('style.--backgroundColor') backgroundColorCssVariable = 'transparent';
  @HostBinding('style.--backgroundColorActive') backgroundColorActiveCssVariable = '';
  @HostBinding('style.--textColor') textColorCssVariable = '';
  @HostBinding('style.--textColorHover') textColorHoverCssVariable = '';

  constructor(){}

  ngOnInit(){
    if(this.styleInfos != null){
      if(this.styleInfos.borderColor != null)  this.borderColorCssVariable = this.styleInfos.borderColor;
      if(this.styleInfos.borderColorActive != null)  this.borderColorActiveCssVariable = this.styleInfos.borderColorActive;

      this.backgroundColorActiveCssVariable = this.styleInfos.backgroundColorActive;
      if(this.styleInfos.backgroundColor != null)  this.backgroundColorCssVariable = this.styleInfos.backgroundColor;
      this.textColorCssVariable = this.styleInfos.color;
      this.textColorHoverCssVariable = this.styleInfos.colorActive;
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
      if(this.styleInfos.radius != null) this.borderRadiusCssVariable = this.styleInfos.radius;
      if(this.styleInfos.cursor != null) this.cursorCssVariable = this.styleInfos.cursor;
      if(this.styleInfos.heightIcon != null) this.heightCssVariable = this.styleInfos.heightIcon;
    }
  }

  setPicture(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
          this.file.emit(_event.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  setFile(event: any) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      const result: string = fileReader.result as string;
      this.json.emit(JSON.parse(result));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  ngOnDestroy(){}
}
