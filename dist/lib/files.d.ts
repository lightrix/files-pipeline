import type { Pattern } from "fast-glob";
import type { executions, optionCallbacksPipe, optionPath, Options } from "../options/index.js";
export default class {
    pipeline: (callbacks?: executions) => Promise<default>;
    not: (pattern: Options["exclude"]) => Promise<default>;
    by: (glob?: Pattern | Pattern[]) => Promise<default>;
    in: (path?: optionPath) => Promise<default>;
    pipe: optionCallbacksPipe;
    paths: Map<string, string>;
    results: Map<string, string>;
    constructor(debug?: optionCallbacksPipe["debug"]);
}
