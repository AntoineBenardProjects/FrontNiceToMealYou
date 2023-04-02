import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'show-lignes',
  templateUrl: './show-lignes.component.html',
  styleUrls: ['./show-lignes.component.scss']
})
export class ShowLignesComponent implements OnInit {

  @Input() lignes: Map<string,string> = new Map();
  @Input() allLignes: any[] = [];
  @Input() result: any = null;
  station: string = "";
  constructor() { }

  ngOnInit(): void {}

  changeToolTip(ligne: any,restaurant: any){
    if(restaurant.lignes.get(ligne) != undefined)  this.station = restaurant.lignes.get(ligne)!;
    else this.station = "";
  }
}
