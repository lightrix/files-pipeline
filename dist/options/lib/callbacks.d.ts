/// <reference types="node" resolution-mode="require"/>
import * as fs from "fs";
export interface optionCallbacksPipe {
    files: number;
    type: string;
    info: any;
    current: optionCallbacksFile;
}
export interface optionCallbacksFile {
    inputPath: string;
    outputPath: string;
    fileSizeAfter: number;
    fileSizeBefore: number;
}
export interface functionCallbacks {
    fulfilled: boolean | ((pipe: optionCallbacksPipe) => Promise<string>);
    failed: boolean | ((inputPath: optionCallbacksFile["inputPath"]) => Promise<string>);
    accomplished: boolean | ((inputPath: optionCallbacksFile["inputPath"], outputPath: optionCallbacksFile["outputPath"], fileSizeBefore: optionCallbacksFile["fileSizeBefore"], fileSizeAfter: optionCallbacksFile["fileSizeAfter"]) => Promise<string>);
    changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
    passed: boolean | ((fileSizeBefore: optionCallbacksFile["fileSizeBefore"], writeBuffer: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => Promise<boolean>);
    read: (file: string) => Promise<any>;
    wrote: (data: string) => Promise<any>;
}
declare const _default: {
    wrote: (data: string) => Promise<string>;
    read: (file: fs.PathLike | fs.promises.FileHandle) => Promise<string>;
    passed: () => Promise<true>;
    failed: (inputPath: optionCallbacksFile["inputPath"]) => Promise<string>;
    accomplished: (inputPath: optionCallbacksFile["inputPath"], outputPath: optionCallbacksFile["outputPath"], _fileSizeBefore: optionCallbacksFile["fileSizeBefore"], _fileSizeAfter: optionCallbacksFile["fileSizeAfter"]) => Promise<string>;
    fulfilled: (pipe: optionCallbacksPipe) => Promise<string>;
    changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
};
export default _default;
