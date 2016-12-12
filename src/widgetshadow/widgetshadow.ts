import { Component,Input } from '@angular/core';

@Component({
  selector: 'widget-shadow',
  template: '<div id="widget-shadow" [ngStyle]="shadowStyle"></div>',
  styles:['#widget-shadow{ position:absolute; background-color:#928f8f;}']
})
export class NgWidgetShadow {

public shadowStyle:any={};

setShadowStyle(shadowStyle){
  this.shadowStyle.width = shadowStyle.width;
  this.shadowStyle.height = shadowStyle.height;
  this.shadowStyle.top = shadowStyle.top;
  this.shadowStyle.left = shadowStyle.left;
}

}
