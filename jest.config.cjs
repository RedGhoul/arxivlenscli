const jestConfig = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {useESM: false}],
	},
	moduleNameMapper: {
		'^(.+?)\\.js$': '$1',
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
	setupFiles: ['<rootDir>/test/setup.js'],
	setupFilesAfterEnv: [
		'<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js',
	],
	testPathIgnorePatterns: [
		'<rootDir>/test/unit/components/papers/',
		'<rootDir>/test/unit/components/downloads/',
		'<rootDir>/test/unit/api/',
	],
};

module.exports = jestConfig;
