/// <reference types="node" resolution-mode="require"/>
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
    logger: 2;
};
export default _default;
