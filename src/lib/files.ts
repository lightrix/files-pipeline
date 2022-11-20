import FastGlob from "fast-glob";
import { fileURLToPath } from "url";
import type { Options, path as optionPath } from "../options/index.js";
import applyTo from "./apply-to.js";

export default class {
	paths: Map<string, string> = new Map();
	results: Map<string, string> = new Map();

	in(path: optionPath) {
		const _path = applyTo(
			applyTo(path, (url) =>
				url instanceof URL ? fileURLToPath(url) : url
			),
			(path) => (path.endsWith("/") ? path : `${path}/`)
		);

		if (_path instanceof Map) {
			for (const [input, output] of _path) {
				this.paths.set(output, input);
			}
		} else {
			this.paths.set(_path, _path);
		}

		return this;
	}

	async by(glob: string) {
		for (const [input, output] of this.paths) {
			for (const file of await FastGlob(`${glob}`, {
				cwd: input,
				onlyFiles: true,
			})) {
				this.results.set(`${input}${file}`, `${output}${file}`);
			}
		}

		return this;
	}

	not(pattern: Options["exclude"]) {
		let filters = new Set();

		if (typeof pattern !== "undefined") {
			if (pattern instanceof Array || pattern instanceof Set) {
				for (const patterns of pattern) {
					filters.add(patterns);
				}
			} else {
				filters.add(pattern);
			}
		}

		for (const filter of filters) {
			if (typeof filter === "string") {
				for (const file of this.results) {
					if (file[0].match(filter) || file[1].match(filter)) {
						this.results.delete(file[0]);
					}
				}
			}

			if (typeof filter === "function") {
				for (const file of this.results) {
					if (filter(file[0]) || filter(file[1])) {
						this.results.delete(file[0]);
					}
				}
			}
		}

		return this;
	}
}
