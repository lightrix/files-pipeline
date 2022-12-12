// rome-ignore lint/suspicious/noExplicitAny:
export default (test: any, fn: any) => {
	let tests;

	switch (true) {
		case test instanceof Map: {
			tests = new Map();

			for (const [key, value] of test) {
				tests.set(fn(key), fn(value));
			}

			return tests;
		}

		case test instanceof Set: {
			tests = new Set();

			for (const el of test) {
				tests.add(fn(el));
			}

			return tests;
		}

		case test instanceof Array: {
			tests = new Array();

			for (const index of test) {
				tests.push(fn(index));
			}

			return tests;
		}

		default:
			return fn(test);
	}
};
