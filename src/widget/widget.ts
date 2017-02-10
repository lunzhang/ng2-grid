import { Component,HostListener,HostBinding,Output,Input,OnInit,ViewChild,EventEmitter,ComponentFactoryResolver,AfterViewInit,ViewContainerRef} from '@angular/core';
import { GridItem } from '../griditem/griditem';

@Component({
  moduleId: module.id,
  selector: 'widget',
  templateUrl: './widget.html',
  styleUrls:['./widget.css']
})
export class NgWidget extends GridItem {

  public style:any={};
  public size:any={'x':GridItem.gridConfig.minWidth,'y':GridItem.gridConfig.minHeight};

  public isDrag:boolean=false;
  public isResize:boolean=false;
  public mousePoint:any= {};

  @Output() onActivateWidget = new EventEmitter<NgWidget>();
  @Output() onClose = new EventEmitter<NgWidget>();
  @Input() innerComponent;
  @Input() innerHTML;
  @Input() position;
  @Input() id;
  @Input() widgetTitle;

  @ViewChild('header') header;
  @ViewChild('resizer') resizer;
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver){
    super();
  }

  ngOnInit(){
    this.calcSize();
    this.calcPosition();
  }

  /** mouse down event
      fires off drag/resize event
  **/
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

  //resets when widget is unactivated
  reset(){
    this.style['z-index'] = 'auto';
    this.isDrag = false;
    this.isResize = false;
  }

  /**ng listener for change
    creates inner component in widget
  **/
  ngOnChanges(changes){
    if(changes.innerComponent && changes.innerComponent.currentValue){
      this.target.clear();
      let factory = this.componentFactoryResolver.resolveComponentFactory(this.innerComponent);
      this.target.createComponent(factory);
    }
  }

  //destory widget
  close(){
    this.onClose.emit(this);
  }
}
