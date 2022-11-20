import type { Options, path as optionPath } from "../options/index.js";
export default class {
    paths: Map<string, string>;
    results: Map<string, string>;
    in(path: optionPath): this;
    by(glob: string): Promise<this>;
    not(pattern: Options["exclude"]): this;
}
