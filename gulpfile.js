const gulp = require('gulp');
const gutil = require('gulp-util');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const win32 = process.platform === "win32";
const spawn = require('child_process').spawn;
const gulpPath = path.join(__dirname, 'node_modules/.bin/gulp' + (win32 && '.cmd' || ''));
const merge = require('merge-stream');
const typescript = require('typescript');

// Lazy so we don't load these when we don't need them.
const ctx = {
    get ts() { return require('gulp-typescript'); },
    get tslint() { return require("gulp-tslint"); },
    get sourcemaps() { return require('gulp-sourcemaps'); },
    get through() { return require('through2'); },
    get del() { return require('del'); },
    get package() { return require('./package.json'); }
};

const tsProject = ctx.ts.createProject('tsconfig.json', { typescript: typescript });

var metadata = {
    lib: ['lib/**/*.ts', '!lib/**/*.d.ts'],
    test: ['test/**/*.ts', '!test/**/*.d.ts'],
};

var metadataDel = {
    lib: ['lib/**/*.js', 'lib/**/*.js.map', 'lib/**/*.d.ts'],
    test: ['test/**/*.js', 'test/**/*.js.map', 'test/**/*.d.ts', '!test/tsd.d.ts'],
};

// Simply take TS code and strip anything not javascript
// Does not do any compile time checking.
function tsTranspile() {
    return ctx.through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        try {
            var res = ctx.ts.transpile(file.contents.toString(), {
                module: ctx.ts.ModuleKind.ES6,
                target: ctx.ts.ScriptTarget.ES6
            }, file.path);

            file.contents = new Buffer(res);
            file.path = gutil.replaceExtension(file.path, '.js');
            gutil.log(gutil.colors.cyan('Writing ') + gutil.colors.green(_.trim(file.path.replace(__dirname, ''), path.sep)));

            this.push(file);
        } catch (e) {
            console.log('failed', file.path, e);
        }

        cb();
    });
}

// gulp.task('tslint', [], function () {
//     return gulp.src(metadata.lib)
//         .pipe(ctx.tslint())
//         .pipe(ctx.tslint.report('prose'));
// });

gulp.task('typescript', ['clean'], function () {
    var tsResult = tsProject.src()
        //.pipe(ctx.tslint())
        //.pipe(ctx.tslint.report('prose'))
        .pipe(ctx.sourcemaps.init())
        .pipe(ctx.ts(tsProject));

    return merge(
        tsResult.dts
            .pipe(gulp.dest('.')),
        tsResult.js
            .pipe(ctx.sourcemaps.write())
            .pipe(gulp.dest('.'))
    );
});

gulp.task('clean', ['clean:lib', 'clean:test']);

gulp.task('clean:lib', function (done) {
    var items = metadata.lib
    ctx.del(metadataDel.lib).then(function (paths) {
        _.each(paths, function (path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('clean:test', function (done) {
    ctx.del(metadataDel.test).then(function (paths) {
        _.each(paths, function (path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('npm-prepublish', ['typescript']);

// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['typescript']);
