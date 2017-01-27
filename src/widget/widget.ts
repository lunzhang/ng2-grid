import { Component,HostListener,HostBinding,Output,Input,OnInit,ViewChild,EventEmitter,ComponentFactoryResolver,AfterViewInit,ViewContainerRef} from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  moduleId: module.id,
  selector: 'widget',
  templateUrl: './widget.html',
  styleUrls:['./widget.css']
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
    'position':'relative',
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
  @Output() onClose = new EventEmitter<NgWidget>();
  @Input() innerComponent;
  @Input() innerHTML;
  @Input() position;
  @Input() gridConfig;
  @Input() id;
  @Input() widgetTitle;

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
    if(e.srcElement == this.header.nativeElement || e.srcElement.parentElement == this.header.nativeElement){
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
    if(changes.innerComponent && changes.innerComponent.currentValue){
      this.target.clear();
      let factory = this.componentFactoryResolver.resolveComponentFactory(this.innerComponent);
      this.target.createComponent(factory);
    }
  }

  close(){
    this.onClose.emit(this);
  }
}
