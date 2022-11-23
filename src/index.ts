import { deepmerge } from "deepmerge-ts";

import defaultOptions from "./options/index.js";
import type { Options, path as optionPath } from "./options/index.js";

import compressPipeAll from "./lib/compress/pipe-all.js";
import defaultCompressOptions from "./options/lib/compress/index.js";
import type { Options as CompressOptions } from "./options/lib/compress/index.js";

import crittersPipeAll from "./lib/critters/pipe-all.js";
import defaultCrittersOptions from "./options/lib/critters/index.js";
import type { Options as CrittersOptions } from "./options/lib/critters/index.js";

export default class pipeline {
	options: Options;
	paths: Set<optionPath> = new Set();

	private mergeDefaultOptions(
		settings: Options | CompressOptions | CrittersOptions
	) {
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

	constructor(options: Options = {}) {
		this.options = options;
		this.mergeDefaultOptions(defaultOptions);
		return this;
	}

	async compress() {
		this.mergeDefaultOptions(defaultCompressOptions);

		for (const path of this.paths) {
			await compressPipeAll(path, this.options, this.options.logger);
		}

		return this;
	}

	async critters() {
		this.mergeDefaultOptions(defaultCrittersOptions);

		for (const path of this.paths) {
			await crittersPipeAll(path, this.options, this.options.logger);
		}

		return this;
	}
}
