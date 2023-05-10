import { Component, Input } from '@angular/core';

@Component({
  selector: 'graph-bar',
  templateUrl: './graph-bar.component.html',
  styleUrls: ['./graph-bar.component.scss']
})
export class GraphBarComponent {
  @Input()  quantity: number;
  @Input()  quality: number;
  @Input()  quality_price: number;
  @Input()  note_deco: number;

  colorQuantity: string = "white";
  colorQuality: string = "white";
  colorQualityPrice: string = "white";
  colorDeco: string = "white";


  constructor(){}

  ngOnInit(){
    this.colorQuantity = this.setColors(this.quantity);
    this.colorQuality = this.setColors(this.quality);
    this.colorQualityPrice = this.setColors(this.quality_price);
    this.colorDeco = this.setColors(this.note_deco);
  }

  setColors(note): string{
    let color: string = "";
    if(note >= 8) color = "#4D8B31"
    else if(note >= 6 && note < 8) color = "#FFC800" 
    else if(note >= 4.5 && note < 6) color = "#FF8427" 
    else color = "#6A2E35" 

    return color;
  }
}
