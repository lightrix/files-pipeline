import * as fs from "fs";
import type { Stream } from "stream";
import type { Pattern } from "fast-glob";

export type optionDebug = 0 | 1 | 2;

export type optionBuffer =
	| string
	| NodeJS.ArrayBufferView
	| Iterable<string | NodeJS.ArrayBufferView>
	| AsyncIterable<string | NodeJS.ArrayBufferView>
	| Stream;

export interface functionCallbacks {
	fulfilled?: boolean | ((pipe: optionCallbacksPipe) => Promise<string>);

	failed?:
		| boolean
		| ((inputPath: optionCallbacksFile["inputPath"]) => Promise<string>);

	accomplished?:
		| boolean
		| ((current: optionCallbacksFile) => Promise<string>);

	changed?: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;

	passed?: (current: optionCallbacksFile) => Promise<boolean>;

	read?: (current: optionCallbacksFile) => Promise<optionBuffer>;

	wrote?: (current: optionCallbacksFile) => Promise<optionBuffer>;
}

export type optionExclude = string | RegExp | ((file: string) => boolean);

export type optionPath = string | URL | Map<string | URL, string | URL> | false;

export interface Options {
	// rome-ignore lint/suspicious/noExplicitAny:
	[key: string]: any;

	path?: optionPath | optionPath[] | Set<optionPath>;

	exclude?: optionExclude | optionExclude[] | Set<optionExclude>;

	files?: Pattern | Pattern[];

	type?: string;

	pipeline?: functionCallbacks;

	logger?: optionDebug;
}

export interface optionCallbacksPipe {
	debug: optionDebug;

	files: number;

	current: optionCallbacksFile;

	// rome-ignore lint/suspicious/noExplicitAny:
	info: any;
}

export interface optionCallbacksFile {
	inputPath: string;
	outputPath: string;
	fileSizeAfter: number;
	fileSizeBefore: number;
	buffer: optionBuffer;
}

export default {
	path: "./dist/",
	// rome-ignore lint/nursery/noPrecisionLoss: <explanation>
	logger: 2,
	pipeline: {
		wrote: async (current) => current.buffer,
		read: async (current) =>
			await fs.promises.readFile(current.inputPath, "utf-8"),
		passed: async () => true,
		failed: async (inputPath) => `Error: Cannot process file ${inputPath}!`,
		accomplished: async (current) =>
			`Processed ${current.inputPath} in ${current.outputPath}.`,
		fulfilled: async (pipe) =>
			`Successfully processed a total of ${pipe.files} ${
				pipe.files === 1 ? "file" : "files"
			}.`,
		changed: async (pipe) => pipe,
	},
} satisfies Options;
