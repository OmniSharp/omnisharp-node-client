export interface IDecompressOptions {
    mode?: string;
    strip?: number;
}
import * as _ from 'lodash';
/* tslint:disable:variable-name */
const d = require('decompress');
/* tslint:enable:variable-name */
export function decompress(input: string, output?: string, options?: IDecompressOptions): Promise<string[]> {
    return d(input, output, _.assign(options, {
        plugins: [require('decompress-targz')(), require('decompress-unzip')()]
    }));
}
