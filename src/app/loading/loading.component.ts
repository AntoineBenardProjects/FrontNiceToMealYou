import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
   /*  Metadata  */
   @Input() percent!: number;
   @Output() show: EventEmitter<boolean> = new EventEmitter<boolean>();
   /*  Css  */
  protected width: string = "";
  protected transformStart: string = "translateY(15vh)";
  protected transformEnd: string = "translateY(15vh)";
  protected scale: string = "scale(1)";
  protected size: number = 100;
  ngOnInit(){
    this.width = "calc(" + this.percent + "% - 4px)";
  }
  ngOnChanges(){
    console.log(this.percent)
    if(this.percent >= 70){
      this.transformStart = "translateY(-15vh)";
      this.transformEnd = "translateY(0)";
    } else if(this.percent >= 20){
      this.transformStart = "translateY(0)";
    }
    if(this.percent === 100){
      setTimeout(() => {
        this.scale = "scale(0)";
        setTimeout(() => {
          this.show.next(true);
          this.size = 0;
        }, 1000);
      }, 1500);
    }
    this.width = "calc(" + this.percent + "% - 4px)";
  }
}
