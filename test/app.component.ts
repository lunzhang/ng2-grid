import { Component, ViewChild,ngAfterViewInit} from '@angular/core';
import { NgGrid } from '../src/main';

@Component({
    selector: 'my-app',
    template: '<grid></grid>'
})
export class AppComponent {

    @ViewChild(NgGrid) grid : NgGrid;

    ngAfterViewInit(){
      this.grid.addWidget();
    }

}
