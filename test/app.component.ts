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
      'maxWidth':2,
      'maxHeight':2,
      'theme':'dark'
    };
    ngAfterViewInit(){
      for(let i = 0;i < 5; i++){
        var widget = this.grid.addWidget();
        widget.content = ContentComponent;
        widget.widgetTitle = "Ng2-Grid";
      }
      (<any>window).grid = this.grid;
    }

}
