import * as fs from "fs";

export interface optionCallbacksPipe {
	debug: number;
	files: number;
	current: optionCallbacksFile;
	type: string;
	info: any;
}

export interface optionCallbacksFile {
	inputPath: string;
	outputPath: string;
	fileSizeAfter: number;
	fileSizeBefore: number;
}

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
	wrote?: (data: string) => Promise<any>;
}

export const callbacks: functionCallbacks = {
	wrote: async (data: string) => data,
	read: async (file: fs.PathLike | fs.promises.FileHandle) =>
		await fs.promises.readFile(file, "utf-8"),
	passed: async () => true,
	failed: async (inputPath: optionCallbacksFile["inputPath"]) =>
		`Error: Cannot process file ${inputPath} !`,
	accomplished: async (
		inputPath: optionCallbacksFile["inputPath"],
		outputPath: optionCallbacksFile["outputPath"],
		_fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
		_fileSizeAfter: optionCallbacksFile["fileSizeAfter"]
	) => `Processed ${inputPath} in ${outputPath} .`,
	fulfilled: async (pipe: optionCallbacksPipe) =>
		`Successfully processed a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${pipe.files === 1 ? "file" : "files"}.`,
	changed: async (pipe) => pipe,
};

export type optionPath = string | URL | Map<string | URL, string | URL>;
export type optionExclude = string | RegExp | ((file: string) => boolean);

export interface Options {
	// rome-ignore lint:
	[key: string]: any;

	path?: optionPath | optionPath[] | Set<optionPath>;

	exclude?: optionExclude | optionExclude[] | Set<optionExclude>;

	logger?: 0 | 1 | 2;
}

export default {
	path: "./dist/",
	logger: 2,
};
