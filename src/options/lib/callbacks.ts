import * as fs from "fs";

export interface optionCallbacksPipe {
	files: number;
	type: string;
	// rome-ignore lint:
	info: any;
	current: optionCallbacksFile;
}

export interface optionCallbacksFile {
	inputPath: string;
	outputPath: string;
	fileSizeAfter: number;
	fileSizeBefore: number;
}

export interface functionCallbacks {
	fulfilled: boolean | ((pipe: optionCallbacksPipe) => Promise<string>);
	failed:
		| boolean
		| ((inputPath: optionCallbacksFile["inputPath"]) => Promise<string>);
	accomplished:
		| boolean
		| ((
				inputPath: optionCallbacksFile["inputPath"],
				outputPath: optionCallbacksFile["outputPath"],
				fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
				fileSizeAfter: optionCallbacksFile["fileSizeAfter"]
		  ) => Promise<string>);
	changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
	passed:
		| boolean
		| ((
				fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
				writeBuffer:
					| string
					| NodeJS.ArrayBufferView
					| ArrayBuffer
					| SharedArrayBuffer
		  ) => Promise<boolean>);
	// rome-ignore lint:
	read: (file: string) => Promise<any>;
	// rome-ignore lint:
	wrote: (data: string) => Promise<any>;
}

export default {
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
	) => `\u001b[32mProcessed ${inputPath} in ${outputPath} .\u001b[39m`,
	fulfilled: async (pipe: optionCallbacksPipe) =>
		`\u001b[32mSuccessfully processed a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		}.\u001b[39m`,
	changed: async (pipe) => pipe,
} satisfies functionCallbacks;
