var gulp = require('gulp');
var path = require('path');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var merge = require('merge2');

var tsProject = typescript.createProject('tsconfig.build.json');

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('copy', function () {
	return gulp.src(['src/**'], {
            base: 'src/'
        }).pipe(gulp.dest('dist'));
});

gulp.task('rename', function () {
	return gulp.src(['dist/*.ts','dist/**/*.ts'])
       .pipe(ext_replace('.d.ts'))
			 .pipe(gulp.dest('dist'));
});


gulp.task('ts',function(){
	var tsResult = tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject());

	return merge([
		tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest(path.join('dist'))),
		tsResult.dts.pipe(gulp.dest(path.join('dist')))
	]);
});

gulp.task('build', function() {
	return gulp.start('ts');
});
