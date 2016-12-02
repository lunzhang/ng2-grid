import { Component,HostListener,ViewChildren,ngAfterViewInit} from '@angular/core';
import { NgStyle } from "@angular/common";
import { NgWidget } from '../widget/widget';

@Component({
  selector: 'grid',
  template: '<div [ngStyle]="gridStyle"> <widget *ngFor="let widget of widgets" (onActivateWidget)="onActivateWidget($event)" [content]="widget.content"> </widget> </div>'
})
export class NgGrid {

  @ViewChildren(NgWidget) ngWidgets : QueryList<NgWidget>;

  public gridStyle= {
    'width':'100%',
    'height':'100%',
    'background-color':'lightgrey',
    'position':'relative'
  };

  public activeWidget:NgWidget;
  public widgets=[];

  @HostListener('mousedown', ['$event'])
  onMouseDown(e){
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e){
      if(this.activeWidget){
        if(this.activeWidget.isDrag){
          var dx = e.screenX - this.activeWidget.mousePoint.x;
          var dy = e.screenY - this.activeWidget.mousePoint.y;
          if(this.activeWidget.widgetStyle.top > 0 || dy > 0){
            this.activeWidget.widgetStyle.top = this.activeWidget.widgetStyle.top + dy > 0 ? this.activeWidget.widgetStyle.top + dy : 0;
            this.activeWidget.mousePoint.y = e.screenY;
          }
          if(this.activeWidget.widgetStyle.left > 0 || dx > 0){
            this.activeWidget.widgetStyle.left = this.activeWidget.widgetStyle.left + dx > 0 ? this.activeWidget.widgetStyle.left + dx : 0;
            this.activeWidget.mousePoint.x = e.screenX;
          }
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

  onActivateWidget(widget:NgWidget){
    this.activeWidget = widget;
  }

  addWidget():any{

    function guid(){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var newWidget = {
      id: guid()
    };
    this.widgets.push(newWidget);

    return newWidget;
  }

  ngAfterViewInit(){

  }

}
