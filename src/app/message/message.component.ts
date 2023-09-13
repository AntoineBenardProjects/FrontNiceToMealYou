import { Component, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  constructor() {}

  @Input() message: string = "";
  @Input() valid: boolean = false;

}
