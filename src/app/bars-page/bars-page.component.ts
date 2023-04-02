import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Data } from 'src/data';
import { Address } from '../model/address';
import { Bar } from '../model/bar';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';
import { Horaires } from '../model/horaires';
import { Ligne } from '../model/ligne';
import { LigneInStation } from '../model/ligneInStation';
import { Pictures } from '../model/pictures';
import { Restaurant } from '../model/restaurant';
import { StationInPlace } from '../model/stationInPlace';
import { TypePicture } from '../model/typePicture';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-bars-page',
  templateUrl: './bars-page.component.html',
  styleUrls: ['./bars-page.component.scss']
})
export class BarsPageComponent implements OnInit {

  constructor(private data: DatabaseService,private placeService: PlacesService) { }
  cardParams: CardParams[] = [];
  circleNoteParams: CircleNoteParams
  allPictures: Pictures[] = [];
  randomPosition: any[] = [];

  types:string[] = [];
  typesSelect:string[] = [];
  arrondissements: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  lignes: Ligne[] = [];
  selectAll: boolean = false;
  station: string = "Aucun";
  openedOptions: string[] = ["Ouvert","Fermé"];

  @ViewChild('allType') allType: MatSelect | undefined;
  @ViewChild('allLigne') allLigne: MatSelect | undefined;
  @ViewChild('allArrondissement') allArrondissement: MatSelect | undefined;
  @ViewChild('opened') opened: MatSelect | undefined;



  ngOnInit(): void {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.circleNoteParams = {
        radius: 20,
        titleFontSize: (windowWidth/30).toString(),
        subtitleFontSize : (windowWidth/40).toString(),
        strokeWidth : 0.5
      }
    } else{
      this.circleNoteParams = {
        radius: 30,
        titleFontSize: (windowWidth/60).toString(),
        subtitleFontSize : (windowWidth/100).toString(),
        strokeWidth : 1
      }
    }

    this.cardParams = [];
    this.types = [];
    Data.forEach((type: TypePicture) => {
      if(type.place === "Bar")  this.types.push(type.type);
    });
    this.data.getAllBars().subscribe((bars: Bar[]) => {
      this.setCardParams(bars)
    });
    this.data.getAllPictures().subscribe((pictures: Pictures[]) => {
      this.allPictures = pictures;
      this.setRandomPosition();
    });
    this.data.getAllLignes().subscribe((lignes: Ligne[]) => {
      this.lignes = lignes;
    });
    this.typesSelect = [];
  }

  ngAfterViewChecked(){
    this.allLigne.options.forEach(element => element.select());
  }
  setRandomPosition(){
    this.allPictures.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  toggleAllType() {
    if(this.allType != null){
      if (!this.selectAll) {
        this.allType.options.forEach(element => element.select());
      } else {
        this.allType.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllLigne() {
    if(this.allLigne != null){
      if (!this.selectAll) {
        this.allLigne.options.forEach(element => element.select());
      } else {
        this.allLigne.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllArrondissement() {
    if(this.allArrondissement != null){
      if (!this.selectAll) {
        this.allArrondissement.options.forEach(element => element.select());
      } else {
        this.allArrondissement.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  setCardParams(data: any[]){
    this.cardParams = [];
    data.forEach((place: Bar) => {
      let statInPlace: StationInPlace[] = [];
      let lignesInStat: LigneInStation[] = [];
      let params: CardParams = {
        pictures: [],
        circleNoteParams: this.circleNoteParams,
        stationsInPlace: [],
        lignesInStation: [],
        addresses: [],
        horaires: [],
        data: place
      }
      this.data.getStationsOfPlace(place.id).subscribe(res => {
        statInPlace.push(...res);
        params.stationsInPlace = statInPlace;
        this.data.getPicturesOfPlace(place.id).subscribe((pic:Pictures[]) => {
          params.pictures = pic;
          this.data.getAddressOfPlace(place.id).subscribe((addresses: Address[]) =>{
            params.addresses = addresses;
            this.data.getHorairesOfPlace(place.id).subscribe((horaires: Horaires[]) => {
              params.horaires = horaires;
              res.forEach((station: StationInPlace,index: number) => {
                this.data.getLignesOfStation(station.name_station).subscribe((ligne: LigneInStation[]) => {
                  lignesInStat.push(...ligne);
                  params.lignesInStation = lignesInStat;
                  if(index === res.length -1) this.cardParams.push(params);
                });
              });
            });
          });
        });
      });
    });
  }

  setupClose(event: boolean){
    if(!event){
      this.sort();
    }
  }

  sort(){
    this.cardParams = [];
    let arr: any[] = [];
    let types: any[] = [];
    let lignes: any[] = [];
    let op: any[] = [];

    this.allLigne?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        lignes.push(element.value);
      }
    })
    this.allArrondissement?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        arr.push(element.value);
      }
    });

    this.allType?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        types.push(element.value);
      }
    });

    this.opened?.options.forEach(element => {
      if(element.value !== "0" && element.selected){
        op.push(element.value);
      }
    });
    if(op.length == 0)  op = ["Ouvert","Fermé"];

    let allBars: Bar[] = [];
    let getAllBarsFiltered: Subject<Bar[]> = new Subject();
    let getAllBarsByLigne: Subject<Bar[]> = new Subject();
    let getAllBarsBeforeHoraires: Subject<Bar[]> = new Subject();

    lignes.forEach((ligne: Ligne,index: number) => {
      if(index > 0){
        this.data.getBarsByLigne(ligne.name,null).subscribe((bars: Bar[]) => {
          allBars.push(...bars);
          if(index === lignes.length -1){
            getAllBarsByLigne.next(allBars);
          }
        });
      }
    });

    getAllBarsByLigne.subscribe((bars: Bar[]) => {
      let filteredByTypeAndArrBar: Bar[] = [];
      bars.forEach((bar:Bar, index: number) => {
        let pushArr = false;
        let pushType = false;
        if(arr.length === 0)  pushArr = true;
        if(types.length === 0)  pushType = true;
        arr.forEach(a => {
          if(bar.arrondissement === a)  pushArr = true;
        });
        types.forEach(t => {
          if(bar.type === t)  pushType = true;
        });
        if(pushArr && pushType) filteredByTypeAndArrBar.push(bar);
        if(index === allBars.length -1) getAllBarsBeforeHoraires.next(filteredByTypeAndArrBar);
      });
    });

    getAllBarsBeforeHoraires.subscribe((bars: Bar[]) => {
      let filteredBar: Bar[] = [];
      bars.forEach((bar: Bar, index: number) => {
        let pushOp = false;
        this.data.getHorairesOfPlace(bar.id).subscribe((horaires: Horaires[]) => {
          op.forEach(o => {
            let bool = true;
            if(o === "Fermé") bool = false;
            const isOpened: boolean = this.placeService.isOpened(horaires);
            if(isOpened === bool) pushOp = true;
          });
          if(pushOp) filteredBar.push(bar);
          if(index === bars.length -1){
            filteredBar = this.placeService.removeDuplicate(filteredBar);
            getAllBarsFiltered.next(filteredBar);
          }
        });
      });
    });

    getAllBarsFiltered.subscribe((bars: Bar[]) => {
      this.setCardParams(bars);
    });

    
  }

  sortByOrder(){
    this.cardParams.sort(this.compareOrder);
  }

  sortByNote(){
    this.cardParams.sort(this.compareNote);
  }

  compareNote(a: CardParams,b: CardParams){
    let comparison = 0;
    if(a.data.note_globale > b.data.note_globale) comparison = -1;
    else  comparison = 1;

    return comparison;
  }

  compareOrder(a: CardParams,b: CardParams){
    let comparison = 0;
    if(a.data.name.toUpperCase() > b.data.name.toUpperCase()) comparison = 1;
    else  comparison = -1;

    return comparison;
  }

  changeToolTip(ligne: any,bar: any){
    if(bar.lignes.get(ligne) != undefined)  this.station = bar.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

}
