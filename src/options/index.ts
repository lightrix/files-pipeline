export type path = string | URL | Map<string | URL, string | URL>;
export type exclude = string | RegExp | ((file: string) => boolean);

export interface Options {
	// rome-ignore lint:
	[key: string]: any;

	path?: path | path[] | Set<path>;

	exclude?: exclude | exclude[] | Set<exclude>;

	logger?: 0 | 1 | 2;
}

export default {
	path: "./dist/",
	logger: 2,
} satisfies Options;
