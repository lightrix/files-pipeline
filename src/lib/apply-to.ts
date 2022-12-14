export default async (
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	test: any,
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	fn: any
) => {
	let tests;

	switch (true) {
		case test instanceof Map: {
			tests = new Map();

			for (const [key, value] of test) {
				tests.set(await fn(key), await fn(value));
			}

			return tests;
		}

		case test instanceof Set: {
			tests = new Set();

			for (const el of test) {
				tests.add(await fn(el));
			}

			return tests;
		}

		case test instanceof Array: {
			tests = new Array();

			for (const index of test) {
				tests.push(await fn(index));
			}

			return tests;
		}

		default:
			return await fn(test);
	}
};
