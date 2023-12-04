import { Component, HostBinding, Input } from '@angular/core';
import { InputInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.scss']
})
export class TextfieldComponent {
  @Input() styleInfo!: InputInfos;
  @Input() text: string = "";
  @Input() value: string | number = "";


  @HostBinding('style.--backgroundColor') backgroundColor: string = 'var(--white)';
  @HostBinding('style.--borderColor') borderColor: string = 'var(--black)';
  @HostBinding('style.--borderColorActive') borderColorActive: string = 'var(--mainColor)';
  @HostBinding('style.--textColor') textColor: string = 'var(--black)';
  @HostBinding('style.--placeholderColor') placeholderColor: string = 'var(--black)';
  @HostBinding('style.--placeholderColorActive') placeholderColorActive: string = 'var(--mainColor)';
  @HostBinding('style.--fontSize') fontSize: string = '16px';

  protected type: string = "text";


  constructor(){}

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
  }

  ngOnChanges(){
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
  }

  setValue(event: any){
    this.value = event.target.value;
  }
}
