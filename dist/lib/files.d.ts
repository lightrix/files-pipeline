import type { Options, optionPath } from "../options/index.js";
import type { functionCallbacks, optionCallbacksPipe } from "../options/index.js";
export default class {
    paths: Map<string, string>;
    results: Map<string, string>;
    pipe: optionCallbacksPipe;
    constructor(debug: number | undefined, type: optionCallbacksPipe["type"]);
    in(path: optionPath): Promise<this>;
    by(glob: string): Promise<this>;
    not(pattern: Options["exclude"]): this;
    apply(callbacks: functionCallbacks): Promise<this | undefined>;
}
