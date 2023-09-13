import { Component, ElementRef, HostBinding } from '@angular/core';
import { ColorPalette, Palettes } from "../assets/style-infos/palettes";
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { DatabaseService } from './services/database.service';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('topbarAnimation', [
      state('hidden', style({
        transform: 'translate(0,-10vh)',
      })),
      state('show', style({
        transform: 'translate(0,0)',
      })),
      transition('* => show', [
        animate('1s ease')
      ]),
      transition('* => hidden', [
        animate('1s ease')
      ])
    ])
  ]
})
export class AppComponent {
  constructor(private elementRef: ElementRef,
    private themeService: ThemeService,private deviceService: DeviceDetectorService, private dataService: DatabaseService){
    const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

    if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);

      this.white = Palette.white;
      this.black = Palette.black;
      this.mainColor = Palette.mainColor;
      this.secondColor = Palette.secondColor;
      this.thirdColor = Palette.thirdColor;
    });
  }
  private themeSubscriber: Subscription;


  @HostBinding("style.--white") white: string = '';
  @HostBinding("style.--black") black: string = '';
  @HostBinding("style.--mainColor") mainColor: string = '';
  @HostBinding("style.--secondColor") secondColor: string = '';
  @HostBinding("style.--thirdColor") thirdColor: string = '';

  protected paletteName: string = 'Default';
  protected triggerTopBar: string = "hidden";
  private user: User;
  private verifyAdmin: boolean = false;
  private verifyPortfolio: boolean = false;
  
  ngOnInit(){
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    if(isMobile)  sessionStorage.setItem("device","mobile");
    else if(isTablet)  sessionStorage.setItem("device","tablet");
    else if(isDesktopDevice)  sessionStorage.setItem("device","desktop");

    const token: string = localStorage.getItem("token");
    this.dataService.loginByToken(token).subscribe((credentials: any) => {
      if(credentials.role === "Admin") this.verifyAdmin = true;
      if(credentials.role === "Visit")  this.verifyPortfolio = true;
      localStorage.setItem("role",credentials.role);
      localStorage.setItem("id",credentials.id);
      localStorage.setItem("login",credentials.login);

      this.dataService.getImage(credentials.id).subscribe((img: string) =>{
        localStorage.setItem("img",img);
        this.user = {
          id: credentials.id,
          img: img,
          login: credentials.login,
          password: "",
          role: credentials.role
        }
      });
    });

  }

  ngAfterViewInit(){
    document.addEventListener("mousemove", (event: MouseEvent) => {
      const mouseY: number = event.screenY;

      if(mouseY < 150)  this.triggerTopBar = "show";
      else  this.triggerTopBar = "hidden";
    });
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
