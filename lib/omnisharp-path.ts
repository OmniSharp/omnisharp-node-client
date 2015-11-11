import {resolve} from 'path';

var win32 = process.platform === 'win32',
    omnisharp = win32 ? 'omnisharp.cmd' : 'omnisharp',
    bootstrap = win32 ? 'omnisharp.cmd' : 'omnisharp';

export var omnisharpLocation = process.env['OMNISHARP'] || resolve(__dirname, "../roslyn/", omnisharp);
export var bootstrapLocation = process.env['OMNISHARP_BOOTSTRAP'] || resolve(__dirname, "../roslyn/", bootstrap);
