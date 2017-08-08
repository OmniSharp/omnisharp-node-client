import * as child_process from 'child_process';
import { Defer } from 'lodash';

export enum SupportedPlatform {
    None,
    Windows,
    OSX,
    Linux
}

/* tslint:disable:quotemark no-unexternalized-strings */
export function getSupportedPlatform(platform: string = process.platform) {
    if (process.platform === 'win32') {
        return SupportedPlatform.Windows;
    } else if (process.platform === 'darwin') {
        return SupportedPlatform.OSX;
    } else if (process.platform === 'linux') {
        return SupportedPlatform.Linux;
    }

    return SupportedPlatform.None;
}
/* tslint:enable:quotemark */

export const supportedPlatform = getSupportedPlatform(process.platform);
