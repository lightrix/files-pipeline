import * as fs from "fs";
import type { Pattern } from "fast-glob";

export type optionDebug = 0 | 1 | 2;

export interface functionCallbacks {
	fulfilled?: boolean | ((pipe: optionCallbacksPipe) => Promise<string>);
	failed?:
		| boolean
		| ((inputPath: optionCallbacksFile["inputPath"]) => Promise<string>);
	accomplished?:
		| boolean
		| ((
				inputPath: optionCallbacksFile["inputPath"],
				outputPath: optionCallbacksFile["outputPath"],
				fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
				fileSizeAfter: optionCallbacksFile["fileSizeAfter"]
		  ) => Promise<string>);
	changed?: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
	passed?: (
		fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
		writeBuffer:
			| string
			| NodeJS.ArrayBufferView
			| ArrayBuffer
			| SharedArrayBuffer
	) => Promise<boolean>;
	// rome-ignore lint:
	read?: (file: string) => Promise<any>;
	// rome-ignore lint:
	wrote?: (file: string, data: string) => Promise<any>;
}

export type optionExclude = string | RegExp | ((file: string) => boolean);

export type optionPath = string | URL | Map<string | URL, string | URL> | false;

export interface Options {
	// rome-ignore lint:
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
	// rome-ignore lint:
	info: any;
}

export interface optionCallbacksFile {
	inputPath: string;
	outputPath: string;
	fileSizeAfter: number;
	fileSizeBefore: number;
}

export default {
	path: "./dist/",
	logger: 2,
	pipeline: {
		wrote: async (_file, data) => data,
		read: async (file) => await fs.promises.readFile(file, "utf-8"),
		passed: async () => true,
		failed: async (inputPath) => `Error: Cannot process file ${inputPath}!`,
		accomplished: async (
			inputPath,
			outputPath,
			_fileSizeBefore,
			_fileSizeAfter
		) => `Processed ${inputPath} in ${outputPath}.`,
		fulfilled: async (pipe) =>
			`Successfully processed a total of ${pipe.files} ${
				pipe.files === 1 ? "file" : "files"
			}.`,
		changed: async (pipe) => pipe,
	},
} satisfies Options;
