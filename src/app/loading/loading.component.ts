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
  protected heightBody: number = 100;
  protected heightBackground: number = 0;
  protected widthBody: number = 100;

  private getRandom(): number{
    return Math.floor(Math.random() * (2 - 1 + 1)) + 1;
  }
  ngOnInit(){
    this.width = "calc(" + this.percent + "% - 4px)";
  }
  ngOnChanges(){
    if(this.percent >= 70){
      this.transformStart = "translateY(-15vh)";
      this.transformEnd = "translateY(0)";
    } else if(this.percent >= 20){
      this.transformStart = "translateY(0)";
    }
    if(this.percent === 100){ 
      if(this.getRandom() === 1){
        setTimeout(() => {
          this.scale = "scale(0)";
          this.show.next(true);
          setTimeout(() => {
            this.heightBody = 0;
            this.widthBody = 0;
          }, 2000);
        }, 1500);
      } else{
        setTimeout(() => {
          this.heightBackground = 100;
          setTimeout(() => {
            this.heightBody = 0;
            this.show.next(true);
          }, 500);
        }, 1500);
      }
      
    }
    this.width = "calc(" + this.percent + "% - 4px)";
  }
}
