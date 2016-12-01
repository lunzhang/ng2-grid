import { Component,HostListener,HostBinding,Output,Input,ViewChild,EventEmitter} from '@angular/core';
@Component({
  selector: 'widget',
  template: '<div [ngStyle]="widgetStyle"> <span [ngStyle]="headerStyle" #header class="widget-header"></span>'+
  '<div [ngStyle]="contentStyle"> </div>'+
  '<span [ngStyle]="resizeStyle" #resizer class="widget-resize"></span> </div>'
})
export class NgWidget {

  public widgetStyle={
      'width': 300,
      'height': 300,
      'background-color':'white',
      'position':'absolute',
      'overflow':'hidden',
      'top': 30,
      'left': 500,
      'border':'1px solid black',
      'cursor':'auto'
  }
  public resizeStyle={
    'width':'24',
    'height':'24',
    'position':'absolute',
    'bottom':'0',
    'right':'0',
    'cursor':'nwse-resize',
    'background':'repeating-linear-gradient(45deg,#a2a2a7,#bcbdc3 5px,#a2a4ab 5px,#797a80 6px)'
  }
  public headerStyle={
    'width': '100%',
    'height': 50,
    'position':'absolute',
    'border-bottom':'1px solid black',
    'cursor':'move'
  }
  public contentStyle={
    'top': this.headerStyle.height,
    'position':'relative',
    'height': 'calc(100% - ' + this.headerStyle.height +'px)'
  }

  public isDrag:boolean=false;
  public isResize:boolean=false;
  public mousePoint:any= {};

  @Output() onActivateWidget = new EventEmitter<NgWidget>();

  @ViewChild('header') header;
  @ViewChild('resizer') resizer;

  @HostListener('mousedown', ['$event'])
  onMouseDown(e){
    if(e.srcElement == this.header.nativeElement){
        this.isDrag = true;
        this.mousePoint.x = e.screenX;
        this.mousePoint.y = e.screenY;
        this.onActivateWidget.emit(this);
    } else if(e.srcElement == this.resizer.nativeElement){
        this.isResize = true;
        this.mousePoint.x = e.screenX;
        this.mousePoint.y = e.screenY;
        this.onActivateWidget.emit(this);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e){
  }

  resetMouse(){
    this.isDrag = false;
    this.isResize = false;
  }

}
