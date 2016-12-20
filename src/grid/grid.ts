import { Component,HostListener,ViewChild,ViewChildren,Input,Output,EventEmitter,ngOnInit} from '@angular/core';
import { NgWidget } from '../widget/widget';
import { NgWidgetShadow } from '../widgetshadow/widgetshadow';

@Component({
  selector: 'grid',
    template: '<div #grid [ngStyle]="gridStyle" class="grid"> <widget-shadow [gridConfig]="gridConfig" > </widget-shadow>'+
    '<widget *ngFor="let widget of widgets" (onActivateWidget)="onActivateWidget($event)" '+
    '[id]="widget.id" [content]="widget.content" [position]="widget.position" [gridConfig]="gridConfig" > </widget> </div>',
    styles:['.grid{background-color:#0c0d0d;}']
})
export class NgGrid implements ngOnInit {

  @Output() public onDragStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onDrag: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onDragStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResizeStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResize: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResizeStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();

  @ViewChild('grid') grid;
  @ViewChildren(NgWidget) ngWidgets : QueryList<NgWidget>;
  @ViewChild(NgWidgetShadow) ngWidgetShadow;

  @Input() customConfig:any;

  public gridStyle:any= {
    'position':'relative',
    '-webkit-touch-callout': 'none',
    '-webkit-user-select': 'none',
     '-khtml-user-select': 'none',
       '-moz-user-select': 'none',
        '-ms-user-select': 'none',
            'user-select': 'none'
  };
  public gridConfig:any={
    'colWidth':250,
    'rowHeight':180,
    'marginLeft':10,
    'marginTop':10,
    'marginRight':10,
    'marginBottom':10,
    'minWidth':1,
    'minHeight':1,
    'maxWidth':-1,
    'maxHeight':-1
  };
  public activeWidget:NgWidget;
  public widgets=[];
  public windowScroll:any={
    x:0,
    y:0
  };

  ngOnInit(){
    for(var config in this.customConfig){
      this.gridConfig[config] = this.customConfig[config];
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e){
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e){
      if(this.activeWidget){
        if(this.activeWidget.isDrag){
          this.onDrag.emit(this.activeWidget);
          let dx = e.clientX - this.activeWidget.mousePoint.x;
          let dy = e.clientY - this.activeWidget.mousePoint.y;
          let gridPos = this._getPosition();

          if(this.ngWidgetShadow.position.row != gridPos.row || this.ngWidgetShadow.position.col != gridPos.col){
              this._checkCollision(gridPos,this.activeWidget.size,this.activeWidget.id);
              this.ngWidgetShadow.setPosition(gridPos);
              this._calcGridSize();
          }
          if(this.activeWidget.style.top > 0 || dy > 0){
            this.activeWidget.style.top = this.activeWidget.style.top + dy > 0 ? this.activeWidget.style.top + dy : 0;
            this.activeWidget.mousePoint.y = e.clientY;
          }
          if(this.activeWidget.style.left > 0 || dx > 0){
            this.activeWidget.style.left = this.activeWidget.style.left + dx > 0 ? this.activeWidget.style.left + dx : 0;
            this.activeWidget.mousePoint.x = e.clientX;
          }
        } else if(this.activeWidget.isResize){
          this.onResize.emit(this.activeWidget);
          let dx = e.clientX - this.activeWidget.mousePoint.x;
          let dy = e.clientY - this.activeWidget.mousePoint.y;
          let size = this._getSize();

          if(this.ngWidgetShadow.size.x != size.x || this.ngWidgetShadow.size.y != size.y){
            this._checkCollision(this.activeWidget.position,size,this.activeWidget.id)
            this.ngWidgetShadow.setSize(size);
            this._calcGridSize();
          }
          if(this.activeWidget.style.height + dy >= this.gridConfig.minHeight * this.gridConfig.rowHeight){
            if(this.gridConfig.maxHeight == -1 || this.activeWidget.style.height + dy <= this.gridConfig.maxHeight * this.gridConfig.rowHeight + this.gridConfig.marginTop){
              this.activeWidget.style.height += dy;
              this.activeWidget.mousePoint.y = e.clientY;
            }else{
              this.activeWidget.style.height = this.gridConfig.maxHeight * this.gridConfig.rowHeight + this.gridConfig.marginTop;
            }
          } else{
            this.activeWidget.style.height = this.gridConfig.minHeight * this.gridConfig.rowHeight;
          }
          if(this.activeWidget.style.width + dx  >= this.gridConfig.minWidth * this.gridConfig.colWidth){
            if(this.gridConfig.maxWidth == -1 || this.activeWidget.style.width + dx <= this.gridConfig.maxWidth * this.gridConfig.colWidth + this.gridConfig.marginLeft){
               this.activeWidget.style.width += dx;
               this.activeWidget.mousePoint.x = e.clientX;
             }else{
               this.activeWidget.style.width = this.gridConfig.maxWidth * this.gridConfig.colWidth + this.gridConfig.marginLeft;
             }
          }else{
            this.activeWidget.style.width = this.gridConfig.minWidth * this.gridConfig.colWidth;
          }

        }
      }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e){
    if(this.activeWidget){
      if(this.activeWidget.isDrag){
        this.onDragStop.emit(this.activeWidget);
        this.activeWidget.setPosition(this.ngWidgetShadow.position);
        this._findWidgetById(this.activeWidget.id).position = this.ngWidgetShadow.position;
        this._calcGridSize();
      }else if(this.activeWidget.isResize){
        this.onResizeStop.emit(this.activeWidget);
        this.activeWidget.setSize(this.ngWidgetShadow.size);
        this._findWidgetById(this.activeWidget.id).size = this.ngWidgetShadow.size;
        this._calcGridSize();
      }
      this.ngWidgetShadow.deactivate();
      this.activeWidget.reset();
      this.activeWidget = null;
    }
  }

  @HostListener('window:scroll',['$event'])
  onScroll(e){
    if(this.activeWidget){
      if(this.activeWidget.isDrag){
        var dx = window.scrollX - this.windowScroll.x;
        var dy = window.scrollY - this.windowScroll.y;
        let gridPos = this._getPosition();

        if(this.ngWidgetShadow.position.row != gridPos.row || this.ngWidgetShadow.position.col != gridPos.col){
            this._checkCollision(gridPos,this.activeWidget.size,this.activeWidget.id);
            this.ngWidgetShadow.setPosition(gridPos);
            this._calcGridSize();
        }
        if(this.activeWidget.style.top > 0 || dy > 0){
          this.activeWidget.style.top = this.activeWidget.style.top + dy > 0 ? this.activeWidget.style.top + dy : 0;
        }
        if(this.activeWidget.style.left > 0 || dx > 0){
          this.activeWidget.style.left = this.activeWidget.style.left + dx > 0 ? this.activeWidget.style.left + dx : 0;
        }
      }
    }
    this.windowScroll.x = window.scrollX;
    this.windowScroll.y = window.scrollY;
  }

  onActivateWidget(widget:NgWidget){
    if(widget.isDrag){
      this.onDragStart.emit(widget);
    }else if(widget.isResize){
      this.onResizeStart.emit(widget);
    }
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

    var emptyCol = this._findEmptyCol();

    let newWidget = {
      id: guid(),
      position:{
        'col': emptyCol,
        'row': 1
      },
      size:{
        'x':1,
        'y':1
      }
    };
    this.widgets.push(newWidget);
    this._calcGridSize();
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

  private _findNgWidgetById(id){
    for(let i = 0;i < this.ngWidgets.length;i++){
      if(this.ngWidgets[i].id == id){
        return this.ngWidgets[i];
      }
    }
  }

  private _findWidgetById(id){
    for(let i = 0;i < this.widgets.length;i++){
      if(this.widgets[i].id == id){
        return this.widgets[i];
      }
    }
  }

  private _findEmptyCol(){
    var col = 0;
    this.widgets.forEach((widget)=>{
      if(widget.position.col > col)
        col = widget.position.col;
    });
    return col+1;
  }

  private _getCollision(position,size,id){
    var collisions=[];
    this.ngWidgets.forEach((widget)=>{
        if(widget.id != id && widget.id != this.activeWidget.id){
          if(((widget.position.col >= position.col && widget.position.col < position.col + size.x)
          || (widget.position.col + widget.size.x-1 >= position.col && widget.position.col + widget.size.x-1 < position.col + size.x)
        || (position.col >= widget.position.col && position.col < widget.position.col + widget.size.x))
        && ((widget.position.row >= position.row && widget.position.row < position.row + size.y)
      || (widget.position.row + widget.size.y-1 >= position.row && widget.position.row + widget.size.y-1 < position.row + size.y)
    || (position.row >= widget.position.row && position.row < widget.position.row + widget.size.y))){
              collisions.push(widget);
          }
        }
    });
    return collisions;
  }

  private _checkCollision(position,size,id){
    var collisions = this._getCollision(position,size,id);
    collisions.forEach((widget)=>{
      widget.position.row = position.row + size.y;
      widget.calcPosition();
      this._checkCollision(widget.position,widget.size,widget.id);
    });
  }

  private _calcGridSize(){
    var maxCol = 5;
    var maxRow = 5;
    this.widgets.forEach((widget)=>{
          if( (widget.position.col + widget.size.x - 1) > maxCol )
            maxCol = widget.position.col + widget.size.x - 1;
          if((widget.position.row + widget.size.y -1) > maxRow)
            maxRow = widget.position.row + widget.size.y -1;
    });
    if((this.ngWidgetShadow.position.col + this.ngWidgetShadow.size.x - 1) > maxCol )
      maxCol = this.ngWidgetShadow.position.col + this.ngWidgetShadow.size.x - 1;
    if((this.ngWidgetShadow.position.row + this.ngWidgetShadow.size.y -1) > maxRow)
      maxRow = this.ngWidgetShadow.position.row + this.ngWidgetShadow.size.y -1;
    this.gridStyle.width = (maxCol * (this.gridConfig.colWidth+2)) + (maxCol * this.gridConfig.marginLeft)
    + this.gridConfig.marginRight;
    this.gridStyle.height = (maxRow * (this.gridConfig.rowHeight+2)) + (maxRow * this.gridConfig.marginTop)
    + this.gridConfig.marginBottom;
  }

}
