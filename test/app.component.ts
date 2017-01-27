import { Component, ViewChild,AfterViewInit} from '@angular/core';
import { NgGrid } from '../src/main';
import { ContentComponent } from './content/content.component';

@Component({
    selector: 'my-app',
    template: '<grid [customConfig]="customConfig"></grid>'
})
export class AppComponent implements AfterViewInit{

    @ViewChild(NgGrid) grid : NgGrid;

    public customConfig = {
      'maxWidth':5,
      'maxHeight':5,
      'minWidth':2,
      'minHeight':2,
      'theme':'sky'
    };
    ngAfterViewInit(){
      for(let i = 0;i < 3; i++){
        var widget = this.grid.addWidget();
        widget.content = ContentComponent;
        widget.widgetTitle = widget.id;
      }
      (<any>window).grid = this.grid;
    }

}
