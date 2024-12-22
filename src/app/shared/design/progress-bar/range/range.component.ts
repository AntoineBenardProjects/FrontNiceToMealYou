import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { RangeSliderInfos } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent {

  constructor(private elementRef: ElementRef,
    private themeService: ThemeService){
    this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
      this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
      this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
      this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
      this.elementRef.nativeElement.style.setProperty('--errorColor', Palette.errorColor);
      this.elementRef.nativeElement.style.setProperty('--successColor', Palette.successColor);
    });
  }
  private themeSubscriber: Subscription = new Subscription();

  @Input() infos: RangeSliderInfos;
  @Output() values: EventEmitter<number[]> = new EventEmitter();
  @HostBinding('style.--activeColor') activeColor: string = "";
  @HostBinding('style.--unactiveColor') unactiveColor: string = "";
  @HostBinding('style.--size') size: string = "13px";
  @HostBinding('style.--width') width: string = "2px";
  @HostBinding('style.--length') length: string = "15vw";
  @HostBinding('style.--borderWidth') borderWidth: string = "";
  @HostBinding('style.--borderWidthDialog') borderWidthDialog: string = "";
  @HostBinding('style.--borderColor') borderColor: string = "";

  protected value: number = 0;
  protected positionDialog: number = 0;
  protected valueToSend: number = 0;
  protected showValue: boolean = false;

  ngOnInit(){
    if(this.infos != null){
      this.activeColor = this.infos.activeColor;
      this.unactiveColor = this.infos.unactiveColor;
      this.size = this.infos.pointSize.toString() + "px";
      this.width = this.infos.width.toString() + "px";
      this.length = this.infos.length.toString() + "vw";
      let rangeWidth:number = 0;
      document.getElementById("range").clientWidth === 0 ? rangeWidth = 100 : rangeWidth = document.getElementById("range").clientWidth;
      const offsetPercent: number = 22/rangeWidth * 100;
      this.value = this.infos.maxValue;
      this.positionDialog = (this.value / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
      this.borderColor = this.infos.borderColor;
      this.borderWidth = this.infos.borderWidth.toString() + "px";
      this.borderWidthDialog = this.infos.borderWidthDialog.toString() + "px";
      if(this.infos.initValue != null)  this.value = this.infos.initValue;
      this.valueToSend = this.value;
      this.positionDialog = (this.value / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
    }
  }
  ngOnChanges(){
    if(this.infos != null){
      this.activeColor = this.infos.activeColor;
      this.unactiveColor = this.infos.unactiveColor;
      this.size = this.infos.pointSize.toString() + "px";
      this.width = this.infos.width.toString() + "px";
      this.length = this.infos.length.toString() + "vw";
      const rangeWidth:number = document.getElementById("range").clientWidth;
      const offsetPercent: number = 22/rangeWidth * 100;
      this.value = this.infos.maxValue;
      this.positionDialog = (this.value / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
      this.borderColor = this.infos.borderColor;
      this.borderWidth = this.infos.borderWidth.toString() + "px";
      this.borderWidthDialog = this.infos.borderWidthDialog.toString() + "px";
      if(this.infos.initValue != null)  this.value = this.infos.initValue;
      this.valueToSend = this.value;
      this.positionDialog = (this.value / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
    }
  }

  protected displayValue(): void{
    this.showValue = !this.showValue;
  }
  getValue(event: any){
    const rangeWidth:number = document.getElementById("range").clientWidth;
    const offsetPercent: number = 22/rangeWidth * 100;
    this.valueToSend = event.target.value;
    this.positionDialog = (this.valueToSend / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
  }


  sendData(){
    this.values.next([this.value]);
  }
  
}
