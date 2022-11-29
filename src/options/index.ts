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
} satisfies Options;
