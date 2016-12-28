var gulp = require('gulp');
var path = require('path');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var merge = require('merge2');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var paths = {
  sass: ['./src/**/*.scss']
};
var tsProject = typescript.createProject('tsconfig.build.json');

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('copy', function () {
	return gulp.src(['src/**'], {
            base: 'src/'
        }).pipe(gulp.dest('dist'));
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

gulp.task('sass',function(){
	gulp.src(paths.sass, {base: "./"}).pipe(sass().on('error', sass.logError))
	.pipe(minifyCss())
	.pipe(gulp.dest("."));
});

gulp.task('build', function() {
  gulp.src(['src/**/*.css'], {
            base: 'src/'
        }).pipe(gulp.dest('dist'));
	return gulp.start('ts');
});

gulp.task('watch',function(){
	gulp.watch(paths.sass,['sass']);
});
