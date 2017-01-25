#Angular 2 Grid Component
A grid component for angular 2 application. [demo](https://lunzhang.github.io/ng2#/grid)

### Installation
----------
1. ```npm install --save ng2-grid-component```

2. Import in @NgModule
```typescript
import { GridModule } from 'ng2-grid-component';

@NgModule({
  imports:      [ GridModule ]....
```

3. Use in your component
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
widget.content = CustomComponent;
```

### Systemjs Users
```typescript
map: {
'ng2-grid-component':'npm:ng2-grid-component/dist'....
},
packages: {
  'ng2-grid-component':{
    main: './main.js',
    defaultExtension: 'js'
  }

```
