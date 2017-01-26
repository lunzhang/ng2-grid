export default {
  entry: 'dist/main.js',
  dest: 'dist/bundles/ng2-grid.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.ng2-grid',
  globals: {
    '@angular/core': 'ng.core'
  }
}
