const gulp = require('gulp');
const gOpen = require('gulp-open');

gulp.task('default', ['watch']);

gulp.task('watch', () => {
    gulp.watch('src/*', ['reloadExtension']);
});

gulp.task('reloadExtension', () => {
    gulp.src(__filename).pipe(gOpen({uri: "http://reload.extensions"}));
});