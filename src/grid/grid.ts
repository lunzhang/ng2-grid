import { Component,HostListener,ViewChild,ViewChildren,Input,Output,EventEmitter,OnInit,QueryList} from '@angular/core';
import { NgWidget } from '../widget/widget';
import { NgWidgetShadow } from '../widgetshadow/widgetshadow';
import { GridItem } from '../griditem/griditem';

@Component({
  moduleId: module.id,
  selector: 'grid',
  templateUrl: './grid.html',
  styleUrls:['./grid.css']
})
export class NgGrid implements OnInit {

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

  public gridStyle:any= {};
  public gridConfig:any={'maxCol':5,'maxRow':5,'theme':'light','colWidth':250,'rowHeight':180,'marginLeft':10,
  'marginTop':10,'marginRight':10,'marginBottom':10,'minWidth':1,'minHeight':1,'maxWidth':-1,'maxHeight':-1
};
public activeWidget:NgWidget;
public widgets=[];
public windowScroll:any={x:0,y:0};

//sets custom config
ngOnInit(){
  for(var config in this.customConfig){
    this.gridConfig[config] = this.customConfig[config];
  }
  GridItem.gridConfig = this.gridConfig;
}

/** listens to mouse move event
    handles widget drag and resize
**/
@HostListener('mousemove', ['$event'])
onMouseMove(e){
  if(this.activeWidget){
    if(this.activeWidget.isDrag){
      this.onDrag.emit(this.activeWidget);
      let top = parseInt(this.activeWidget.style.top);
      let left = parseInt(this.activeWidget.style.left);
      let dx = e.clientX - this.activeWidget.mousePoint.x;
      let dy = e.clientY - this.activeWidget.mousePoint.y;
      let gridPos = this._getPosition();

      //updates if new col/row
      if(this.ngWidgetShadow.position.row != gridPos.row || this.ngWidgetShadow.position.col != gridPos.col){
        this._checkCollision(gridPos,this.activeWidget.size,this.activeWidget.id);
        this.ngWidgetShadow.setPosition(gridPos);
        this._calcGridSize();
      }
      //keeps widget in grid
      if(top > 0 || dy > 0){
        this.activeWidget.style.top = top + dy > 0 ? (top+dy).toString()+'px' : 0;
        this.activeWidget.mousePoint.y = e.clientY;
      }
      if(left > 0 || dx > 0){
        this.activeWidget.style.left = left + dx > 0 ? (left+dx).toString()+'px' : 0;
        this.activeWidget.mousePoint.x = e.clientX;
      }
    } else if(this.activeWidget.isResize){
      this.onResize.emit(this.activeWidget);
      let dx = e.clientX - this.activeWidget.mousePoint.x;
      let dy = e.clientY - this.activeWidget.mousePoint.y;
      let size = this._getSize();
      let height = parseInt(this.activeWidget.style.height);
      let width = parseInt(this.activeWidget.style.width);

      //updates if new col/row
      if(this.ngWidgetShadow.size.x != size.x || this.ngWidgetShadow.size.y != size.y){
        this._checkCollision(this.activeWidget.position,size,this.activeWidget.id)
        this.ngWidgetShadow.setSize(size);
        this._calcGridSize();
      }

      //checks for min and max height/width
      if(height + dy >= this.gridConfig.minHeight * this.gridConfig.rowHeight){
        if(this.gridConfig.maxHeight == -1 || height + dy <= this.gridConfig.maxHeight * this.gridConfig.rowHeight + this.gridConfig.marginTop){
          this.activeWidget.style.height = (height+dy).toString()+'px';
          this.activeWidget.mousePoint.y = e.clientY;
        }else{
          this.activeWidget.style.height = (this.gridConfig.maxHeight * this.gridConfig.rowHeight + this.gridConfig.marginTop).toString()+'px';
        }
      } else{
        this.activeWidget.style.height = (this.gridConfig.minHeight * this.gridConfig.rowHeight).toString()+'px';
      }
      if(width + dx  >= this.gridConfig.minWidth * this.gridConfig.colWidth){
        if(this.gridConfig.maxWidth == -1 || width + dx <= this.gridConfig.maxWidth * this.gridConfig.colWidth + this.gridConfig.marginLeft){
          this.activeWidget.style.width = (width+dx).toString()+'px';
          this.activeWidget.mousePoint.x = e.clientX;
        }else{
          this.activeWidget.style.width = (this.gridConfig.maxWidth * this.gridConfig.colWidth + this.gridConfig.marginLeft).toString()+'px';
        }
      }else{
        this.activeWidget.style.width = (this.gridConfig.minWidth * this.gridConfig.colWidth).toString()+'px';
      }

    }
  }
}

/** listens to mouse up event
    emits onDragStop/onResizeStop event
    sets active widget to widget shadow coordinates
    deactivates shadow widget
**/
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

/** listens to window scroll event
    updates widget position if dragged and scrolling
**/
@HostListener('window:scroll',['$event'])
onScroll(e){
  if(this.activeWidget){
    if(this.activeWidget.isDrag){
      var dx = window.scrollX - this.windowScroll.x;
      var dy = window.scrollY - this.windowScroll.y;
      let top = parseInt(this.activeWidget.style.top);
      let left = parseInt(this.activeWidget.style.left);
      let gridPos = this._getPosition();

      //updates if new row/col
      if(this.ngWidgetShadow.position.row != gridPos.row || this.ngWidgetShadow.position.col != gridPos.col){
        this._checkCollision(gridPos,this.activeWidget.size,this.activeWidget.id);
        this.ngWidgetShadow.setPosition(gridPos);
        this._calcGridSize();
      }
      //check if in grid
      if(top > 0 || dy > 0){
        this.activeWidget.style.top = top + dy > 0 ? (top + dy).toString()+'px' : 0;
      }
      if(left > 0 || dx > 0){
        this.activeWidget.style.left = left + dx > 0 ? (left + dx).toString()+'px' : 0;
      }
    }
  }
  this.windowScroll.x = window.scrollX;
  this.windowScroll.y = window.scrollY;
}

/** on widget event
  drag or resize event
  activates widget shadow
**/
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

//removes specific widget
onClose(widget:NgWidget){
  for(var i = 0; i < this.widgets.length;i++){
    if(this.widgets[i].id == widget.id){
      this.widgets.splice(i,1);
    }
  }
}

//adds a widget in empty column with unique guid
addWidget():any{

  //generates unique guid
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
      'x':GridItem.gridConfig.minWidth,
      'y':GridItem.gridConfig.minHeight
    }
  };
  this.widgets.push(newWidget);
  this._calcGridSize();
  return newWidget;
}

//removes all widgets
empty(){
  this.widgets = [];
}

//position of active widget
private _getPosition(){
  let col = Math.round(parseInt(this.activeWidget.style.left) / (this.gridConfig.colWidth + this.gridConfig.marginLeft/2))+ 1;
  let row = Math.round(parseInt(this.activeWidget.style.top) / (this.gridConfig.rowHeight + this.gridConfig.marginTop/2)) + 1;

  return {'col':col,'row':row};
}

//size of active widget
private _getSize(){
  let x =  Math.round(parseInt(this.activeWidget.style.width) / (this.gridConfig.colWidth + this.gridConfig.marginLeft/2));
  let y =  Math.round(parseInt(this.activeWidget.style.height) / (this.gridConfig.rowHeight + this.gridConfig.marginTop/2));
  return {'x':x,'y':y};
}

//gets the current mouse position inside the grid
private _getMousePosition(e) {
  const refPos: any = this.grid.nativeElement.getBoundingClientRect();
  let left: number = e.clientX - refPos.left;
  let top: number = e.clientY - refPos.top;
  return {
    left: left,
    top: top
  };
}

//finds ngwidget by id
private _findNgWidgetById(id){
  for(let i = 0;i < this.ngWidgets.length;i++){
    if(this.ngWidgets[i].id == id){
      return this.ngWidgets[i];
    }
  }
}

//finds widget by id
private _findWidgetById(id){
  for(let i = 0;i < this.widgets.length;i++){
    if(this.widgets[i].id == id){
      return this.widgets[i];
    }
  }
}

//finds empty column in the grid
private _findEmptyCol(){
  var col = 0;
  this.widgets.forEach((widget)=>{
    if(widget.position.col + widget.size.x > col)
    col = widget.position.col + widget.size.x - 1;
  });
  return col+1;
}

//find widgets that are colliding with the given position
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

//checks for widget collision and adjusts accordingly
private _checkCollision(position,size,id){
  var collisions = this._getCollision(position,size,id);
  collisions.forEach((widget)=>{
    widget.position.row = position.row + size.y;
    widget.calcPosition();
    this._checkCollision(widget.position,widget.size,widget.id);
  });
}

//recalcs grid size
private _calcGridSize(){
  var maxRow = this.gridConfig.maxRow;
  var maxCol = this.gridConfig.maxCol;
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
  this.gridStyle.width = ((maxCol * (this.gridConfig.colWidth+2)) + (maxCol * this.gridConfig.marginLeft)
  + this.gridConfig.marginRight).toString()+'px';
  this.gridStyle.height = ((maxRow * (this.gridConfig.rowHeight+2)) + (maxRow * this.gridConfig.marginTop)
  + this.gridConfig.marginBottom).toString()+'px';
}

}
