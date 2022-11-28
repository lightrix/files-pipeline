/// <reference types="node" resolution-mode="require"/>
import * as fs from "fs";
export type callbacks = {
    write: (data: string) => Promise<any>;
    read: (file: string) => Promise<any>;
    error: (inputPath: string) => Promise<string>;
    check: (fileSizeBefore: number, writeBuffer: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => Promise<boolean>;
    success: (inputPath: string, outputPath: string, fileSizeBefore: number, fileSizeAfter: number) => Promise<string>;
    end: (pipe: any) => Promise<string>;
    pipe: (inputPath: string, outputPath: string, fileSizeBefore: number, fileSizeAfter: number) => Promise<void>;
};
declare const _default: {
    write: (data: string) => Promise<string>;
    read: (file: fs.PathLike | fs.promises.FileHandle) => Promise<string>;
    check: () => Promise<true>;
    error: (inputPath: string) => Promise<string>;
    success: (inputPath: string, outputPath: string, _fileSizeBefore: number, _fileSizeAfter: number) => Promise<string>;
    end: (pipe: {
        files: number;
        type: string;
        total: number;
    }) => Promise<string>;
    pipe: (_inputPath: string, _outputPath: string, _fileSizeBefore: number, _fileSizeAfter: number) => Promise<void>;
};
export default _default;
