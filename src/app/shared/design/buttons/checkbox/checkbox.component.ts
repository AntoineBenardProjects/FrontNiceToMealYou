import { Component, EventEmitter, HostBinding, Input, Output, SimpleChanges } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { info } from 'console';
import { CheckboxInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input() styleInfos: CheckboxInfos;
  @Input() value: boolean = false;
  @Output() checked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('style.--backgroundColor') backgroundColor = 'var(--black)';
  @HostBinding('style.--color') color = 'var(--white)';
  @HostBinding('style.--borderColor') borderColor = 'var(--black)';
  @HostBinding('style.--hoverBackgroundColor') hoverBackgroundColor = 'var(--black)';
  @HostBinding('style.--hoverColor') hoverColor = 'var(--white)';
  @HostBinding('style.--hoverBorderColor') hoverBorderColor = 'var(--black)';

  protected textColor: string = "var(--black)";
  protected text: string = "N";

  ngOnInit(){
    if(this.styleInfos != null){
      this.backgroundColor = this.styleInfos.backgroundColor;
      this.color = this.styleInfos.color;
      this.borderColor = this.styleInfos.borderColor;
      this.hoverBackgroundColor = this.styleInfos.hoverBackgroundColor;
      this.hoverBorderColor = this.styleInfos.hoverBorderColor;
      this.hoverColor = this.styleInfos.hoverTextColor;
    }
  }

  ngOnChanges(changes: SimpleChanges){
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'value': {
            if(this.value){
              this.text = "O";
              if(this.styleInfos.hoverBackgroundColorValid != null) this.hoverBackgroundColor = this.styleInfos.hoverBackgroundColorValid;
              if(this.styleInfos.hoverBorderColorValid != null) this.hoverBorderColor = this.styleInfos.hoverBorderColorValid;
              if(this.styleInfos.hoverTextColorValid != null) this.hoverColor = this.styleInfos.hoverTextColorValid;
            } else{
              this.text = "N";
              if(this.styleInfos.hoverBackgroundColor != null) this.hoverBackgroundColor = this.styleInfos.hoverBackgroundColor;
              if(this.styleInfos.hoverBorderColor != null) this.hoverBorderColor = this.styleInfos.hoverBorderColor;
              if(this.styleInfos.hoverTextColor != null) this.hoverColor = this.styleInfos.hoverTextColor;
            }
            this.setColor();
          }
          break;
        }
      }
    }
  }

  setValue(){
    this.value = !this.value;
    if(this.value){
      this.text = "O";
      if(this.styleInfos.hoverBackgroundColorValid != null) this.hoverBackgroundColor = this.styleInfos.hoverBackgroundColorValid;
      if(this.styleInfos.hoverBorderColorValid != null) this.hoverBorderColor = this.styleInfos.hoverBorderColorValid;
      if(this.styleInfos.hoverTextColorValid != null) this.hoverColor = this.styleInfos.hoverTextColorValid;
    } else{
      this.text = "N";
      if(this.styleInfos.hoverBackgroundColor != null) this.hoverBackgroundColor = this.styleInfos.hoverBackgroundColor;
      if(this.styleInfos.hoverBorderColor != null) this.hoverBorderColor = this.styleInfos.hoverBorderColor;
      if(this.styleInfos.hoverTextColor != null) this.hoverColor = this.styleInfos.hoverTextColor;
    }
    this.setColor();
    this.checked.next(this.value);
  }

  setColor(){
    if(!this.value){
      this.backgroundColor = this.styleInfos.backgroundColor;
      this.color = this.styleInfos.color;
      this.borderColor = this.styleInfos.borderColor;
    } else{
      this.backgroundColor = this.styleInfos.backgroundColorActive;
      this.color = this.styleInfos.colorActive;
      this.borderColor = this.styleInfos.borderColorActive;
    }
  }
}
