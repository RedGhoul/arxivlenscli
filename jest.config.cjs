const jestConfig = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {useESM: false}],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^source/(.*)$': '<rootDir>/source/$1.js',
		'^test/(.*)$': '<rootDir>/test/$1.js',
	},
	collectCoverageFrom: [
		'source/**/*.{ts,tsx}',
		'!source/**/*.d.ts',
		'!source/**/*.test.{ts,tsx}',
		'!source/cli.ts',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	setupFilesAfterEnv: [
		'<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js',
	],
};

module.exports = jestConfig;
