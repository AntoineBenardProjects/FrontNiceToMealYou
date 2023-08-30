import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  keys = {
    PLACEDETAILS: "placeDetails"
  }


  setSession(key: string, value: any){
    const newItem = JSON.stringify(value);
    localStorage.setItem(key, newItem);
  }

  getSession(key: string){
    let toReturn = localStorage.getItem(key);
    if(toReturn != null){
      toReturn = JSON.parse(toReturn);
    }
    return toReturn;
  }
}
