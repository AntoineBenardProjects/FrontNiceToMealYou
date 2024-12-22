import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { ChangeBackgroundColorComponentInfos, ChangeBackgroundColorInfos } from 'src/app/shared/model/displayValues/general';

@Component({
  selector: 'change-background-buttons',
  templateUrl: './change-background-buttons.component.html',
  styleUrls: ['./change-background-buttons.component.scss']
})
export class ChangeBackgroundButtonsComponent {

  @Output() onBackgroundChange: EventEmitter<ChangeBackgroundColorComponentInfos> = new EventEmitter();
  
  protected selectionableColors:ChangeBackgroundColorInfos[] = selectionableColors;
  protected backgroundColor: ChangeBackgroundColorInfos = {
    color: "var(--white)",
    logoToShow: "mainColor",
  };
  @HostBinding('style.--textColor') textColor: string = "var(--black)";
  protected secondComplementaryColor: string = "var(--secondColor)";
  protected complementaryColor: string = "var(--mainColor)";

  constructor(){}

  ngOnInit(){
    const toSend: ChangeBackgroundColorComponentInfos = new ChangeBackgroundColorComponentInfos(
      this.backgroundColor,
      this.textColor,
      this.complementaryColor,
      this.secondComplementaryColor
    );
    this.onBackgroundChange.next(toSend);
  }

  protected changeBackgroundColor(color: ChangeBackgroundColorInfos){
    this.backgroundColor = color;
    if(this.backgroundColor.color === 'var(--white)'){
      this.complementaryColor = 'var(--mainColor)';
      this.secondComplementaryColor = 'var(--secondColor)';
      this.textColor = 'var(--black)';
    } else if(this.backgroundColor.color === 'var(--secondColor)'){
      this.complementaryColor = 'var(--black)';
      this.secondComplementaryColor = 'var(--white)';
      this.textColor = 'var(--white)';
    } else if(this.backgroundColor.color === 'var(--mainColor)'){
      this.complementaryColor = 'var(--black)';
      this.secondComplementaryColor = 'var(--mainColor)';
      this.textColor = 'var(--white)';
    } else if(this.backgroundColor.color === 'var(--black)'){
      this.complementaryColor = 'var(--white)';
      this.secondComplementaryColor = 'var(--mainColor)';
      this.textColor = 'var(--white)';
    }
    const toSend: ChangeBackgroundColorComponentInfos = new ChangeBackgroundColorComponentInfos(
      this.backgroundColor,
      this.textColor,
      this.complementaryColor,
      this.secondComplementaryColor
    );
    this.onBackgroundChange.next(toSend);

  }
}

export const selectionableColors: ChangeBackgroundColorInfos[] = [
  {
    color: "var(--white)",
    logoToShow: "mainColor",
  },
  {
    color: "var(--mainColor)",
    logoToShow: "mainColor_reverse",
  },
  {
    color: "var(--secondColor)",
    logoToShow: "secondColor_reverse",
  },
  {
    color: "var(--black)",
    logoToShow: "black_reverse",
  },
]