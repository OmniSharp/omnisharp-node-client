import {spawn, exec, ChildProcess} from "child_process";
var argv = require('yargs').argv;

var serverPath = argv.serverPath;
var projectPath = argv.projectPath;

var childProcess = spawn(serverPath, ["--stdio", "-s", projectPath, "--hostPID", process.pid]);

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
