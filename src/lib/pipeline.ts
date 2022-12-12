import { fileURLToPath } from "url";

import defaultOptions, {
	functionCallbacks,
	optionCallbacksPipe,
} from "../options/index.js";
import type { Options, optionPath } from "../options/index.js";

import applyTo from "./apply-to.js";
import formatBytes from "./format-bytes.js";
import deepmerge from "./deepmerge.js";
import files from "./files.js";

// compress
import { minify as csso } from "csso";
import { minify as htmlMinifierTerser } from "html-minifier-terser";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import { minify as terser } from "terser";
import type { Output } from "svgo";

import type { Options as CompressOptions } from "../options/lib/compress/index.js";

import defaultCompressOptions from "../options/lib/compress/index.js";

import sharpRead from "./vendor/sharp-read.js";

// critters
// @ts-ignore
import Critters from "critters";

import type { Options as CrittersOptions } from "../options/lib/critters/index.js";

import defaultCrittersOptions from "../options/lib/critters/index.js";

export default class {
	options: Options;
	paths: Set<optionPath> = new Set();

	constructor(options: Options = {}) {
		this.options = options;
		this.mergeDefaultOptions(defaultOptions);
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

	async process() {
		for (const path of this.paths) {
			await (
				await (
					await new files(this.options.logger).in(path)
				).by(this.options.files)
			)
				.not(this.options.exclude)
				.apply(this.options.pipeline);
		}

		return this;
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
								await new files(this.options.logger).in(path)
							).by("**/*.css")
						)
							.not(this.options.exclude)
							.apply(
								deepmerge(defaultCompressOptions.pipeline, {
									wrote: async (current) =>
										csso(current.buffer.toString(), setting)
											.css,
									fulfilled: async (
										pipe: optionCallbacksPipe
									) =>
										`Successfully compressed a total of ${
											pipe.files
										} CSS ${
											pipe.files === 1 ? "file" : "files"
										} for ${await formatBytes(
											pipe.info.total
										)}.`,
								} satisfies functionCallbacks)
							);

						break;
					}

					case "html": {
						await (
							await (
								await new files(this.options.logger).in(path)
							).by("**/*.html")
						)
							.not(this.options.exclude)
							.apply(
								deepmerge(defaultCompressOptions.pipeline, {
									wrote: async (current) =>
										await htmlMinifierTerser(
											current.buffer.toString(),
											setting
										),
									fulfilled: async (
										pipe: optionCallbacksPipe
									) =>
										`Successfully compressed a total of ${
											pipe.files
										} HTML ${
											pipe.files === 1 ? "file" : "files"
										} for ${await formatBytes(
											pipe.info.total
										)}.`,
								} satisfies functionCallbacks)
							);
						break;
					}

					case "js": {
						await (
							await (
								await new files(this.options.logger).in(path)
							).by("**/*.{js,mjs,cjs}")
						)
							.not(this.options.exclude)
							.apply(
								deepmerge(defaultCompressOptions.pipeline, {
									wrote: async (current) => {
										const { code } = await terser(
											current.buffer.toString(),
											setting
										);

										return code ? code : current.buffer;
									},
									fulfilled: async (
										pipe: optionCallbacksPipe
									) =>
										`Successfully compressed a total of ${
											pipe.files
										} JS ${
											pipe.files === 1 ? "file" : "files"
										} for ${await formatBytes(
											pipe.info.total
										)}.`,
								} satisfies functionCallbacks)
							);
						break;
					}

					case "img": {
						await (
							await (
								await new files(this.options.logger).in(path)
							).by(
								"**/*.{avci,avcs,avif,avifs,gif,heic,heics,heif,heifs,jfif,jif,jpe,jpeg,jpg,png,raw,tiff,webp}"
							)
						)
							.not(this.options.exclude)
							.apply(
								deepmerge(defaultCompressOptions.pipeline, {
									wrote: async (current) =>
										await sharpRead(
											current.buffer,
											setting
										),
									read: async (current) =>
										sharp(current.inputPath, {
											failOn: "none",
											sequentialRead: true,
											unlimited: true,
										}),
									fulfilled: async (
										pipe: optionCallbacksPipe
									) =>
										`Successfully compressed a total of ${
											pipe.files
										} IMG ${
											pipe.files === 1 ? "file" : "files"
										} for ${await formatBytes(
											pipe.info.total
										)}.`,
								} satisfies functionCallbacks)
							);
						break;
					}

					case "svg": {
						await (
							await (
								await new files(this.options.logger).in(path)
							).by("**/*.svg")
						)
							.not(this.options.exclude)
							.apply(
								deepmerge(defaultCompressOptions.pipeline, {
									wrote: async (current) => {
										const { data } = svgo(
											current.buffer.toString(),
											setting
										) as Output;

										if (typeof data !== "undefined") {
											return data;
										}

										return current.buffer;
									},
									fulfilled: async (
										pipe: optionCallbacksPipe
									) =>
										`Successfully compressed a total of ${
											pipe.files
										} SVG ${
											pipe.files === 1 ? "file" : "files"
										} for ${await formatBytes(
											pipe.info.total
										)}.`,
								} satisfies functionCallbacks)
							);
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
							// rome-ignore lint/nursery/noPrecisionLoss:
							case 1:
								return "silent";
							// rome-ignore lint/nursery/noPrecisionLoss:
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
					await new files(this.options.logger).in(path)
				).by("**/*.html")
			)
				.not(this.options.exclude)
				.apply(
					deepmerge(defaultCrittersOptions.pipeline, {
						wrote: async (current) =>
							critters.process(current.buffer),
					} satisfies functionCallbacks)
				);
		}

		return this;
	}
}
