var gulp = require('gulp');
var ts = require('typescript');
var through = require('through2');
var gutil = require('gulp-util');

function tsTranspile() {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        var res = ts.transpile(file.contents.toString(), { module: ts.ModuleKind.CommonJS });

        file.contents = new Buffer(res);
        file.path = gutil.replaceExtension(file.path, '.js');

        this.push(file);

        cb();
    });
}

// The default task (called when you run `gulp` from CLI)
gulp.task('default', function() {
    gulp.src('./lib/**/*.ts')
        .pipe(tsTranspile())
        .pipe(gulp.dest('./lib'));
});
