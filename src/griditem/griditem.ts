import { Input,OnInit } from '@angular/core';

export class GridItem{

  public style:any={};
  public position:any={};
  public size:any={'x':1,'y':1};

  public static gridConfig;

  setPosition(newPosition){
    this.position = newPosition;
    this.calcPosition();
  }

  setSize(newSize){
    this.size = newSize;
    this.calcSize();
  }

  calcPosition(){
    const x: number = (GridItem.gridConfig.colWidth + GridItem.gridConfig.marginLeft+2) * (this.position.col - 1) + GridItem.gridConfig.marginLeft;
    const y: number = (GridItem.gridConfig.rowHeight + GridItem.gridConfig.marginTop+2) * (this.position.row - 1) + GridItem.gridConfig.marginTop;
    this.style.left = x.toString()+'px';
    this.style.top = y.toString()+'px';
  }

  calcSize(){
    const w: number = (GridItem.gridConfig.colWidth * this.size.x) + (GridItem.gridConfig.marginLeft * (this.size.x - 1));
		const h: number = (GridItem.gridConfig.rowHeight * this.size.y) + (GridItem.gridConfig.marginTop * (this.size.y - 1));
    this.style.width = w.toString()+'px';
    this.style.height = h.toString()+'px';
  }

}
