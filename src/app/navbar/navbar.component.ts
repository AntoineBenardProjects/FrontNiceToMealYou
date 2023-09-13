import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddComponent } from '../add/add.component';
import { LogoutComponent } from '../logout/logout.component';
import { User } from '../model/user';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ButtonInfos } from '../shared/model/designs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private route: Router,
    private dialogRef: MatDialog,
    private dataService: DatabaseService,
    private place: PlacesService,
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) {
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription;
  private imageSubscriber: Subscription;

  @Input() color: string;
  @HostBinding('style.--backgroundColor') backgroundColor: string = 'var(--mainColor)';
  protected buttonColor: ButtonInfos = {
    color: 'var(--white)',
    colorActive: 'var(--mainColor)',
    backgroundColorActive: 'var(--white)'
  }

  

  position : number = 0;
  test: boolean = true;

  ngOnInit(): void {}

  ngAfterViewInit(){
    window.addEventListener("scroll", (event) => {
      let positionYScroll = window.pageYOffset;
      const PriorityContainerElement: HTMLElement = document?.getElementById("priorityContainer");
      let positionPriorityContainer: any = {
        top: PriorityContainerElement?.offsetTop,
        bottom: PriorityContainerElement?.offsetTop + PriorityContainerElement?.clientHeight
      }

      const AdsElement: HTMLElement = document?.getElementById("ads");
      let positionAds: any = {
        top: AdsElement?.offsetTop,
        bottom: AdsElement?.offsetTop + AdsElement?.clientHeight
      }

      const Verify: boolean = (positionPriorityContainer.top <= positionYScroll && positionPriorityContainer.bottom >= positionYScroll);
      
      if(Verify){
        this.buttonColor = {
          color: 'var(--mainColor)',
          colorActive: 'var(--white)',
          backgroundColorActive: 'var(--mainColor)'
        }
        this.backgroundColor = 'var(--white)';
      } else{
        this.buttonColor = {
          color: 'var(--white)',
          colorActive: 'var(--mainColor)',
          backgroundColorActive: 'var(--white)'
        }
        this.backgroundColor = 'var(--mainColor)';
      }
    });
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
    this.imageSubscriber.unsubscribe();
  }

  navigate(url: string){
    this.route.navigate([url]);
  }

  
  
  addPlace(){
    this.dialogRef.open(AddComponent,
      {
        panelClass: 'modal-form'
      }
    );
  }

  deconnect(){
    this.dialogRef.open(LogoutComponent, {
      height: '50%',
      width: '50%'
    })
  }

}