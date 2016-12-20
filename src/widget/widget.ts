import { Component,HostListener,HostBinding,Output,Input,ngOnInit,ViewChild,EventEmitter,ComponentFactoryResolver,ngAfterViewInit,ViewContainerRef} from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  selector: 'widget',
  template: '<div [ngStyle]="style" [id]="id" class="widget">'+
  '<div [ngStyle]="headerStyle" #header class="widget-header"> </div>'+
  '<div [ngStyle]="contentStyle" class="widget-content"><div #target></div> </div>'+
  '<div [ngStyle]="resizeStyle" #resizer class="widget-resize"></div> </div>',
  styles:['.widget{background-color:#121212;border:1px solid #ad2828;}'+
  '.widget-resize{width:20;height:20;bottom:0;right:0;background:repeating-linear-gradient(45deg,#171717,#171717 5px,#ad2828 5px,#ad2828 6px);}' +
'.widget-header{height:50;border-bottom:1px solid #ad2828;}'+
'.widget-content{top:52;height:calc(100% - 60px);padding:5px;color:white;}']
})
export class NgWidget extends GridItem {

  public style:any={
      'position':'absolute',
      'overflow':'hidden',
      'cursor':'auto'
  };
  public resizeStyle={
    'position':'absolute',
    'cursor':'nwse-resize'
  };
  public headerStyle={
    'width': '100%',
    'position':'absolute',
    'cursor':'move'
  };
  public contentStyle={
    'position':'relative',
    'overflow':'auto'
  };

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
        this.mousePoint.x = e.clientX;
        this.mousePoint.y = e.clientY;
        this.onActivateWidget.emit(this);
    } else if(e.srcElement == this.resizer.nativeElement){
        this.isResize = true;
        this.mousePoint.x = e.clientX;
        this.mousePoint.y = e.clientY;
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

  ngOnChanges(changes){
    if(changes.content){
      this.target.clear();
      let factory = this.componentFactoryResolver.resolveComponentFactory(this.content);
      this.target.createComponent(factory);
    }
  }

}
