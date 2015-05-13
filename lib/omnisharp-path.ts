import {resolve} from 'path';

var win32 = process.platform === 'win32',
    command = win32 ? 'omnisharp.cmd' : 'omnisharp';

export var omnisharpLocation = process.env['OMNISHARP'] || resolve(__dirname, "../roslyn/", command);
