

var 
    gulp    = require('gulp'),
    less    = require('gulp-less');



gulp.task('testless', function () {
    gulp 
        .src('src/less/index.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

gulp.task('default', ['testless']);