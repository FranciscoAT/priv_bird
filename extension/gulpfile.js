const gulp = require('gulp');
const gOpen = require('gulp-open');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify-es').default;
const buffer = require('vinyl-buffer');

gulp.task('default', gulp.series(watch));
gulp.task('watch', gulp.series(watch));
gulp.task('reload', gulp.series(reload));

function watch() {
    let watchPath = 'src/content_scripts/';
    let watchFile = 'encrypt.src.js';
    gulp.watch(
        `${watchPath}${watchFile}`,
        (cb) => {
            compileScripts(watchPath, watchFile);
            cb();
        }
    );
}

function compileScripts(path, file) {
    let newFile = file.replace('.src', '.bundle.min');
    return browserify(`${path}${file}`)
        .bundle()
        .pipe(source(newFile))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(path));
}

function reload() {
    return gulp.src(__filename).pipe(
        gOpen({ app: 'google-chrome', uri: "http://reload.extensions" })
    );
}
