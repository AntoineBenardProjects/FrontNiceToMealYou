import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ButtonInfos, LinkCardInfos } from '../shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faLocationDot, faAddressCard, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slogan', [
      state('show', style({
        width: '50vw'
      })),
      state('hidden', style({
        width: '0'
      })),
      transition('* => hidden', [
        animate('1.5s ease-out')
      ]),
      transition('* => show', [
        animate('1.5s ease-out')
      ])
    ]),
    trigger('bottomLogo', [
      state('show', style({
        opacity: '1',
        right: '15vw'
      })),
      state('hidden', style({
        opacity: '0',
        right: '0'
      })),
      transition('* => hidden', [
        animate('2s ease-out')
      ]),
      transition('* => show', [
        animate('2s ease-out')
      ])
    ]),
    trigger('topLogo', [
      state('show', style({
        opacity: '1',
        left: '15vw'
      })),
      state('hidden', style({
        opacity: '0',
        left: '0'
      })),
      transition('* => hidden', [
        animate('2s ease-out')
      ]),
      transition('* => show', [
        animate('2s ease-out')
      ])
    ]),
    trigger('resultDiv', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
    ]),
    trigger('button', [
      state('show', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('* => hidden', [
        animate('1s ease')
      ]),
      transition('* => show', [
        animate('1s ease')
      ])
    ]),
    trigger('showTitle', [
      state('show', style({
        opacity: '1'
      })),
      transition('* => show', [
        animate('2s ease')
      ])
    ])
  ]
})
export class HomeComponent {
  display: any;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

    center: google.maps.LatLngLiteral = {
      lat:48.85663194918784, lng:2.3522139326422447
    };
    zoom = 12;
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }
    markerOptions: google.maps.MarkerOptions = {
        draggable: false
    };
    markerPositions: google.maps.LatLngLiteral[] = [];
    openInfoWindow(marker: MapMarker) {
      this.infoWindow.open(marker);
    }


  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

  //////////////////////////////////////////////  Background Page  //////////////////////////////////////////////
  protected backgroundColor: string = 'var(--black)'
  setBackgroundColor(scrollPosition: number) : void {
    if(scrollPosition >= 0 && scrollPosition < window.innerHeight * 1.8){
      this.styleLine = {
        textColor: "var(--white)",
        titleColor: "var(--mainColor)",
        shadowGradient: "linear-gradient(rgba(218,195,200,0.2),rgba(218,195,200,0.2))"
      }
      this.backgroundColor = "var(--black)";
      this.logoImageSrc = "../../assets/logo/white_logo.png";
      this.buttonColor = {
        color: 'var(--black)',
        colorActive: 'var(--mainColor)',
        backgroundColor: 'var(--mainColor)',
        backgroundColorActive: 'var(--black)',
        fontWeight: 1000
      }
      this.logoColor = "var(--mainColor)";
      this.linkCardInfos = {
        color: 'var(--white)',
        borderColor: 'var(--white)',
        selectedBorderColor: 'var(--white)'
      }
    } else{
      this.styleLine = {
        textColor: "var(--black)",
        titleColor: "var(--secondColor)",
        shadowGradient: "linear-gradient(rgba(12,18,18,0.2),rgba(12,18,18,0.2))"
      }
      this.backgroundColor = "var(--mainColor)";
      this.logoImageSrc = "../../assets/logo/black_logo.png";
      this.buttonColor = {
        color: 'var(--mainColor)',
        colorActive: 'var(--black)',
        backgroundColor: 'var(--black)',
        backgroundColorActive: 'var(--mainColor)',
        fontWeight: 1000
      }
      this.logoColor = "var(--black)";
      this.linkCardInfos = {
        color: 'var(--mainColor)',
        borderColor: 'var(--black)',
        selectedBorderColor: 'var(--secondColor)'
      }
    }
  }

  //////////////////////////////////////////////  Logo and topbar  //////////////////////////////////////////////
  protected triggerLogoAnimation: string = "hidden";
  @HostBinding('style.--logoColor') logoColor: string = "var(--mainColor)";
  protected buttonColor: ButtonInfos = {
    color: 'var(--black)',
    colorActive: 'var(--mainColor)',
    backgroundColor: 'var(--mainColor)',
    backgroundColorActive: 'var(--black)',
    fontWeight: 1000
  }
  protected logoPosition: number = 0;
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";
  moveLogo(scrollPosition: number) : void{
    const stopLogoScroll: number = 500;
    this.logoPosition = 15 - 5 * (scrollPosition/stopLogoScroll);
  }
  navigate(url: string, filterType?: string) : void{
    if(url === 'about'){
      const aboutElement: HTMLElement = document.getElementById("about");
      window.scrollTo({
        top: aboutElement.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    } else{
      this.router.navigate([url]);
      sessionStorage.setItem("lastPage","/home");
    }
  }

  //////////////////////////////////////////////  Types  //////////////////////////////////////////////
  protected linkCardInfos: LinkCardInfos = {
    color: 'var(--white)',
    borderColor: 'var(--white)',
    selectedBorderColor: 'var(--white)'
  }

  //////////////////////////////////////////////  Presentation  //////////////////////////////////////////////
  protected locationIcon: IconDefinition = faLocationDot;
  protected presentationIcon: IconDefinition = faAddressCard;
  protected filterIcon: IconDefinition = faFilter;
  protected positionPresentationIcon: PositionIcon = {
    paddingIcon: 0,
    scaleShadow: 1,
    textOpacity: true,
    titleOpacity: true
  };
  protected positionLocationIcon: PositionIcon = {
    paddingIcon: 0,
    scaleShadow: 1,
    textOpacity: true,
    titleOpacity: true
  };
  protected positionFilterIcon: PositionIcon = {
    paddingIcon: 0,
    scaleShadow: 1,
    textOpacity: true,
    titleOpacity: true
  };
  protected styleLine: StyleLine = {
    textColor: "",
    titleColor: "",
    shadowGradient: "",
  }
  moveIcon(scrollPosition: number) : void{
    let position: number = scrollPosition - window.innerHeight;
    const stopPresentationIconScroll: number = window.innerHeight * 0.65;
    let stopLocationIconScroll: number = window.innerHeight * 1.3;
    let stopFilterIconScroll: number = window.innerHeight * 1.95;

    if(0 <= position && stopPresentationIconScroll >= position){
      this.positionPresentationIcon.paddingIcon = (-60) + 100 * (position/stopPresentationIconScroll);
      this.positionPresentationIcon.scaleShadow = 0 + 1 * (position/stopPresentationIconScroll);
      if(this.positionPresentationIcon.paddingIcon > -35) this.positionPresentationIcon.titleOpacity = true;
      else this.positionPresentationIcon.titleOpacity = false;
      if(this.positionPresentationIcon.paddingIcon > -15) this.positionPresentationIcon.textOpacity = true;
      else this.positionPresentationIcon.textOpacity = false;
    } if(stopPresentationIconScroll <= position && stopLocationIconScroll >= position){
      position -= stopPresentationIconScroll;
      stopLocationIconScroll -= stopPresentationIconScroll;

      this.positionPresentationIcon.paddingIcon = 40;
      this.positionPresentationIcon.scaleShadow = 1;
      this.positionPresentationIcon.titleOpacity = true;
      this.positionPresentationIcon.textOpacity = true;

      this.positionLocationIcon.paddingIcon = (-60) + 100 * (position/stopLocationIconScroll);
      this.positionLocationIcon.scaleShadow = 0 + 0.6 * (position/stopLocationIconScroll);
      if(this.positionLocationIcon.paddingIcon > -35) this.positionLocationIcon.titleOpacity = true;
      else this.positionLocationIcon.titleOpacity = false;
      if(this.positionLocationIcon.paddingIcon > -15) this.positionLocationIcon.textOpacity = true;
      else this.positionLocationIcon.textOpacity = false;
    }
    if(stopLocationIconScroll <= position && stopFilterIconScroll >= position){
      position -= stopLocationIconScroll;
      stopFilterIconScroll -= stopLocationIconScroll;
      this.positionLocationIcon.paddingIcon = 40;
      this.positionLocationIcon.scaleShadow = 1;
      this.positionLocationIcon.titleOpacity = true;
      this.positionLocationIcon.textOpacity = true;

      this.positionFilterIcon.paddingIcon = (-60) + 100 * (position/stopFilterIconScroll);
      this.positionFilterIcon.scaleShadow = 0 + 0.6 * (position/stopFilterIconScroll);
      if(this.positionFilterIcon.paddingIcon > -35) this.positionFilterIcon.titleOpacity = true;
      else this.positionFilterIcon.titleOpacity = false;
      if(this.positionFilterIcon.paddingIcon > -15) this.positionFilterIcon.textOpacity = true;
      else this.positionFilterIcon.textOpacity = false;
    }
    else if(stopFilterIconScroll < position){
      this.positionFilterIcon.paddingIcon = 40;
      this.positionFilterIcon.scaleShadow = 1;
      this.positionFilterIcon.titleOpacity = true;
      this.positionFilterIcon.textOpacity = true;
    }
    else if(position < 0){
      this.positionPresentationIcon.textOpacity = false;
      this.positionLocationIcon.textOpacity = false;
      this.positionFilterIcon.textOpacity = false;
    }

  }

  // getGeoLocation(address: string): void{
  //   let geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({
  //     'address': address
  //   }, (results, status) => {
  //       if (status == google.maps.GeocoderStatus.OK) {
  //         console.log(results)
  //         const coords: google.maps.LatLngLiteral = results[0].geometry.location.toJSON();
  //         this.markerPositions.push(coords);
  //       } else {
  //         console.log('Error: ', results, ' & Status: ', status);
  //       }
  //   });
  // }

  nearbyCallback(results, status): void {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach((element) => {
        const coords: google.maps.LatLngLiteral = element.geometry.location.toJSON();
        this.markerPositions.push(coords);

      });
    }
}


//////////////////////////////////////////////  Life cycle  //////////////////////////////////////////////
  ngAfterViewInit(): void {
    window.addEventListener("wheel", () => {
      this.moveLogo(window.scrollY);
      this.setBackgroundColor(window.scrollY);
      this.moveIcon(window.scrollY);
    });    
    window.addEventListener("scroll", () => {
      this.moveLogo(window.scrollY);
      this.setBackgroundColor(window.scrollY);
      this.moveIcon(window.scrollY);
    });
    this.triggerLogoAnimation = "show";
  }
  ngOndestroy(): void{
    this.themeSubscriber.unsubscribe();
  }
}


interface StyleLine{
  textColor: string,
  titleColor: string,
  shadowGradient: string
}
interface PositionIcon{
  paddingIcon: number,
  scaleShadow: number,
  textOpacity: boolean,
  titleOpacity: boolean
}
