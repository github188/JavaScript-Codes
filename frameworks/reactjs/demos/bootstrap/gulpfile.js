
var gulp = require('gulp'),
    sass = require('gulp-sass');


// sass 转换
gulp.task('sass', function () {

    return gulp
        .src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css/'));
});

// 监听 sass 文件变化
gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/*.scss', ['sass']);
});


gulp.task('default', ['sass', 'sass:watch']);