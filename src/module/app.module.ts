import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgGrid } from '../grid/grid';
import { NgWidget } from '../widget/widget';
import { NgWidgetShadow } from '../widgetshadow/widgetshadow';

@NgModule({
  imports:[CommonModule],
  declarations:[ NgGrid,NgWidget,NgWidgetShadow ],
  exports:[ NgGrid,NgWidget,NgWidgetShadow ]
})
export class GridModule{

}
