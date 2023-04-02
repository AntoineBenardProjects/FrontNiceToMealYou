import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Liked } from '../model/liked';
import { Station } from '../model/station';
import { StationOfUser } from '../model/stationOfUser';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  constructor(private data: DatabaseService){}

  public id: string = localStorage.getItem("id");
  public img: string = localStorage.getItem("img");
  public login: string = localStorage.getItem("login");

  public allStations: Station[] = [];
  public filteredData: Station[] = [];

  ngOnInit(){
    this.data.getLikesOfUser(this.id).subscribe((likes: Liked[]) => {
      console.log(likes);
    });
    this.data.getStationsOfUser(this.id).subscribe((station: StationOfUser[]) => {
      console.log(station);
    });
    this.data.getAllStations().subscribe((station: Station[]) => {
      this.allStations = station;
    });
  }

  filter(searchTerm: string) {
    if(searchTerm.length === 0) this.filteredData = [];
    else{
      this.filteredData = this.allStations.filter((element: Station) => {
        const name: string = element.name.toLowerCase();
        if(name.includes(searchTerm.toLowerCase()))  return true;
        else  return false;
      });
    }
  }
}
