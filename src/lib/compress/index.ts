import { minify as csso } from "csso";
import { deepmerge } from "deepmerge-ts";
import { minify as htmlMinifierTerser } from "html-minifier-terser";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import { minify as terser } from "terser";

import type { optionPath, Options } from "../../options/index.js";
import type {
	functionCallbacks,
	optionCallbacksFile,
	optionCallbacksPipe,
} from "../../options/lib/callbacks.js";
import type { Options as CompressOptions } from "../../options/lib/critters/index.js";

import defaultCallbacks from "../../options/lib/callbacks.js";
import parse from "../parse.js";
import sharpRead from "../vendor/sharp-read.js";
import formatBytes from "../format-bytes.js";

const callbacks = deepmerge(defaultCallbacks, {
	failed: async (inputPath: optionCallbacksFile["inputPath"]) =>
		`Error: Cannot compress file ${inputPath} !`,
	passed: async (
		fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
		writeBuffer:
			| string
			| NodeJS.ArrayBufferView
			| ArrayBuffer
			| SharedArrayBuffer
	) => fileSizeBefore > Buffer.byteLength(writeBuffer),
	accomplished: async (
		inputPath: optionCallbacksFile["inputPath"],
		outputPath: optionCallbacksFile["outputPath"],
		fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
		fileSizeAfter: optionCallbacksFile["fileSizeAfter"]
	) =>
		`\u001b[32mCompressed ${inputPath} for ${await formatBytes(
			fileSizeBefore - fileSizeAfter
		)} (${(
			((fileSizeBefore - fileSizeAfter) / fileSizeBefore) *
			100
		).toFixed(2)}% reduction) in ${outputPath} .\u001b[39m`,
	fulfilled: async (pipe: optionCallbacksPipe) =>
		`\u001b[32mSuccessfully compressed a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		} for ${await formatBytes(pipe.info.total)}.\u001b[39m`,
	changed: async (pipe: optionCallbacksPipe) => {
		pipe.info.total =
			(pipe.info.total ? pipe.info.total : 0) +
			(pipe.current.fileSizeBefore - pipe.current.fileSizeAfter);
		return pipe;
	},
} satisfies functionCallbacks);

export default async (
	path: optionPath,
	settings: Options & CompressOptions,
	debug: number = 2
) => {
	for (const files in settings) {
		if (Object.prototype.hasOwnProperty.call(settings, files)) {
			const setting = settings[files];

			if (!setting) {
				continue;
			}

			switch (files) {
				case "css": {
					await parse(
						path,
						"**/*.css",
						debug,
						files,
						settings?.exclude,
						() => ({
							...callbacks,
							wrote: async (data) => csso(data, setting).css,
						})
					);

					break;
				}

				case "html": {
					await parse(
						path,
						"**/*.html",
						debug,
						files,
						settings?.exclude,
						() => ({
							...callbacks,
							wrote: async (data) =>
								await htmlMinifierTerser(data, setting),
						})
					);

					break;
				}

				case "js": {
					await parse(
						path,
						"**/*.{js,mjs,cjs}",
						debug,
						files,
						settings?.exclude,
						() => ({
							...callbacks,
							wrote: async (data) =>
								(
									await terser(data, setting)
								).code,
						})
					);

					break;
				}

				case "img": {
					await parse(
						path,
						"**/*.{avci,avcs,avif,avifs,gif,heic,heics,heif,heifs,jfif,jif,jpe,jpeg,jpg,png,raw,tiff,webp}",
						debug,
						files,
						settings?.exclude,
						() => ({
							...callbacks,
							wrote: async (sharpFile) =>
								await sharpRead(sharpFile, setting),
							read: async (file) =>
								sharp(file, {
									failOn: "none",
									sequentialRead: true,
									unlimited: true,
								}),
						})
					);

					break;
				}

				case "svg": {
					await parse(
						path,
						"**/*.svg",
						debug,
						files,
						settings?.exclude,
						() => ({
							...callbacks,
							wrote: async (data) => {
								const result = svgo(data, setting) as {
									// rome-ignore lint:
									[key: string]: any;
								};

								if (typeof result["error"] !== "undefined") {
									console.log(result["error"]);
								}

								if (typeof result["data"] !== "undefined") {
									return result["data"];
								}
							},
						})
					);

					break;
				}

				default:
					break;
			}
		}
	}
};
