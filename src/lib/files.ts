import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import FastGlob from "fast-glob";

import type { Options, optionPath } from "../options/index.js";
import type {
	functionCallbacks,
	optionCallbacksPipe,
} from "../options/index.js";

import applyTo from "./apply-to.js";

export default class {
	paths: Map<string, string> = new Map();
	results: Map<string, string> = new Map();
	pipe: optionCallbacksPipe;

	constructor(
		debug: optionCallbacksPipe["debug"] = 2,
		type: optionCallbacksPipe["type"]
	) {
		this.pipe = {
			files: 0,
			type,
			debug,
			info: {},
			current: {
				inputPath: "",
				outputPath: "",
				fileSizeAfter: 0,
				fileSizeBefore: 0,
			},
		};

		return this;
	}

	async in(path: optionPath) {
		const _path = applyTo(
			applyTo(path, (url: URL | string) =>
				url instanceof URL ? fileURLToPath(url) : url
			),
			(path: string) => (path.endsWith("/") ? path : `${path}/`)
		);

		if (_path instanceof Map) {
			for (const [input, output] of _path) {
				this.paths.set(input, output);
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
				this.results.set(`${output}${file}`, `${input}${file}`);
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

	async apply(callbacks: functionCallbacks) {
		for (const [outputPath, inputPath] of this.results) {
			try {
				const fileSizeBefore = (await fs.promises.stat(inputPath)).size;

				if (callbacks.read && callbacks.wrote) {
					const writeBuffer = await callbacks.wrote(
						await callbacks.read(inputPath)
					);

					if (!writeBuffer) {
						return;
					}

					if (
						callbacks.passed &&
						(await callbacks.passed(fileSizeBefore, writeBuffer))
					) {
						try {
							await fs.promises.access(
								dirname(outputPath),
								fs.constants.W_OK
							);
						} catch (_error) {
							await fs.promises.mkdir(dirname(outputPath), {
								recursive: true,
							});
						}

						await fs.promises.writeFile(
							outputPath,
							writeBuffer,
							"utf-8"
						);

						const fileSizeAfter = (
							await fs.promises.stat(outputPath)
						).size;

						if (this.pipe.debug > 0) {
							this.pipe.current = {
								inputPath,
								outputPath,
								fileSizeBefore,
								fileSizeAfter,
							};

							this.pipe.files++;

							if (callbacks.changed) {
								this.pipe = await callbacks.changed(this.pipe);
							}
						}

						if (this.pipe.debug > 1) {
							if (typeof callbacks.accomplished === "function") {
								console.log(
									await callbacks.accomplished(
										inputPath,
										outputPath,
										fileSizeBefore,
										fileSizeAfter
									)
								);
							}
						}
					}
				}
			} catch (_error) {
				this.results.delete(outputPath);

				if (typeof callbacks.failed === "function") {
					console.log(await callbacks.failed(inputPath));
				}
			}
		}

		if (this.pipe.debug > 0 && this.results.size > 0) {
			if (typeof callbacks.fulfilled === "function") {
				console.log(await callbacks.fulfilled(this.pipe));
			}
		}

		return this;
	}
}
