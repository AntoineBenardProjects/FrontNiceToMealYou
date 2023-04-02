import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAnimationScroll]'
})
export class AnimationScrollDirective {
  private delay: string = "";

  @HostListener('window:scroll',[])

  scroll(){
    const rect = this.el.nativeElement.getBoundingClientRect();
    let scroll = this.mapRange(0, window.innerWidth, 0, 1, rect.left + (rect.height/2));
    scroll = scroll < 0 ? 0 : scroll > 1 ? 1 : scroll;
    this.delay = `-${scroll.toFixed(2)}s`;
  }

  mapRange(b1:number, a1:number, a2:number, b2:number, value:number){
    return b1 + ((value - a1) * (b2-b1))/(a2-a1);
  }
  constructor(private el: ElementRef<HTMLElement>) { }

}
