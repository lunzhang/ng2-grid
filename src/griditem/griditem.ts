import { Input,ngOnInit } from '@angular/core';

export class GridItem implements ngOnInit{

  public style:any={};
  public position:any={};
  public size:any={'x':1,'y':1};

  @Input() gridConfig;

  setPosition(newPosition){
    this.position = newPosition;
    this.calcPosition();
  }

  setSize(newSize){
    this.size = newSize;
    this.calcSize();
  }

  calcPosition(){
    const x: number = (this.gridConfig.colWidth + this.gridConfig.marginLeft+2) * (this.position.col - 1) + this.gridConfig.marginLeft;
    const y: number = (this.gridConfig.rowHeight + this.gridConfig.marginTop+2) * (this.position.row - 1) + this.gridConfig.marginTop;
    this.style.left = x;
    this.style.top = y;
  }

  calcSize(){
    const w: number = (this.gridConfig.colWidth * this.size.x) + (this.gridConfig.marginLeft * (this.size.x - 1));
		const h: number = (this.gridConfig.rowHeight * this.size.y) + (this.gridConfig.marginTop * (this.size.y - 1));
    this.style.width = w;
    this.style.height = h;
  }

}
