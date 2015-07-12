import {spawn, exec, ChildProcess} from "child_process";
var argv = require('yargs').argv;

var serverPath = argv.serverPath;
var projectPath = argv.projectPath;

var args = ["--stdio", "-s", projectPath, "--hostPID", process.pid];

Object.keys(argv)
    .filter(z => z !== '_' && z !== '$0' && z !== 'serverPath' && z !== 'projectPath')
    .forEach(z => args.push('--' + z + "=" + argv[z]));

var childProcess = spawn(serverPath, args);

process.stdin.pipe(childProcess.stdin);
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);

process.stdin.resume();
process.on('message', function(message) {
    if (message === 'kill')
        process.exit();
});

childProcess.on('exit', () => process.exit());
childProcess.on('disconnect', () => process.exit());
childProcess.on('close', () => process.exit());
