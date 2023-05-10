import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() type !: string;
  @Output() file: EventEmitter<any> = new EventEmitter();

  setPicture(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
          this.file.emit({
            img: _event.target.result,
            infos: event.target.files[0]
          });
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }
}
