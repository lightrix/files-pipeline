import * as fs from "fs";

import formatBytes from "./../../lib/format-bytes.js";

export type callbacks = {
	// rome-ignore lint:
	write: (data: string) => Promise<any>;
	// rome-ignore lint:
	read: (file: string) => Promise<any>;
	error: (inputPath: string) => Promise<string>;
	check: (
		fileSizeBefore: number,
		writeBuffer:
			| string
			| NodeJS.ArrayBufferView
			| ArrayBuffer
			| SharedArrayBuffer
	) => Promise<boolean>;
	success: (
		inputPath: string,
		outputPath: string,
		fileSizeBefore: number,
		fileSizeAfter: number
	) => Promise<string>;
	// rome-ignore lint:
	end: (pipe: any) => Promise<string>;
	// rome-ignore lint:
	pipe: (
		inputPath: string,
		outputPath: string,
		fileSizeBefore: number,
		fileSizeAfter: number
	) => Promise<void>;
};

export default {
	write: async (data: string) => data,
	read: async (file: fs.PathLike | fs.promises.FileHandle) =>
		await fs.promises.readFile(file, "utf-8"),
	check: async () => true,
	error: async (inputPath: string) =>
		`Error: Cannot process file ${inputPath} !`,
	success: async (
		inputPath: string,
		outputPath: string,
		_fileSizeBefore: number,
		_fileSizeAfter: number
	) => `\u001b[32mProcessed ${inputPath} in ${outputPath} .\u001b[39m`,
	end: async (pipe: { files: number; type: string; total: number }) =>
		`\u001b[32mSuccessfully processed a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		} for ${await formatBytes(pipe.total)}.\u001b[39m`,
	pipe: async (
		_inputPath: string,
		_outputPath: string,
		_fileSizeBefore: number,
		_fileSizeAfter: number
	) => {},
} satisfies callbacks;
