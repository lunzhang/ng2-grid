import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgGrid } from './grid/grid';
import { NgWidget } from './widget/widget';

@NgModule({
  imports:[BrowserModule],
  declarations:[ NgGrid,NgWidget ],
  exports:[ NgGrid,NgWidget ]
})
export class GridModule{

}
