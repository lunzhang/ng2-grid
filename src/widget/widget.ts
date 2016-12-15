import { Component,HostListener,HostBinding,Output,Input,ngOnInit,ViewChild,EventEmitter,ComponentFactoryResolver,ngAfterViewInit,ViewContainerRef} from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  selector: 'widget',
  template: '<div [ngStyle]="style" [id]="id">'+
  '<div [ngStyle]="headerStyle" #header class="widget-header"> </div>'+
  '<div [ngStyle]="contentStyle"><span  #target></span> </div>'+
  '<div [ngStyle]="resizeStyle" #resizer class="widget-resize"></div> </div>'
})
export class NgWidget extends GridItem {

  public style:any={
      'background-color':'white',
      'position':'absolute',
      'overflow':'hidden',
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
  @Input() content;
  @Input() position;
  @Input() gridConfig;
  @Input() id;

  @ViewChild('header') header;
  @ViewChild('resizer') resizer;
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver){
    super();
  }

  ngOnInit(){
      this.calcPosition();
      this.calcSize();
  }

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
    this.style['z-index'] = '1';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e){
  }

  reset(){
    this.style['z-index'] = 'auto';
    this.isDrag = false;
    this.isResize = false;
  }

  ngOnChanges(){
    let factory = this.componentFactoryResolver.resolveComponentFactory(this.content);
    this.target.createComponent(factory)
  }

}
