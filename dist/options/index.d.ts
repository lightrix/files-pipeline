/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
export interface optionCallbacksPipe {
    debug: number;
    files: number;
    current: optionCallbacksFile;
    type: string;
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
    wrote?: (data: string) => Promise<any>;
}
export declare const callbacks: functionCallbacks;
export type optionPath = string | URL | Map<string | URL, string | URL>;
export type optionExclude = string | RegExp | ((file: string) => boolean);
export interface Options {
    [key: string]: any;
    path?: optionPath | optionPath[] | Set<optionPath>;
    exclude?: optionExclude | optionExclude[] | Set<optionExclude>;
    logger?: 0 | 1 | 2;
}
declare const _default: {
    path: string;
    logger: number;
};
export default _default;
