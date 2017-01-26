var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');

function promiseify(fn) {
  return function() {
    const args = [].slice.call(arguments, 0);
    return new Promise((resolve, reject) => {
      fn.apply(this, args.concat([function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }]));
    });
  };
}

const fs = require('fs');
const glob = require('glob');
const readFile = promiseify(fs.readFile);
const writeFile = promiseify(fs.writeFile);

var paths = {
  sass: ['./src/**/*.scss']
};

//compiles sass
gulp.task('sass',function(){
	gulp.src(paths.sass, {base: "./"}).pipe(sass().on('error', sass.logError))
	.pipe(minifyCss())
	.pipe(gulp.dest("."));
});

//copies css and html files
gulp.task('copy',function(){
  gulp.src(['src/**/*.css'], {
    base: 'src/'
  }).pipe(gulp.dest('dist'));
  gulp.src(['src/**/*.html'], {
    base: 'src/'
  }).pipe(gulp.dest('dist'));
});

//watch task
gulp.task('watch',function(){
	gulp.watch(paths.sass,['sass']);
});

/*
*change inline tempaltes, and stylesheets and remove moduleID
*taken from angular 2 material
*/
gulp.task('inline',()=>{
  inlineResources('dist');
  function inlineResources(globs) {
    if (typeof globs == 'string') {
      globs = [globs];
    }

    /**
     * For every argument, inline the templates and styles under it and write the new file.
     */
    return Promise.all(globs.map(pattern => {
      if (pattern.indexOf('*') < 0) {
        // Argument is a directory target, add glob patterns to include every files.
        pattern = path.join(pattern, '**', '*');
      }

      const files = glob.sync(pattern, {})
        .filter(name => /\.js$/.test(name));  // Matches only JavaScript files.

      // Generate all files content with inlined templates.
      return Promise.all(files.map(filePath => {
        return readFile(filePath, 'utf-8')
          .then(content => inlineResourcesFromString(content, url => {
            return path.join(path.dirname(filePath), url);
          }))
          .then(content => writeFile(filePath, content))
          .catch(err => {
            console.error('An error occurred: ', err);
          });
      }));
    }));
  }

  function inlineResourcesFromString(content, urlResolver) {
    // Curry through the inlining functions.
    return [
      inlineTemplate,
      inlineStyle,
      removeModuleId
    ].reduce((content, fn) => fn(content, urlResolver), content);
  }

  function inlineTemplate(content, urlResolver) {
    return content.replace(/templateUrl:\s*'([^']+?\.html)'/g, function(m, templateUrl) {
      const templateFile = urlResolver(templateUrl);
      const templateContent = fs.readFileSync(templateFile, 'utf-8');
      const shortenedTemplate = templateContent
        .replace(/([\n\r]\s*)+/gm, ' ')
        .replace(/"/g, '\\"');
      return `template: "${shortenedTemplate}"`;
    });
  }

  function inlineStyle(content, urlResolver) {
    return content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function(m, styleUrls) {
      const urls = eval(styleUrls);
      return 'styles: ['
        + urls.map(styleUrl => {
            const styleFile = urlResolver(styleUrl);
            const styleContent = fs.readFileSync(styleFile, 'utf-8');
            const shortenedStyle = styleContent
              .replace(/([\n\r]\s*)+/gm, ' ')
              .replace(/"/g, '\\"');
            return `"${shortenedStyle}"`;
          })
          .join(',\n')
        + ']';
    });
  }

  function removeModuleId(content) {
    return content.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '');
  }

});
