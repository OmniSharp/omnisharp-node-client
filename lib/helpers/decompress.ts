export interface IDecompressOptions {
    mode?: string;
    strip?: number;
}
export interface IDecompress {
    new (options: IDecompressOptions): IDecompress;
    src(fileOrFiles: string | Buffer | string[]): IDecompress;
    dest(path: string): IDecompress;
    use(plugin: any): IDecompress;
    run(cb: Function): void;
}
export interface IDecompressStatic {
    new (options: IDecompressOptions): IDecompress;
    tar(options: IDecompressOptions): any;
    tarbz2(options: IDecompressOptions): any;
    targz(options: IDecompressOptions): any;
    zip(options: IDecompressOptions): any;
}
/* tslint:disable:variable-name */
export const Decompress: IDecompressStatic = require("decompress");
/* tslint:enable:variable-name */
