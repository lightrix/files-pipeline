import type { Pattern } from "fast-glob";

import type {
	executions,
	optionCallbacksPipe,
	optionPath,
	Options,
} from "../options/index.js";

import options from "../options/index.js";

import pipeline from "./files/pipeline.js";
import not from "./files/not.js";
import by from "./files/by.js";
import _in from "./files/in.js";

export default class {
	pipeline = async (callbacks: executions = options.pipeline) =>
		await pipeline(this, callbacks);

	not = async (pattern: Options["exclude"]) => await not(this, pattern);

	by = async (glob: Pattern | Pattern[] = "**/*") => await by(this, glob);

	in = async (path: optionPath = "./") => await _in(this, path);

	pipe: optionCallbacksPipe = {
		files: 0,
		// rome-ignore lint/nursery/noPrecisionLoss: <explanation>
		debug: 2,
		info: {},
		current: {
			buffer: "",
			fileSizeAfter: 0,
			fileSizeBefore: 0,
			inputPath: "",
			outputPath: "",
		},
	};

	paths: Map<string, string> = new Map();

	results: Map<string, string> = new Map();

	// rome-ignore lint/nursery/noPrecisionLoss: <explanation>
	constructor(debug: optionCallbacksPipe["debug"] = 2) {
		this.pipe.debug = debug;
	}
}
