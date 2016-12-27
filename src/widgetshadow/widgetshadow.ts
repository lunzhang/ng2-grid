import { Component,Input } from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  moduleId: module.id,
  selector: 'widget-shadow',
  template: '<div id="widget-shadow" [ngStyle]="style"></div>',
  styleUrls:['./widgetshadow.css']
})
export class NgWidgetShadow extends GridItem {

deactivate(){
  this.style.display = 'none';
}

activate(){
  this.style.display = 'inline';
}

}
