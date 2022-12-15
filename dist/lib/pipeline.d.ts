import type { Options, optionPath } from "../options/index.js";
export default class {
    options: Options;
    paths: Set<optionPath>;
    constructor(options?: Options);
    private mergeDefaultOptions;
    process(): Promise<this>;
    compress(): Promise<this>;
    critters(): Promise<this>;
}
