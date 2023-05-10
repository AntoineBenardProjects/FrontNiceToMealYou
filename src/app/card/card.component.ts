import { Component, Input, OnInit } from '@angular/core';
import { CardParams } from '../model/cardParams';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { PlacesService } from '../services/places.service';
import { DatabaseService } from '../services/database.service';
import { Liked } from '../model/liked';
import { Station } from '../model/station';
import { LigneInStation } from '../model/ligneInStation';
import { Ligne } from '../model/ligne';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private place: PlacesService, private data: DatabaseService, private router: Router) { }

  @Input() params!: CardParams;
  public ligneStations: LigneInStation[] = [];

  heartIcon = solidHeart;
  like: boolean = false;

  ngOnInit(): void {
    this.setTypePictures();
    let id: string = "";
    id = localStorage.getItem("id");
    this.data.getLikesOfUser(id).subscribe((res: Liked[]) => {
      const find = res.find((element: Liked) => element.id_place === this.params.data.id);
      if(find != null)  this.like = true;
    });
    this.params.stationsInPlace.forEach((station: Station) => {
      this.data.getLignesOfStation(station.name).subscribe((lignes: Ligne[]) => {
        lignes.forEach((ligne: Ligne) => {
          this.ligneStations.push({
            name_ligne: ligne.name,
            name_station: station.name
          });
        });
      });
    });
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

  navigate(): void{
    if(this.router.url === "/restaurants" || this.router.url === "/bars" ||this.router.url === "/loisirs"){
      this.place.saveFilters(this.params.data.id);
    } else{
      this.router.navigate(['/showed',this.params.data.id]);
    }
  }

}
