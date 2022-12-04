import type { Options, optionPath } from "./options/index.js";
export default class pipeline {
    options: Options;
    paths: Set<optionPath>;
    constructor(options?: Options);
    private mergeDefaultOptions;
    compress(): Promise<this>;
    critters(): Promise<this>;
}
