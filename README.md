#Angular 2 Grid Component
A grid component for angular 2 application. [demo](https://lunzhang.github.io/ng2#/grid)

### Installation
----------
1 ```npm install --save ng2-grid-component```

2 Import in @NgModule
```typescript
import { GridModule } from 'ng2-grid-component';

@NgModule({
  imports:      [ GridModule ]....
```

3 Use in your component
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

4.1 Add Custom component to @NgModule
```typescript
import { CustomComponent }   from './custom/custom.component';
@NgModule({
   ...
  declarations: [CustomComponent ],
  entryComponents: [ CustomComponent ]...
})
```
4.2 Add Custom component to widget
```typescript
import { CustomComponent } from './custom/custom.component';

var widget = this.grid.addWidget();
widget.innerComponent = CustomComponent; //or
widget.innerHTML = "<div> Hello I'm inside the widget </div>";
```

### Systemjs Users
```typescript
map: {
  'ng2-grid-component':'npm:ng2-grid-component/dist/bundles/ng2-grid.umd.min.js'....
}

```
### Config
```typescript
{
  'maxCol':5,
  'maxRow':5,
  'theme':'light',
  'colWidth':250,
  'rowHeight':180,
  'marginLeft':10,
  'marginTop':10,
  'marginRight':10,
  'marginBottom':10,
  'minWidth':1,
  'minHeight':1,
  'maxWidth':-1,
  'maxHeight':-1
}
```
Example
```typescript
<grid [customConfig]="customConfig"></grid> .....
public customConfig = {
      'maxWidth':5,
      'maxHeight':5,
      'minWidth':2,
      'minHeight':2,
      'theme':'sky'
};
```
### Event Handling
grid emits these events
```typescript
  @Output() public onDragStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
  @Output() public onDrag: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
  @Output() public onDragStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
  @Output() public onResizeStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
  @Output() public onResize: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
  @Output() public onResizeStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
```
