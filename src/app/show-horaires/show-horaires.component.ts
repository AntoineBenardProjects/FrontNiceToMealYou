import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Horaires } from '../model/horaires';
import { PlacesService } from '../services/places.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'show-horaires',
  templateUrl: './show-horaires.component.html',
  styleUrls: ['./show-horaires.component.scss']
})
export class ShowHorairesComponent {

  @Input() horaires!: Horaires[];
  @Input() color: string = "";
  @Input() fontSize: number = 25;
  protected today: string = "";
  private themeSubscriber: Subscription = new Subscription();

  constructor(private placesService: PlacesService,
    private elementRef: ElementRef,
    private themeService: ThemeService) {
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }

  ngOnInit(){
    const day: number = new Date().getDay();
    switch(day){
      case 0:
        this.today = "Dimanche";
      break;
      case 1:
        this.today = "Lundi";
      break;
      case 2:
        this.today = "Mardi";
      break;
      case 3:
        this.today = "Mercredi";
      break;
      case 4:
        this.today = "Jeudi";
      break;
      case 5:
        this.today = "Vendredi";
      break;
      case 6:
        this.today = "Samedi";
      break;
    }
    this.horaires.sort((a: Horaires, b: Horaires) => {
      let numberA: number = 0;
      let numberB: number = 0;
      switch(a.day){
        case "Lundi":
          numberA = 0;
        break;
        case "Mardi":
          numberA = 1;
        break;
        case "Mercredi":
          numberA = 2;
        break;
        case "Jeudi":
          numberA = 3;
        break;
        case "Vendredi":
          numberA = 4;
        break;
        case "Samedi":
          numberA = 5;
        break;
        case "Dimanche":
          numberA = 6;
        break;
      }
      switch(b.day){
        case "Lundi":
          numberB = 0;
        break;
        case "Mardi":
          numberB = 1;
        break;
        case "Mercredi":
          numberB = 2;
        break;
        case "Jeudi":
          numberB = 3;
        break;
        case "Vendredi":
          numberB = 4;
        break;
        case "Samedi":
          numberB = 5;
        break;
        case "Dimanche":
          numberB = 6;
        break;
      }
      if(numberA < numberB) return -1;
      return 1;
    });

  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }

}
