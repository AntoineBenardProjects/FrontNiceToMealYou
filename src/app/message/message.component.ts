import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: string) {}

  message: string = "";

  ngOnInit(){
    this.message = this.data;
  }
}
