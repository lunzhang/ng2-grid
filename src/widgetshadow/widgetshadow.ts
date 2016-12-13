import { Component,Input } from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  selector: 'widget-shadow',
  template: '<div id="widget-shadow" [ngStyle]="style"></div>',
  styles:['#widget-shadow{ position:absolute; background-color:#928f8f;}']
})
export class NgWidgetShadow extends GridItem {

deactivate(){
  this.style.display = 'none';
}

activate(){
  this.style.display = 'inline';
}

}
