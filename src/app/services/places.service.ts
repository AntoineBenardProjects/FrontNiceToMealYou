import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Data } from 'src/data';
import { Bar } from '../model/bar';
import { Horaires } from '../model/horaires';
import { Restaurant } from '../model/restaurant';
import { TypePicture } from '../model/typePicture';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

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
  
      hour = Number(todayHoraires.ouverture.substring(0,1));
      minutes = Number(todayHoraires.ouverture.substring(3,4));
      ouverture.setHours(hour);
      ouverture.setMinutes(minutes);
  
      hour = Number(todayHoraires.fermeture_midi.substring(0,1));
      minutes = Number(todayHoraires.fermeture_midi.substring(3,4));
      fermeture_midi.setHours(hour);
      fermeture_midi.setMinutes(minutes);

      if(todayHoraires.ouverture_soir != null){
        hour = Number(todayHoraires.ouverture_soir.substring(0,1));
        minutes = Number(todayHoraires.ouverture_soir.substring(3,4));
        ouverture_soir.setHours(hour);
        ouverture_soir.setMinutes(minutes);
    
        hour = Number(todayHoraires.fermeture.substring(0,1));
        minutes = Number(todayHoraires.fermeture.substring(3,4));
        fermeture.setHours(hour);
        fermeture.setMinutes(minutes);

        if((ouverture < new Date() && fermeture_midi > new Date()) || ouverture_soir < new Date() && fermeture > new Date()) return true;
        else  return false;
      }
      else{
        if((ouverture < new Date() && fermeture_midi > new Date())) return true;
        else  return false;
      }
    }

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
    let day = "dimanche";
    if(dayTime === 1) day = "lundi";
    else if(dayTime === 2) day = "mardi";
    else if(dayTime === 3) day = "mercredi";
    else if(dayTime === 4) day = "jeudi";
    else if(dayTime === 5) day = "vendredi";
    else if(dayTime === 6) day = "samedi";

    return day;
  }

  getTypeFacade(type: string){
    ///console.log(type)
    const find: TypePicture = Data.find((element: TypePicture) => element.type === type);
    return find.url;
  }

  getTypeIcon(type: string){
    const find: TypePicture = Data.find((element: TypePicture) => element.type === type);
    return find.urlIcon;
  }
}
