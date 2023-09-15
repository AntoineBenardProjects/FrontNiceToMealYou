import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Data } from 'src/data';
import { Horaires } from '../model/horaires';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  public triggerImage: Subject<boolean> = new Subject();
  public filters: Subject<string> = new Subject();

  isOpened(horaires: Horaires[]): boolean{
    const today = this.convertDayTimeToDay(new Date().getDay());

    const todayHoraires: Horaires = horaires.find((element: Horaires) => element.day === today);

    const ouverture: Date = new Date();
    const fermeture_midi: Date = new Date();
    const ouverture_soir: Date = new Date();
    const fermeture: Date = new Date();

    if(todayHoraires.ouverture == null) return false;
    else{
      let hour: number = 0;
      let minutes: number = 0;
  
      hour = Number(todayHoraires.ouverture.substring(0,2));
      minutes = Number(todayHoraires.ouverture.substring(3,5));
      ouverture.setHours(hour);
      ouverture.setMinutes(minutes);
  
      hour = Number(todayHoraires.fermeture_midi.substring(0,2));
      minutes = Number(todayHoraires.fermeture_midi.substring(3,5));
      fermeture_midi.setHours(hour);
      fermeture_midi.setMinutes(minutes);
      if(hour < 10 && todayHoraires.ouverture_soir == null) fermeture_midi.setDate(fermeture_midi.getDate() + 1);

      if(todayHoraires.ouverture_soir != null){
        hour = Number(todayHoraires.ouverture_soir.substring(0,2));
        minutes = Number(todayHoraires.ouverture_soir.substring(3,5));
        ouverture_soir.setHours(hour);
        ouverture_soir.setMinutes(minutes);
    
        hour = Number(todayHoraires.fermeture.substring(0,2));
        minutes = Number(todayHoraires.fermeture.substring(3,5));
        fermeture.setHours(hour);
        fermeture.setMinutes(minutes);
        if(hour < 10) fermeture.setDate(fermeture_midi.getDate() + 1);


        if((ouverture < new Date() && fermeture_midi > new Date()) || ouverture_soir < new Date() && fermeture > new Date()) return true;
        else  return false;
      }
      else{
        if((ouverture < new Date() && fermeture_midi > new Date())) return true;
        else  return false;
      }
    }

  }

  setFilterToSave(): Observable<string>{
    return this.filters.asObservable();
  }
  saveFilters(id: string){
    this.filters.next(id);
  }

  setId(){
    let id: string ="";
    for(let i = 0; i < 15; i++){
      id += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return id;
  }

  getImageChange(): Observable<boolean>{
    return this.triggerImage.asObservable();
  }


  removeDuplicate(obj: any[] ){
    obj = obj.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id === value.id
    )));
    return obj;
  }

  getHour(dateInString: string){
    if(dateInString.length > 0){
      const hour = dateInString.substring(0,2);
      return Number(hour);
    }
    else return 0;
  }

  getMinute(dateInString: string){
    if(dateInString.length > 0){
      const minute = dateInString.substring(dateInString.length-2,dateInString.length);
      return Number(minute);
    }
    else return 0;
  }

  convertDayTimeToDay(dayTime: number){
    let day = "Dimanche";
    if(dayTime === 1) day = "Lundi";
    else if(dayTime === 2) day = "Mardi";
    else if(dayTime === 3) day = "Mercredi";
    else if(dayTime === 4) day = "Jeudi";
    else if(dayTime === 5) day = "Vendredi";
    else if(dayTime === 6) day = "Samedi";

    return day;
  }

  getNearByTransports(coords: google.maps.LatLng){

  }
}
