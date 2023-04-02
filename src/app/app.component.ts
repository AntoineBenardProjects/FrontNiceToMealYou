import { Component } from '@angular/core';
// import { Address } from './model/address';
// import { Bar } from './model/bar';
// import { Comment } from './model/comment';
// import { Horaires } from './model/horaires';
// import { Ligne } from './model/ligne';
// import { LigneInStation } from './model/ligneInStation';
// import { Pictures } from './model/pictures';
// import { Restaurant } from './model/restaurant';
// import { StationInPlace } from './model/stationInPlace';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuOpened : boolean = false;
  // token: String = "";
  // getToken: any;
  //////////////////////  Migration de Firebase vers Nodejs //////////////////////
  // private allRestaurant: Restaurant[] = [];
  //     private allComments: Comment[] = [];
  //     private allAddress: Address[] = [];
  //     private allPictures: Pictures[] = [];
  //     private allStationsInPlace: StationInPlace[] = [];
  //     private allBars: Bar[] = [];
  //     private allHoraires: Horaires[] = [];
  //     private allLigneInStation: LigneInStation[] = [];
  //     private allLignes: Ligne[] = [];


  constructor(private auth: AuthService, private databaseService: DatabaseService){
    auth.isAuthenticated().subscribe(authenticationState => {
      if(authenticationState) this.menuOpened = true;
      else  this.menuOpened = false;
    });
  }

  ngOnInit(){
    //////////////////////  Migration de Firebase vers Nodejs //////////////////////
    // this.dataService.getAllRestaurants().subscribe(res => {
    //   res.forEach((element:any) => {
    //     const convert = this.convertToRes(element);
    //     const comment = this.getComment(element);
    //     const address = this.getAddress(element);
    //     if(element.plat.length > 0){
    //       const picture = this.getPictures(element.id,element.plat);
    //       this.allPictures.push(picture);
    //     }
    //     this.allStationsInPlace.push(...this.getStationsInPlace(element));
    //     this.allAddress.push(address);
    //     this.allComments.push(...comment);
    //     this.allRestaurant.push(convert);
    //   });
    //   this.dataService.getAllBars().subscribe(bar => {
    //     bar.forEach((b: any) => {
    //       const convert = this.convertToBar(b);
    //       const comment = this.getComment(b);
    //       const address = this.getAddress(b);
    //       this.allStationsInPlace.push(...this.getStationsInPlace(b));
    //       this.allAddress.push(address);
    //       this.allComments.push(...comment);
    //       this.allBars.push(convert);
    //     });
    //     this.dataService.getAllHoraires().subscribe(hor => {
    //       hor.forEach((h:any) => {
    //         this.allHoraires.push(...this.getHoraires(h));
    //       });
    //       this.dataService.getAllMetro().subscribe(met => {
    //         met.forEach((m:any) => {
    //           this.allLigneInStation.push(...this.getStationsInLigne(m));
    //         });
    //       });
    //     });
    //   });
    // });

  }

  //////////////////////  Migration de Firebase vers Nodejs //////////////////////

  changeData(){
    // this.allBars.forEach((add: Bar) => {
    //   this.databaseService.addBar(add,[],[],[],[]);
    // });
    // this.allRestaurant.forEach((add: Restaurant) => {
    //   this.databaseService.addRestaurant(add,[],[],[],[]);
    // });
    // this.allHoraires.forEach((add: Horaires) => {
    //     this.databaseService.addHoraires(add);
    // });
    // this.allAddress.forEach((add: Address) => {
    //     this.databaseService.addAddress(add);
    // });
    // this.allComments.forEach((add: Comment) => {
    //   this.databaseService.addComment(add);
    // });
    // this.allStationsInPlace.forEach((add:StationInPlace) => {
    //   this.databaseService.addStationinPlace(add);
    // });
    // this.allLigneInStation.forEach((add:LigneInStation) => {
    //   this.databaseService.addLigneInStation(add);
    // });
    // this.allLignes.forEach((add:Ligne) => {
    //   this.databaseService.addLigne(add);
    // });
    // this.allPictures.forEach((add: Pictures) => {
    //   this.databaseService.addPicture(add);
    // });
  }
  // getStationsInLigne(met:any){
  //   let allLigneInStation: LigneInStation[] = [];
  //   met.Stations.forEach((element: string) => {
  //     allLigneInStation.push({
  //       name_ligne: met.ligne,
  //       name_station: element
  //     });
  //     this.allLignes.push({name:met.ligne});
  //   });
  //   return allLigneInStation;
  // }
  // getStationsInPlace(res: any){
  //   let stations: StationInPlace[] = [];
  //   res.stations.forEach((station: any) => {
  //     const stat: StationInPlace = {
  //       id: "",
  //       id_place: res.id,
  //       name_station: station
  //     }
  //     stations.push(stat);
  //   });
  //   return stations;
  // }
  // getHoraires(hor: any){
  //   const horaires: Horaires[] = [
  //     {
  //       id: "",
  //       day: "lundi",
  //       ouverture: hor.lundi[0],
  //       fermeture_midi: hor.lundi[1],
  //       ouverture_soir: hor.lundi[2],
  //       fermeture: hor.lundi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "mardi",
  //       ouverture: hor.mardi[0],
  //       fermeture_midi: hor.mardi[1],
  //       ouverture_soir: hor.mardi[2],
  //       fermeture: hor.mardi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "mercredi",
  //       ouverture: hor.mercredi[0],
  //       fermeture_midi: hor.mercredi[1],
  //       ouverture_soir: hor.mercredi[2],
  //       fermeture: hor.mercredi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "jeudi",
  //       ouverture: hor.jeudi[0],
  //       fermeture_midi: hor.jeudi[1],
  //       ouverture_soir: hor.jeudi[2],
  //       fermeture: hor.jeudi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "vendredi",
  //       ouverture: hor.vendredi[0],
  //       fermeture_midi: hor.vendredi[1],
  //       ouverture_soir: hor.vendredi[2],
  //       fermeture: hor.vendredi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "samedi",
  //       ouverture: hor.samedi[0],
  //       fermeture_midi: hor.samedi[1],
  //       ouverture_soir: hor.samedi[2],
  //       fermeture: hor.samedi[3],
  //       id_place: hor.id
  //     },
  //     {
  //       id: "",
  //       day: "dimanche",
  //       ouverture: hor.dimanche[0],
  //       fermeture_midi: hor.dimanche[1],
  //       ouverture_soir: hor.dimanche[2],
  //       fermeture: hor.dimanche[3],
  //       id_place: hor.id
  //     },
  //   ]    
  //   return horaires;
  // }
  // getPictures(id: string,src: string){
  //   const picture: Pictures = {
  //     id: "",
  //     src: src,
  //     id_place: id
  //   };
  //   return picture;
  // }
  // getComment(res: any){
  //   let comments: Comment[] = [];
  //   res.positif.forEach((detail:string) => {
  //     if(detail.length > 0){
  //       const comment: Comment = {
  //         id:"",
  //         positif: true,
  //         detail: detail,
  //         id_place: res.id
  //       }
  //       comments.push(comment);
  //     }
  //   });
  //   res.negatif.forEach((detail:string) => {
  //     if(detail.length > 0){
  //       const comment: Comment = {
  //         id:"",
  //         positif: false,
  //         detail: detail,
  //         id_place: res.id
  //       }
  //       comments.push(comment);
  //     }
  //   });
  //   return comments;
  // }
  // getAddress(res: any){
  //   const address: Address = {
  //     id: "",
  //     address: res.address,
  //     code_postal: this.convertInCodePostal(res.arrondissement),
  //     id_place: res.id
  //   };
  //   return address
  // }
  // convertToRes(res: any){
  //   let note: number;
  //   if(res.note !== '')  note = Number(res.note);
  //   else  note = Number(res.priority);
  //   const restaurant: Restaurant = {
  //     id: res.id,
  //     name: res.name,
  //     facade: res.img,
  //     comment: res.comment,
  //     note_quantity: 0,
  //     arrondissement: res.arrondissement,
  //     quality_price: 0,
  //     note_deco: res.note_deco,
  //     note_globale: note,
  //     tested: false,
  //     quality: 0,
  //     price: Number(res.price),
  //     liked: false,
  //     type: res.type,
  //     the_fork: res.theFork
  //   }
  //   return restaurant;
  // }
  // convertToBar(bar: any){
  //   let note: number;
  //   if(bar.note !== '')  note = Number(bar.note);
  //   else  note = Number(bar.priority);

  //   const newBar: Bar = {
  //     id: bar.id,
  //     name: bar.name,
  //     facade: bar.img,
  //     comment: bar.comment,
  //     arrondissement: bar.arrondissement,
  //     quality_price: 0,
  //     note_deco: bar.note_deco,
  //     note_globale: note,
  //     tested: false,
  //     quality: 0,
  //     price: bar.price,
  //     liked: false,
  //     type: bar.ambiance,
  //   }
  //   return newBar;
  // }
  // convertInCodePostal(arr: number){
  //   let code_postal = "";
  //   if(arr < 10){
  //     code_postal = "7500" + arr.toString();
  //   } else  code_postal = "750" + arr.toString();
  //   return code_postal;
  // }
}
