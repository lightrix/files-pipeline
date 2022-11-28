import { minify as csso } from "csso";
import { deepmerge } from "deepmerge-ts";
import { minify as htmlMinifierTerser } from "html-minifier-terser";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import { minify as terser } from "terser";

import type { path as optionPath, Options } from "./../../options/index.js";
import type { callbacks as callbacksOption } from "../../options/lib/callbacks.js";

import defaultCallbacks from "./../../options/lib/callbacks.js";
import parse from "./../parse.js";
import sharpRead from "./../vendor/sharp-read.js";
import formatBytes from "./../format-bytes.js";

const callbacks: callbacksOption = deepmerge(defaultCallbacks, {
	error: async (inputPath: string) =>
		`Error: Cannot compress file ${inputPath} !`,
	check: async (
		fileSizeBefore: number,
		writeBuffer:
			| string
			| NodeJS.ArrayBufferView
			| ArrayBuffer
			| SharedArrayBuffer
	) => fileSizeBefore > Buffer.byteLength(writeBuffer),
	success: async (
		inputPath: string,
		outputPath: string,
		fileSizeBefore: number,
		fileSizeAfter: number
	) =>
		`\u001b[32mCompressed ${inputPath} for ${await formatBytes(
			fileSizeBefore - fileSizeAfter
		)} (${(
			((fileSizeBefore - fileSizeAfter) / fileSizeBefore) *
			100
		).toFixed(2)}% reduction) in ${outputPath} .\u001b[39m`,
	end: async (pipe: {
		files: number;
		type: string;
		info: { total: number };
	}) =>
		`\u001b[32mSuccessfully compressed a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		} for ${await formatBytes(pipe.info.total)}.\u001b[39m`,
});

export default async (
	path: optionPath,
	settings: Options,
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
							write: async (data) => csso(data, setting).css,
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
							write: async (data) =>
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
							write: async (data) =>
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
							write: async (sharpFile) =>
								await sharpRead(sharpFile, setting),
							read: async (file) =>
								sharp(file, {
									failOn: "none",
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
							write: async (data) => {
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
