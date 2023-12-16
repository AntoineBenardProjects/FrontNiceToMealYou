import { Component } from '@angular/core';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { iconsAddComponent } from '../shared/model/design/buttonsDesign';
import { ButtonInfos } from '../shared/model/designs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor(private router: Router){}

//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
  /*  Css  */
  protected opacityBackground: number = 0.6;
  protected widthBackground: number = 0;
  protected opacityPicture: number = 0;
  protected translatePicture: number = -30;
  protected valuesProperties: number[] = [90,75,70,90,80];
  protected iconsInfos: ButtonInfos = iconsAddComponent;
  protected copied: boolean = false;
  protected opacityBody: number = 0;
/*  Icons  */
  protected linkedInIcon: IconDefinition = faLinkedin;
  protected mailIcon: IconDefinition = faEnvelope;

  ngAfterViewInit(): void{
    setTimeout(() => {
      this.widthBackground = 100;
      setTimeout(() => {
        this.opacityBackground = 1;
        this.translatePicture = 0;
        this.opacityPicture = 1;
        setTimeout(() => {
          this.opacityBody = 1
        }, 500)
      }, 1000);
    }, 300);
  }
  protected copy(): void{
    navigator.clipboard.writeText('antoine.benard.pro@outlook.fr').then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    })
    .catch(() => {
      console.error("Unable to copy text");
    });
    
  }
  protected openInBrowser(url: string): void{
    window.open(url, "_blank");
  }
  protected navigate(url: string): void{
    this.router.navigate([url]);
  }
}
