import { Component, Input, OnInit } from '@angular/core';
import { CardParams } from '../model/cardParams';
import { TypePicture } from '../model/typePicture';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private place: PlacesService) { }

  @Input() params!: CardParams;

  ngOnInit(): void {
    if(this.params.data.note_globale == null)console.log(this.params.data)
    this.setTypePictures();
  }

  setTypePictures(): void{
    if(this.params.pictures.length === 0 ){
      const iconType = this.place.getTypeIcon(this.params.data.type);
      this.params.pictures.push({
        id: "",
        id_place: "",
        src: iconType
      });
    }
  }

}
