const gulp = require('gulp');
const gutil = require('gulp-util');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const win32 = process.platform === "win32";
const spawn = require('child_process').spawn;
const gulpPath = path.join(__dirname, 'node_modules/.bin/gulp' + (win32 && '.cmd' || ''));
const merge = require('merge-stream');

// Lazy so we don't load these when we don't need them.
const ctx = {
    get ts() { return require('ntypescript'); },
    get tslint() { return require("gulp-tslint"); },
    get babel() { return require("gulp-babel"); },
    get through() { return require('through2'); },
    get del() { return require('del'); },
    get download() { return require('gulp-download-stream'); },
    get gunzip() { return require('gulp-gunzip'); },
    get untar() { return require('gulp-untar'); },
    get unzip() { return require('gulp-unzip'); },
    get newer() { return require('gulp-newer'); },
    get package() { return require('./package.json'); }
};

var metadata = {
    lib: ['lib/**/*.ts', '!lib/**/*.d.ts'],
    spec: ['spec/**/*.ts', '!spec/**/*.d.ts'],
};

var metadataDel = {
    lib: ['lib/**/*.js', 'lib/**/*.d.ts'],
    spec: ['spec/**/*.js', 'spec/**/*.d.ts', '!spec/tsd.d.ts'],
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

function tsTranspiler(source, dest) {
    return source
        .pipe(ctx.tslint())
        .pipe(tsTranspile())
        .pipe(ctx.babel())
        .pipe(gulp.dest(dest))
        .pipe(ctx.tslint.report('prose'));
}

gulp.task('typescript', ['sync-clients','clean'], function() {
    var args = ['--declaration', '-p', path.resolve(__dirname.toString())];
    var compile = new Promise(function(resolve, reject) {
        var tsc = spawn(path.resolve(__dirname + '/node_modules/.bin/ntsc' + (win32 && '.cmd' || '')), args);
        tsc.stdout.pipe(process.stdout);
        tsc.stderr.pipe(process.stderr);
        tsc.on('close', function(code) {
            resolve();
        });
    });

    return compile;
});

gulp.task('typescript-babel', ['typescript'], function() {
    var lib = tsTranspiler(gulp.src(metadata.lib), './lib');
    var spec = tsTranspiler(gulp.src(metadata.spec), './spec');

    return merge(lib, spec);
});

gulp.task('clean', ['clean:lib', 'clean:spec']);

gulp.task('clean:lib', function(done) {
    var items = metadata.lib
    ctx.del(metadataDel.lib).then(function(paths) {
        _.each(paths, function(path) {
            gutil.log(gutil.colors.red('Deleted ') + gutil.colors.magenta(path.replace(__dirname, '').substring(1)));
        });
        done();
    });
});

gulp.task('clean:spec', function(done) {
    ctx.del(metadataDel.spec).then(function(paths) {
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
                    line: _.trimRight(line.substr(name), ';').replace('CombinationKey<', 'CombinationKey<').replace('Context<', 'Context<'),
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
                    line: _.trimRight(line.substr(name), ';').replace('CombinationKey<', 'CombinationKey<').replace('Context<', 'Context<'),
                    name: line.substr(0, name)
                });
            }
        });

        const result = _.template('\
// THIS FILE IS GENERATED BY GULP TASK: "sync-clients"\n\
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

    const spec = tsTranspiler(gulp.src(metadata.spec)
        .pipe(watch(metadata.spec))
        .pipe(plumber())
        .pipe(newer('./spec')), './spec');

    return merge(lib, spec);
});

gulp.task('npm-prepublish', ['typescript-babel']);

gulp.task('npm-install', ['download-roslyn', 'unzip-roslyn', 'clean-archives'], function() {
});

gulp.task('clean-roslyn', [], function() {
    return ctx.del('./roslyn').then(function(paths) {
        fs.mkdirSync('./roslyn');
    });
});

gulp.task('download-roslyn', ['clean-roslyn'], function() {
    const serverVersion = ctx.package['omnisharp-roslyn'];
    const files = [];
    if (win32) {
        if (process.arch === 'x64') {
            files.push(
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-clr-win-x64.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-clr-win-x64.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-coreclr-win-x64.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-coreclr-win-x64.zip'
            );
        } else {
            files.push(
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-clr-win-x86.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-clr-win-x86.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-coreclr-win-x86.zip',
                'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-coreclr-win-x86.zip'
            );
        }
    } else {
        files.push(
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-mono.tar.gz',
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-mono.tar.gz'
        );
    }

    if (process.platform === 'darwin') {
        files.push(
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-coreclr-darwin-x64.tar.gz',
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-coreclr-darwin-x64.tar.gz'
        );
    } else if (process.platform === 'linux') {
        files.push(
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp-coreclr-linux-x64.tar.gz',
            'https://github.com/OmniSharp/omnisharp-roslyn/releases/download/' + serverVersion + '/omnisharp.bootstrap-coreclr-linux-x64.tar.gz'
        );
    }

    return ctx.download(files)
        .pipe(gulp.dest('./roslyn'));
});

gulp.task('unzip-roslyn', ['download-roslyn'], function() {
    function ifExists() {
        return ctx.through.obj(function(file, enc, cb) {
            if (file.isNull()) {
                cb(null, file);
                return;
            }

            if (!fs.existsSync("./roslyn/" + file.path)) {
                this.push(file);
            }
            cb();
        });
    }
    var source = gulp.src(['./roslyn/*.zip', './roslyn/*.tar.gz']);

    if (win32) {
        source = source
            .pipe(ctx.unzip());
    } else  {
        source = source
            .pipe(ctx.gunzip())
            .pipe(ctx.untar());
    }
    return source
        .pipe(ifExists())
        .pipe(gulp.dest("./roslyn"));
});

gulp.task('clean-archives', ['unzip-roslyn'], function() {
    return ctx.del(['./roslyn/*.zip', './roslyn/*.tar.gz']);
});

// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['typescript-babel']);
