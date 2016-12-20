import { Component, ViewChild,ngAfterViewInit} from '@angular/core';
import { NgGrid } from '../src/main';
import { ContentComponent } from './content/content.component';

@Component({
    selector: 'my-app',
    template: '<grid [customConfig]="customConfig"></grid>'
})
export class AppComponent {

    @ViewChild(NgGrid) grid : NgGrid;

    public customConfig = {
      'maxWidth':5,
      'maxHeight':5
    };
    ngAfterViewInit(){
      for(let i = 0;i < 5; i++){
        var widget = this.grid.addWidget();
        widget.content = ContentComponent;
      }
      (<any>window).grid = this.grid;
    }

}
