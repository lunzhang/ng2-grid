import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ContentComponent }   from './content/content.component';
import { GridModule } from '../src/main';

@NgModule({
  imports:      [ BrowserModule, GridModule ],
  declarations: [ AppComponent,ContentComponent ],
  entryComponents: [ ContentComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
