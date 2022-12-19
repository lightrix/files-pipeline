import type { Options, optionPath } from "../options/index.js";

import defaults from "../options/index.js";

import deepmerge from "./deepmerge.js";
import files from "./files.js";

export default class pipeline {
	options: Options;
	paths: Set<optionPath> = new Set();

	constructor(options: Options = {}) {
		this.options = options;
		this.mergeDefaultOptions(defaults);
	}

	private mergeDefaultOptions(settings: Options) {
		for (const option in this.options) {
			if (
				Object.prototype.hasOwnProperty.call(settings, option) &&
				this.options[option] === true
			) {
				this.options[option] = settings[option];
			}
		}

		this.options = deepmerge(settings, this.options);

		if (typeof this.options.path !== "undefined") {
			if (
				this.options.path instanceof Array ||
				this.options.path instanceof Set
			) {
				for (const path of this.options.path) {
					this.paths.add(path);
				}
			} else {
				this.paths.add(this.options.path);
			}
		}
	}

	async process() {
		for (const path of this.paths) {
			await (
				await (
					await (
						await new files(this.options.logger).in(path)
					).by(this.options.files)
				).not(this.options.exclude)
			).pipeline(this.options.pipeline);
		}

		return this;
	}
}
