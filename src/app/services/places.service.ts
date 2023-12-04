import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Horaires } from '../shared/model/table/horaires';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { IconDefinition, faMartiniGlass, faOtter, faSmileWink, faStore, faToolbox, faUtensils } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  public triggerImage: Subject<boolean> = new Subject();
  public filters: Subject<string> = new Subject();
  public getIconOfCategory(category: string): IconDefinition{
    let toReturn: IconDefinition;
    switch(category){
      case 'Restaurant':
        toReturn = faUtensils;
      break;
      case 'Bar':
        toReturn = faMartiniGlass;
      break;
      case 'Loisir':
        toReturn = faSmileWink;
      break;
      case 'Magasin':
        toReturn = faStore;
      break;
      case 'Service':
        toReturn = faToolbox;
      break;
      case 'Autre':
        toReturn = faOtter;
      break;
    }
    return toReturn;
  }
  getCopyOfElement(element: any){
    return JSON.parse(JSON.stringify(element));
  }
  hexToRgba(color: string, opacity): string{

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    let R: number = parseInt(result[1], 16);
    let G: number = parseInt(result[2], 16);
    let B: number = parseInt(result[3], 16);

    return "rgba(" + R + "," + G + "," + B + "," + opacity + ")";
  }
  shadeColor(color: string, percent:number): string {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    let R: number = parseInt(result[1], 16);
    let G: number = parseInt(result[2], 16);
    let B: number = parseInt(result[3], 16);

    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  }

  isColorLight(color: string): boolean {
    let isLight: boolean = false;

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    let R: number = parseInt(result[1], 16);
    let G: number = parseInt(result[2], 16);
    let B: number = parseInt(result[3], 16);

    if(R+G+B > (255*3)/2) isLight = true;

    return isLight;
  }

  getIconFromName(name: string)
  {
    return Icons[name];
  }

  isOpened(horaires: Horaires[]): boolean{
    const today = this.convertDayTimeToDay(new Date().getDay());

    const todayHoraires: Horaires = horaires.find((element: Horaires) => element.day === today);

    const ouverture: Date = new Date();
    const fermeture_midi: Date = new Date();
    const ouverture_soir: Date = new Date();
    const fermeture: Date = new Date();

    if(todayHoraires.ouverture === '') return false;
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
      if(hour < ouverture.getHours() && todayHoraires.ouverture_soir == null) fermeture_midi.setDate(fermeture_midi.getDate() + 1);

      if(todayHoraires.ouverture_soir != null && todayHoraires.ouverture_soir !== ""){
        hour = Number(todayHoraires.ouverture_soir.substring(0,2));
        minutes = Number(todayHoraires.ouverture_soir.substring(3,5));
        ouverture_soir.setHours(hour);
        ouverture_soir.setMinutes(minutes);
    
        hour = Number(todayHoraires.fermeture.substring(0,2));
        minutes = Number(todayHoraires.fermeture.substring(3,5));
        fermeture.setHours(hour);
        fermeture.setMinutes(minutes);
        if(hour < ouverture_soir.getHours()) fermeture.setDate(fermeture_midi.getDate() + 1);
        if((ouverture < new Date() && fermeture_midi > new Date()) || (ouverture_soir < new Date() && fermeture > new Date())) return true;
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

  convertDayToNumber(day: string): number{
    let value: number = 0;
    switch(day){
        case "Lundi":
          value = 0;
        break;
        case "Mardi":
          value = 1;
        break;
        case "Mercredi":
          value = 2;
        break;
        case "Jeudi":
          value = 3;
        break;
        case "Vendredi":
          value = 4;
        break;
        case "Samedi":
          value = 5;
        break;
        case "Dimanche":
          value = 6;
        break;
    }
    return value;
  }
  convertDateToString(date: Date): string{
    date = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    const day: number = date.getDate();
    const month: number = date.getMonth()+1;
    const year: number = date.getFullYear();
    
    let stringDay = day.toString();
    if(stringDay.length === 1)  stringDay = "0" + stringDay;
    return stringDay + "/" + month + "/" + year;
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

  changeRegToUrl(url: string){
    url = url.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    url = url.split(' ').join('_');
    return url;
  }
}
