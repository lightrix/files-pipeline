/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Pattern } from "fast-glob";
export type optionDebug = 0 | 1 | 2;
export type optionPath = string | URL | Map<string | URL, string | URL> | false;
export type optionExclude = string | RegExp | ((file: string) => boolean);
export interface optionCallbacksPipe {
    debug: optionDebug;
    files: number;
    current: optionCallbacksFile;
    info: any;
}
export interface optionCallbacksFile {
    inputPath: string;
    outputPath: string;
    fileSizeAfter: number;
    fileSizeBefore: number;
}
export interface functionCallbacks {
    fulfilled?: boolean | ((pipe: optionCallbacksPipe) => Promise<string>);
    failed?: boolean | ((inputPath: optionCallbacksFile["inputPath"]) => Promise<string>);
    accomplished?: boolean | ((inputPath: optionCallbacksFile["inputPath"], outputPath: optionCallbacksFile["outputPath"], fileSizeBefore: optionCallbacksFile["fileSizeBefore"], fileSizeAfter: optionCallbacksFile["fileSizeAfter"]) => Promise<string>);
    changed?: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
    passed?: (fileSizeBefore: optionCallbacksFile["fileSizeBefore"], writeBuffer: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => Promise<boolean>;
    read?: (file: string) => Promise<any>;
    wrote?: (file: string, data: string) => Promise<any>;
}
export interface Options {
    [key: string]: any;
    path?: optionPath | optionPath[] | Set<optionPath>;
    exclude?: optionExclude | optionExclude[] | Set<optionExclude>;
    files?: Pattern | Pattern[];
    type?: string;
    pipeline?: functionCallbacks;
    logger?: optionDebug;
}
declare const _default: {
    path: string;
    logger: 2;
    pipeline: {
        wrote: (_file: string, data: string) => Promise<string>;
        read: (file: string) => Promise<string>;
        passed: () => Promise<true>;
        failed: (inputPath: string) => Promise<string>;
        accomplished: (inputPath: string, outputPath: string, _fileSizeBefore: number, _fileSizeAfter: number) => Promise<string>;
        fulfilled: (pipe: optionCallbacksPipe) => Promise<string>;
        changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
    };
};
export default _default;
