import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CardParams } from '../model/cardParams';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { PlacesService } from '../services/places.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private place: PlacesService, private data: DatabaseService, private router: Router,
    private elementRef: ElementRef,private themeService: ThemeService) { 
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);

    });
  }
  private themeSubscriber: Subscription;

  @Input() params!: CardParams;
  protected isOpened: boolean = false;

  heartIcon = solidHeart;
  like: boolean = false;

  ngOnInit(): void {
    let id: string = "";
    id = localStorage.getItem("id");
    this.isOpened = this.place.isOpened(this.params.horaires);
  }

  ngOndestroy(){
    this.themeSubscriber.unsubscribe();
  }

  navigate(): void{
    // if(this.router.url === "/restaurants" || this.router.url === "/bars" ||this.router.url === "/loisirs"){
    //   this.place.saveFilters(this.params.data.id);
    // } else{
      this.router.navigate(['/showed',this.params.data.id]);
    // }
  }

}
