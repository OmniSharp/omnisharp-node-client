var gulp = require('gulp');
var ts = require('typescript');
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var del = require('del');
var _ = require('lodash');
var path = require('path');
var win32 = process.platform === "win32";
var spawn = require('child_process').spawn;
var gulpPath = path.join(__dirname, 'node_modules/.bin/gulp' + (win32 && '.cmd' || ''));
var metadata = {
    lib: ['lib/**/*.ts', '!lib/**/*.d.ts'],
    spec: ['spec/**/*.ts'],
};

gulp.task('typescript', ['clean'], function() {
    var args = ['--declaration', '-p', path.resolve(__dirname.toString())];
    console.log(args);
    var compile = new Promise(function(resolve, reject) {
        var tsc = spawn(path.resolve(__dirname + '/node_modules/.bin/ntsc' + (win32 && '.cmd' || '')), args);
        tsc.on('data', function(data) { gutil.log(data); });
        tsc.on('close', function(code) {
            if (code !== 0) {
                reject('failed');
            } else {
                resolve('success');
            }
        });
    });

    return compile;
});

gulp.task('clean', ['clean:lib', 'clean:spec']);

gulp.task('clean:lib', function(done) {
    del(metadata.lib.map(function(z) { return gutil.replaceExtension(z, '.js'); }), function(err, paths) {
        _.each(paths, function(path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('clean:spec', function(done) {
    del(metadata.spec.map(function(z) { return gutil.replaceExtension(z, '.js'); }), function(err, paths) {
        _.each(paths, function(path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('watch', function() {
    // Watch is not installed by default if you want to use it
    //  you need to install manually but don't save it as it causes CI issues.
    var watch = require('gulp-watch');
    // Auto restart watch when gulpfile is changed.
    var p = spawn(gulpPath, ['file-watch'], {stdio: 'inherit'});
    return watch('gulpfile.js', function() {
        p.kill();
        p = spawn(gulpPath, ['file-watch'], {stdio: 'inherit'});
    });
});

gulp.task('file-watch', function() {
    // Watch is not installed by default if you want to use it
    //  you need to install manually but don't save it as it causes CI issues.
    var watch = require('gulp-watch');
    var plumber = require('gulp-plumber');
    var newer = require('gulp-newer');

    var lib = tsTranspiler(gulp.src(metadata.lib)
        .pipe(watch(metadata.lib))
        .pipe(plumber())
        .pipe(newer('./lib')), './lib')

    var spec = tsTranspiler(gulp.src(metadata.spec)
        .pipe(watch(metadata.spec))
        .pipe(plumber())
        .pipe(newer('./spec')), './spec');

    return merge(lib, spec);
});

gulp.task('npm-prepublish', ['typescript']);

// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['typescript'], function() {

});
