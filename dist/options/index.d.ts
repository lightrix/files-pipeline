/// <reference types="node" resolution-mode="require"/>
export type path = string | URL | Map<string | URL, string | URL>;
export type exclude = string | RegExp | ((file: string) => boolean);
export interface Options {
    [key: string]: any;
    path?: path | path[] | Set<path>;
    exclude?: exclude | exclude[] | Set<exclude>;
    logger?: number;
}
declare const _default: {
    path: string;
    logger: number;
};
export default _default;
