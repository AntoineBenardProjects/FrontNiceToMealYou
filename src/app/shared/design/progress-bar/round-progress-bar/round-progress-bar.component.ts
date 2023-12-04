import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { RoundProgressBarInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'round-progress-bar',
  templateUrl: './round-progress-bar.component.html',
  styleUrls: ['./round-progress-bar.component.scss']
})
export class RoundProgressBarComponent {
  constructor(){}

  @Input() infos: RoundProgressBarInfos;
  @Output() noteChange: EventEmitter<number> = new EventEmitter<number>()
  protected size: string = '80px';
  protected center: Coordinates = {
    x: 40,
    y: 40
  };
  protected radius: number = 30;
  protected strokeDashArray: number = 0;
  protected strokeDashOffset: number = 0;
  protected fontSizeNote: number = 25;
  protected fontSizeUnit: number = 16;
  protected fontWeight: number = 800;
  @HostBinding('style.--color') color: string = '';
  @HostBinding('style.--strokeWidth') strokeWidth: string = '';
  @HostBinding('style.--textColor') textColor: string = '';

  ngOnInit(){
    if(this.infos.note >= 0){
      this.strokeDashArray = 2 * this.radius * Math.PI;
      this.strokeDashOffset = this.strokeDashArray - (this.strokeDashArray * (this.infos.note/10));
    }
    if(this.infos.fontWeight != null) this.fontWeight = this.infos.fontWeight;
    this.color = this.infos.color;
    this.strokeWidth = this.infos.width.toString();
    this.textColor = this.infos.textColor;
  }

  ngOnChanges(){
    if(this.infos.note >= 0){
      this.strokeDashArray = 2 * this.radius * Math.PI;
      this.strokeDashOffset = this.strokeDashArray - (this.strokeDashArray * (this.infos.note/10));
    }
    if(this.infos.fontWeight != null) this.fontWeight = this.infos.fontWeight;
    this.color = this.infos.color;
    this.strokeWidth = this.infos.width.toString();
    this.textColor = this.infos.textColor;
  }

  setNote(event: any){
    if(this.infos.editable) this.noteChange.next(event.target.value);
  }
}
interface Coordinates{
  x: number,
  y: number
}