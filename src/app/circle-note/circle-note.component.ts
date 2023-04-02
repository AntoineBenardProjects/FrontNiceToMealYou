import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'circle-note',
  templateUrl: './circle-note.component.html',
  styleUrls: ['./circle-note.component.scss']
})
export class CircleNoteComponent implements OnInit {

  @Input() note: number = 0;
  @Input() colorNote: string = "";
  @Input() unit: string = "";
  @Input() mainColor: string = "";
  @Input() strokeWidth: number = 0;
  constructor() { }

  fontSizeNote: string = "";
  fontSizeUnit: string = "";
  id: string = "";

  ngOnInit(): void {
    this.id = this.setRandomId();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      const circle = document.getElementById(this.id);
      this.fontSizeNote = (circle?.offsetHeight!/3).toString() + "px";
      this.fontSizeUnit = (circle?.offsetHeight!/6).toString() + "px";  
    },0);
  }

  setRandomId(){
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }

}
