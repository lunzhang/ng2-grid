#Angular 2 Grid Component
A grid component for angular 2 application. [demo](https://lunzhang.github.io/ng2#/grid)

### Installation
----------
1.npm install ng2-grid-component

2.import in @NgModule 
```typescript
import { GridModule } from 'ng2-grid-component';

@NgModule({
  imports:      [ GridModule ]....
```

3.add into systemjs.config.js
```typescript
map: {
'ng2-grid-component':'npm:ng2-grid-component/src'....
},
packages: {
'ng2-grid-component':{
        main: './main.js',
        defaultExtension: 'js'
      }...
}
```
4.use in your component
```typescript
import { NgGrid } from 'ng2-grid-component';
@Component({
    selector: 'my-app',
    template: '<grid></grid>'
})
export class AppComponent {
    @ViewChild(NgGrid) grid : NgGrid;
    ngAfterViewInit(){
      var widget = this.grid.addWidget();
    }
}
```
5.To load component into widget

5.1.add component to @NgModule
```typescript
import { ContentComponent }   from './content/content.component';
@NgModule({
   ...
  declarations: [ContentComponent ],
  entryComponents: [ ContentComponent ]...
})
```
5.2 add component to widget
```typescript
import { ContentComponent } from './content/content.component';

var widget = this.grid.addWidget();
widget.content = ContentComponent;
```
