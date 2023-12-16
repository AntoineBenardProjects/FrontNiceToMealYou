import { Component, ElementRef, Input, Output, EventEmitter, HostBinding, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { RangeSliderInfos } from 'src/app/shared/model/designs';
import { ColorPalette } from 'src/assets/style-infos/palettes';

@Component({
  selector: 'range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent {

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

  protected valueOfRight: number = 0;
  protected valueOfLeft: number = 0;
  protected convertedValueOfLeft: number = 0;
  protected positionLeft: number = 0;
  protected positionRight: number = 0;
  protected positionDialogLeft: number = 0;
  protected positionDialogRight: number = 0;
  protected showRight: boolean = false;
  protected showLeft: boolean = false;

  ngOnInit(){
    if(this.infos != null){
      this.activeColor = this.infos.activeColor;
      this.unactiveColor = this.infos.unactiveColor;
      this.size = this.infos.pointSize.toString() + "px";
      this.width = this.infos.width.toString() + "px";
      this.length = this.infos.length.toString() + "vw";
      const rangeWidth:number = document.getElementById("range").clientWidth;
      const offsetPercent: number = 22/rangeWidth * 100;
      this.valueOfRight = this.infos.maxValue;
      this.valueOfLeft = this.infos.maxValue;
      this.convertedValueOfLeft = Math.abs(this.infos.maxValue - this.valueOfLeft);
      this.positionDialogRight = (this.valueOfRight / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
      this.positionDialogLeft = Math.abs((100 - this.valueOfLeft) / this.infos.maxValue * (100 - offsetPercent) + (offsetPercent/2));
      this.borderColor = this.infos.borderColor;
      this.borderWidth = this.infos.borderWidth.toString() + "px";
      this.borderWidthDialog = this.infos.borderWidthDialog.toString() + "px";
    }
  }
  ngOnChanges(){
    if(this.infos != null){
      const rangeWidth:number = document.getElementById("range").clientWidth;
      const offsetPercent: number = 22/rangeWidth * 100;
      this.activeColor = this.infos.activeColor;
      this.unactiveColor = this.infos.unactiveColor;
      this.size = this.infos.pointSize.toString() + "px";
      this.width = this.infos.width.toString() + "px";
      this.length = this.infos.length.toString() + "vw";
      this.valueOfRight = this.infos.maxValue;
      this.valueOfLeft = this.infos.maxValue;
      this.convertedValueOfLeft = Math.abs(this.infos.maxValue - this.valueOfLeft);
      this.positionDialogRight = (this.valueOfRight / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
      this.positionDialogLeft = Math.abs((100 - this.valueOfLeft) / this.infos.maxValue * (100 - offsetPercent) + (offsetPercent/2));
      this.borderColor = this.infos.borderColor;
      this.borderWidth = this.infos.borderWidth.toString() + "px";
      this.borderWidthDialog = this.infos.borderWidthDialog.toString() + "px";
    }
  }

  getValue(event:any,prop: string){
    if(sessionStorage.getItem("device") !== 'desktop'){
      prop === 'min' ? this.showLeft = true : this.showRight = true;
    }  

    const rangeWidth:number = document.getElementById("range").clientWidth;
    const offsetPercent: number = 22/rangeWidth * 100;
    const value: number = Number(event.target.value);
    prop === 'min' ? this.valueOfLeft = value : this.valueOfRight = value;
    this.convertedValueOfLeft = Math.abs(this.infos.maxValue - this.valueOfLeft);
    this.positionLeft = (this.infos.maxValue - this.valueOfLeft) / this.infos.maxValue * 100;
    this.positionRight = Math.abs(100 - (this.valueOfRight / this.infos.maxValue * 100)); 
    this.positionDialogRight = (this.valueOfRight / this.infos.maxValue * (100 - offsetPercent)) + (offsetPercent/2);
    this.positionDialogLeft = this.convertedValueOfLeft / this.infos.maxValue * (100 - offsetPercent) + (offsetPercent/2);
  }

  displayValue(prop: string){
    if(prop === "right")  this.showRight = !this.showRight;
    else  this.showLeft = !this.showLeft;
  }
  sendData(){
    this.convertedValueOfLeft <= this.valueOfRight ? this.values.next([this.convertedValueOfLeft,this.valueOfRight]) : this.values.next([this.valueOfRight,this.convertedValueOfLeft]);
    if(sessionStorage.getItem("device") !== 'desktop'){
      this.showRight = false;
      this.showLeft = false;
    }
  }

}
