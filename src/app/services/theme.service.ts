import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  protected palette: BehaviorSubject<ColorPalette> = new BehaviorSubject({});

  setPalette(palette: ColorPalette){
    this.palette.next(palette);
  }
  getPalette(){
    return this.palette.asObservable();
  }
}
