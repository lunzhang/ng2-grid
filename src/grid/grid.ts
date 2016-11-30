import { Component,HostListener,ViewChildren} from '@angular/core';
import { NgStyle } from "@angular/common";
import { NgWidget } from '../widget/widget';

@Component({
  selector: 'grid',
  template: '<div [ngStyle]="gridStyle"> <widget *ngFor="let widget of widgets" (onActivateWidget)="onActivateWidget($event)"> </widget> </div>'
})
export class NgGrid {

  @ViewChildren(NgWidget) ngWidgets : QueryList<NgWidget>;

  public activeWidget:NgWidget;
  public widgets:Array<NgWidget>=[];
  public gridStyle= {
    'width':'100%',
    'height':'100%',
    'background-color':'lightgrey'
  };

  @HostListener('mousedown', ['$event'])
  onMouseDown(e){

  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e){
      if(this.activeWidget){
        if(this.activeWidget.isDrag){
          this.activeWidget.widgetStyle.top =  this.activeWidget.widgetStyle.top + (e.screenY - this.activeWidget.mousePoint.y);
          this.activeWidget.widgetStyle.left = this.activeWidget.widgetStyle.left + (e.screenX - this.activeWidget.mousePoint.x);
          this.activeWidget.mousePoint.y = e.screenY;
          this.activeWidget.mousePoint.x = e.screenX;
        } else if(this.activeWidget.isResize){
          this.activeWidget.widgetStyle.height =  this.activeWidget.widgetStyle.height + (e.screenY - this.activeWidget.mousePoint.y);
          this.activeWidget.widgetStyle.width = this.activeWidget.widgetStyle.width + (e.screenX - this.activeWidget.mousePoint.x);
          this.activeWidget.mousePoint.y = e.screenY;
          this.activeWidget.mousePoint.x = e.screenX;
        }
      }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e){
    if(this.activeWidget){
      this.activeWidget.resetMouse();
      this.activeWidget = null;
    }
  }

  public onActivateWidget(widget:NgWidget){
    this.activeWidget = widget;
  }

  addWidget(){
    this.widgets.push(new NgWidget());
  }

}
