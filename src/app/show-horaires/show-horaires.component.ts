import { Component, Input, OnInit } from '@angular/core';
import { Horaires } from '../model/horaires';

@Component({
  selector: 'show-horaires',
  templateUrl: './show-horaires.component.html',
  styleUrls: ['./show-horaires.component.scss']
})
export class ShowHorairesComponent {

  @Input() horaires!: Horaires[];
  @Input() color: string = "";
  constructor() { }

}
