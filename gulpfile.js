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
    get babel() { return require("gulp-babel"); },
    get sourcemaps() { return require('gulp-sourcemaps'); },
    get through() { return require('through2'); },
    get del() { return require('del'); },
    get download() { return require('gulp-download-stream'); },
    get gunzip() { return require('gulp-gunzip'); },
    get untar() { return require('gulp-untar'); },
    get unzip() { return require('gulp-unzip'); },
    get newer() { return require('gulp-newer'); },
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
    return ctx.through.obj(function(file, enc, cb) {
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

gulp.task('typescript', ['sync-clients','clean'], function() {
    var args = ['--declaration', '-p', path.resolve(__dirname.toString())];
    var compile = new Promise(function(resolve, reject) {
        var tsc = spawn(path.resolve(__dirname + '/node_modules/.bin/tsc' + (win32 && '.cmd' || '')), args);
        tsc.stdout.pipe(process.stdout);
        tsc.stderr.pipe(process.stderr);
        tsc.on('close', function(code) {
            resolve();
        });
    });

    return compile;
});

gulp.task('typescript-babel', ['typescript'], function() {
    return tsProject.src()
        .pipe(ctx.tslint())
        .pipe(ctx.tslint.report('prose'))
        .pipe(ctx.sourcemaps.init())
        .pipe(ctx.ts(tsProject))
        .pipe(ctx.babel())
        .pipe(ctx.sourcemaps.write())
        .pipe(gulp.dest('.'));
});

gulp.task('clean', ['clean:lib', 'clean:test']);

gulp.task('clean:lib', function(done) {
    var items = metadata.lib
    ctx.del(metadataDel.lib).then(function(paths) {
        _.each(paths, function(path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('clean:test', function(done) {
    ctx.del(metadataDel.test).then(function(paths) {
        _.each(paths, function(path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('sync-clients', [], function() {
    const omnisharpServer = fs.readFileSync('./lib/omnisharp-server.ts').toString();
    _.each(['v1', 'v2'], function(version) {
        const VERSION = version.toUpperCase();
        const regex = new RegExp('export module Events {[\\s\\S]*?interface '+VERSION+' {([\\s\\S]*?)}');

        const interf = omnisharpServer.match(regex)[1];
        const properties = [];
        _.each(_.trim(interf).split('\n'), function(line) {
            line = _.trim(line);
            if (_.startsWith(line, '//')) return;

            const name = line.indexOf(':');
            if (line && name > -1) {
                properties.push({
                    line: _.trimEnd(line.substr(name), ';').replace('CombinationKey<', 'CombinationKey<').replace('Context<', 'Context<'),
                    name: line.substr(0, name)
                });
            }
        });

        const regex2 = new RegExp('export module Events\\.Aggregate {[\\s\\S]*?interface '+VERSION+' {([\\s\\S]*?)}');
        const interf2 = omnisharpServer.match(regex2)[1];
        const aggregateProperties = [];
        _.each(_.trim(interf2).split('\n'), function(line) {
            line = _.trim(line);
            if (_.startsWith(line, '//')) return;

            const name = line.indexOf(':');
            if (line && name > -1) {
                aggregateProperties.push({
                    line: _.trimEnd(line.substr(name), ';').replace('CombinationKey<', 'CombinationKey<').replace('Context<', 'Context<'),
                    name: line.substr(0, name)
                });
            }
        });

        const result = _.template('\
// THIS FILE IS GENERATED BY GULP TASK: "sync-clients"\n\
import {Observable} from "rxjs";\n\
import {Models, Events, Context, CombinationKey} from "../omnisharp-server";\n\
import {Client${VERSION}} from "../clients/client-${version}";\n\
import {ObservationClientBase, CombinationClientBase} from "./composite-client-base";\n\
import {merge, aggregate} from "../decorators";\n\
\n\
export class ObservationClient${VERSION}<T extends Client${VERSION}> extends ObservationClientBase<T> implements Events.${VERSION} {\
<% _.each(properties, function(property){ %>\n    @merge public get ${property.name}()${property.line} { throw new Error("Implemented by decorator"); }<% }); %>\n\
}\n\
\n\
export class AggregateClient${VERSION}<T extends Client${VERSION}> extends CombinationClientBase<T> implements Events.Aggregate.${VERSION} {\
<% _.each(aggregateProperties, function(property){ %>\n    @aggregate public get ${property.name}()${property.line} { throw new Error("Implemented by decorator"); }<% }); %>\n\
}\n')({ properties: properties, aggregateProperties: aggregateProperties, VERSION: VERSION, version: version });

        fs.writeFileSync('./lib/aggregate/composite-client-'+version+'.ts', result);
    });
});

gulp.task('watch', function() {
    // Watch is not installed by default if you want to use it
    //  you need to install manually but don't save it as it causes CI issues.
    const watch = require('gulp-watch');
    // Auto restart watch when gulpfile is changed.
    const p = spawn(gulpPath, ['file-watch'], {stdio: 'inherit'});
    return watch('gulpfile.js', function() {
        p.kill();
        p = spawn(gulpPath, ['file-watch'], {stdio: 'inherit'});
    });
});

gulp.task('file-watch', function() {
    // Watch is not installed by default if you want to use it
    //  you need to install manually but don't save it as it causes CI issues.
    const watch = require('gulp-watch');
    const plumber = require('gulp-plumber');
    const newer = require('gulp-newer');

    const lib = tsTranspiler(gulp.src(metadata.lib)
        .pipe(watch(metadata.lib))
        .pipe(plumber())
        .pipe(newer('./lib')), './lib')

    const test = tsTranspiler(gulp.src(metadata.test)
        .pipe(watch(metadata.test))
        .pipe(plumber())
        .pipe(newer('./test')), './test');

    return merge(lib, test);
});

gulp.task('npm-prepublish', ['typescript-babel']);

// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['typescript-babel']);
