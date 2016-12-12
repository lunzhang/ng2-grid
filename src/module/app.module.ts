import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgGrid } from '../grid/grid';
import { NgWidget } from '../widget/widget';
import { NgWidgetShadow } from '../widgetshadow/widgetshadow';

@NgModule({
  imports:[BrowserModule],
  declarations:[ NgGrid,NgWidget,NgWidgetShadow ],
  exports:[ NgGrid,NgWidget,NgWidgetShadow ]
})
export class GridModule{

}
