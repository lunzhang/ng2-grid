import { Component, ViewChild,ngAfterViewInit} from '@angular/core';
import { NgGrid } from '../src/main';
import { ContentComponent } from './content/content.component';

@Component({
    selector: 'my-app',
    template: '<grid></grid>'
})
export class AppComponent {

    @ViewChild(NgGrid) grid : NgGrid;

    ngAfterViewInit(){
      var widget = this.grid.addWidget();
      widget.content = ContentComponent;
    }

}
