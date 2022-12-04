import { deepmerge } from "deepmerge-ts";
import { fileURLToPath } from "url";

import defaultOptions from "./options/index.js";
import type { Options, optionPath } from "./options/index.js";

import files from "./lib/files.js";
import applyTo from "./lib/apply-to.js";

// compress
import { minify as csso } from "csso";
import { minify as htmlMinifierTerser } from "html-minifier-terser";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import { minify as terser } from "terser";

import type { Options as CompressOptions } from "./options/lib/compress/index.js";

import defaultCompressOptions, {
	callbacks as callbacksCompress,
} from "./options/lib/compress/index.js";

import sharpRead from "./lib/vendor/sharp-read.js";

// critters
// @ts-ignore
import Critters from "critters";

import type { Options as CrittersOptions } from "./options/lib/critters/index.js";

import defaultCrittersOptions, {
	callbacks as callbacksCritters,
} from "./options/lib/critters/index.js";

export default class pipeline {
	options: Options;
	paths: Set<optionPath> = new Set();

	constructor(options: Options = {}) {
		this.options = options;
		this.mergeDefaultOptions(defaultOptions);
		return this;
	}

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

	async compress() {
		this.mergeDefaultOptions(defaultCompressOptions);

		for (const [fileType, setting] of Object.entries(this.options)) {
			if (!setting) {
				continue;
			}

			for (const path of this.paths) {
				switch (fileType) {
					case "css": {
						await (
							await (
								await new files(this.options.logger, "css").in(
									path
								)
							).by("**/*.css")
						)
							.not(this.options.exclude)
							.apply({
								...callbacksCompress,
								wrote: async (data: string) =>
									csso(data, setting).css,
							});

						break;
					}

					case "html": {
						await (
							await (
								await new files(this.options.logger, "html").in(
									path
								)
							).by("**/*.html")
						)
							.not(this.options.exclude)
							.apply({
								...callbacksCompress,
								wrote: async (data: string) =>
									await htmlMinifierTerser(data, setting),
							});
						break;
					}

					case "js": {
						await (
							await (
								await new files(this.options.logger, "js").in(
									path
								)
							).by("**/*.{js,mjs,cjs}")
						)
							.not(this.options.exclude)
							.apply({
								...callbacksCompress,
								wrote: async (data: string) =>
									(
										await terser(data, setting)
									).code,
							});
						break;
					}

					case "img": {
						await (
							await (
								await new files(this.options.logger, "img").in(
									path
								)
							).by(
								"**/*.{avci,avcs,avif,avifs,gif,heic,heics,heif,heifs,jfif,jif,jpe,jpeg,jpg,png,raw,tiff,webp}"
							)
						)
							.not(this.options.exclude)
							.apply({
								...callbacksCompress,
								wrote: async (sharpFile: any) =>
									await sharpRead(sharpFile, setting),
								read: async (file: string) =>
									sharp(file, {
										failOn: "none",
										sequentialRead: true,
										unlimited: true,
									}),
							});
						break;
					}

					case "svg": {
						await (
							await (
								await new files(this.options.logger, "svg").in(
									path
								)
							).by("**/*.svg")
						)
							.not(this.options.exclude)
							.apply({
								...callbacksCompress,
								wrote: async (data: string) => {
									const result = svgo(data, setting) as {
										// rome-ignore lint:
										[key: string]: any;
									};

									if (
										typeof result["error"] !== "undefined"
									) {
										log.error("", result["error"]);
									}

									if (typeof result["data"] !== "undefined") {
										return result["data"];
									}
								},
							});
						break;
					}

					default:
						break;
				}
			}
		}

		return this;
	}

	async critters() {
		this.mergeDefaultOptions(defaultCrittersOptions);

		for (const path of this.paths) {
			const _path = applyTo(path, (url: URL | string) =>
				url instanceof URL ? fileURLToPath(url) : url
			);

			const critters = new Critters(
				deepmerge(this.options["critters"], {
					path:
						_path instanceof Map
							? _path.keys().next().value
							: _path,
					logLevel: (() => {
						switch (this.options.logger) {
							case 0:
								return "silent";
							case 1:
								return "silent";
							case 2:
								return "info";
							default:
								return "info";
						}
					})(),
				})
			);

			await (
				await (
					await new files(this.options.logger, "html").in(path)
				).by("**/*.html")
			)
				.not(this.options.exclude)
				.apply({
					...callbacksCritters,
					wrote: (data: string) => critters.process(data),
				});
		}

		return this;
	}
}
