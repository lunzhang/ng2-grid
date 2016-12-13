import { Component,HostListener,ViewChild,ViewChildren,ngAfterViewInit} from '@angular/core';
import { NgWidget } from '../widget/widget';
import { NgWidgetShadow } from '../widgetshadow/widgetshadow';

@Component({
  selector: 'grid',
    template: '<div #grid [ngStyle]="gridStyle"> <widget-shadow [gridConfig]="gridConfig" > </widget-shadow>'+
    '<widget *ngFor="let widget of widgets" (onActivateWidget)="onActivateWidget($event)" '+
    '[content]="widget.content" [position]="widget.position" [gridConfig]="gridConfig" > </widget> </div>'
})
export class NgGrid {

  @ViewChild('grid') grid;
  @ViewChildren(NgWidget) ngWidgets : QueryList<NgWidget>;
  @ViewChild(NgWidgetShadow) ngWidgetShadow;

  public gridStyle= {
    'width':'100%',
    'height':'100%',
    'background-color':'lightgrey',
    'position':'relative'
  };
  public gridConfig={
    colWidth:250,
    rowHeight:180,
    marginLeft:10,
    marginTop:10,
    marginRight:10,
    marginBottom:10
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
          let dx = e.screenX - this.activeWidget.mousePoint.x;
          let dy = e.screenY - this.activeWidget.mousePoint.y;
          let gridPos = this._getPosition();

          if(this.ngWidgetShadow.position.row != gridPos.row || this.ngWidgetShadow.position.col != gridPos.col){
            this.ngWidgetShadow.setPosition(gridPos);
          }
          if(this.activeWidget.style.top > 0 || dy > 0){
            this.activeWidget.style.top = this.activeWidget.style.top + dy > 0 ? this.activeWidget.style.top + dy : 0;
            this.activeWidget.mousePoint.y = e.screenY;
          }
          if(this.activeWidget.style.left > 0 || dx > 0){
            this.activeWidget.style.left = this.activeWidget.style.left + dx > 0 ? this.activeWidget.style.left + dx : 0;
            this.activeWidget.mousePoint.x = e.screenX;
          }
        } else if(this.activeWidget.isResize){
          let size = this._getSize();

          if(this.ngWidgetShadow.size.x != size.x || this.ngWidgetShadow.size.y != size.y){
            this.ngWidgetShadow.setSize(size);
          }
          this.activeWidget.style.height =  this.activeWidget.style.height + (e.screenY - this.activeWidget.mousePoint.y);
          this.activeWidget.style.width = this.activeWidget.style.width + (e.screenX - this.activeWidget.mousePoint.x);
          this.activeWidget.mousePoint.y = e.screenY;
          this.activeWidget.mousePoint.x = e.screenX;
        }
      }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e){
    if(this.activeWidget){
      if(this.activeWidget.isDrag){
        this.activeWidget.setPosition(this.ngWidgetShadow.position);
      }else if(this.activeWidget.isResize){
        this.activeWidget.setSize(this.ngWidgetShadow.size);
      }
      this.ngWidgetShadow.deactivate();
      this.activeWidget.resetMouse();
      this.activeWidget = null;
    }
  }

  onActivateWidget(widget:NgWidget){
    this.ngWidgetShadow.activate();
    this.ngWidgetShadow.setPosition(widget.position);
    this.ngWidgetShadow.setSize(widget.size);
    this.activeWidget = widget;
  }

  addWidget():any{

    function guid(){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    let newWidget = {
      id: guid(),
      position:{
        'col':1,
        'row':1
      }
    };
    this.widgets.push(newWidget);

    return newWidget;
  }

  empty(){
    this.widgets = [];
  }

  private _getPosition(){
    let col = Math.round(this.activeWidget.style.left / (this.gridConfig.colWidth + this.gridConfig.marginLeft/2))+ 1;
		let row = Math.round(this.activeWidget.style.top / (this.gridConfig.rowHeight + this.gridConfig.marginTop/2)) + 1;

    return {'col':col,'row':row};
  }

  private _getSize(){
    let x =  Math.round(this.activeWidget.style.width / (this.gridConfig.colWidth + this.gridConfig.marginLeft/2));
    let y =  Math.round(this.activeWidget.style.height / (this.gridConfig.rowHeight + this.gridConfig.marginTop/2));

    return {'x':x,'y':y};
  }

  private _getMousePosition(e) {
		const refPos: any = this.grid.nativeElement.getBoundingClientRect();

		let left: number = e.clientX - refPos.left;
		let top: number = e.clientY - refPos.top;

		return {
			left: left,
			top: top
		};
	}

  private _findWidgetById(id){
    for(let i = 0;i < this.ngWidgets.length;i++){
      if(this.ngWidgets[i].id == id){
        return this.ngWidgets[i];
      }
    }
  }

}
