import type { Options, optionPath } from "./options/index.js";
export default class pipeline {
    options: Options;
    paths: Set<optionPath>;
    private mergeDefaultOptions;
    constructor(options?: Options);
    compress(): Promise<this>;
    critters(): Promise<this>;
}
