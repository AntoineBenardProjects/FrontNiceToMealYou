import { Component, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { ButtonInfos } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() styleInfos: ButtonInfos;
  @Input() type !: string;
  @Output() file: EventEmitter<string> = new EventEmitter();
  @HostBinding('style.--backgroundColor') backgroundColor = 'var(--secondColor)';
  @HostBinding('style.--color') color = 'var(--white)';

  constructor(private elementRef: ElementRef,
    private themeService: ThemeService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
      this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

  ngOnInit(){
    if(this.styleInfos != null){
      this.backgroundColor = this.styleInfos.backgroundColor;
      this.color = this.styleInfos.color;
    }
  }

  ngOnChanges(){
    if(this.styleInfos != null){
      this.backgroundColor = this.styleInfos.backgroundColor;
      this.color = this.styleInfos.color;
    }
  }

  setPicture(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
          this.file.emit(_event.target.result,);
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnDestroy(){
    this.themeSubscriber.unsubscribe();
  }
}
