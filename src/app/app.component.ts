import { Component, ElementRef, HostBinding } from '@angular/core';
import { ColorPalette, Palettes } from "../assets/style-infos/palettes";
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private elementRef: ElementRef,
    private themeService: ThemeService,private deviceService: DeviceDetectorService, private dataService: DatabaseService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

    if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--grey', Palette.grey);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--errorColor', Palette.errorColor);
      this.elementRef.nativeElement.style.setProperty('--successColor', Palette.successColor);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--warningColor', Palette.warningColor);

      this.grey = Palette.grey;
      this.white = Palette.white;
      this.black = Palette.black;
      this.mainColor = Palette.mainColor;
      this.errorColor = Palette.errorColor;
      this.successColor = Palette.successColor;
      this.secondColor = Palette.secondColor;
      this.warningColor = Palette.warningColor;
    });
  }
  private themeSubscriber: Subscription;

  @HostBinding("style.--grey") grey: string = '';
  @HostBinding("style.--white") white: string = '';
  @HostBinding("style.--black") black: string = '';
  @HostBinding("style.--mainColor") mainColor: string = '';
  @HostBinding("style.--errorColor") errorColor: string = '';
  @HostBinding("style.--successColor") successColor: string = '';
  @HostBinding("style.--secondColor") secondColor: string = '';
  @HostBinding("style.--warningColor") warningColor: string = '';

  protected paletteName: string = 'Default';
  
  ngOnInit(){
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    if(isMobile)  sessionStorage.setItem("device","mobile");
    else if(isTablet)  sessionStorage.setItem("device","tablet");
    else if(isDesktopDevice)  sessionStorage.setItem("device","desktop");

    const token: string = localStorage.getItem("token");
    this.dataService.loginByToken(token).subscribe((credentials: any) => {
      localStorage.setItem("id",credentials.id);
      localStorage.setItem("login",credentials.login);
      this.dataService.getImage(credentials.id).subscribe((pictures: string[]) =>{
        localStorage.setItem("img",pictures[0]);
        localStorage.setItem("couv",pictures[1]);
      });
    });

  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
