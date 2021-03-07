module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lib/**/*.spec.ts'],
  modulePathIgnorePatterns: [],
  collectCoverageFrom: ['<rootDir>/lib/**/*.ts', 'index.ts'],
	coveragePathIgnorePatterns: [ '/node_modules/', '/__snapshots__/', '/test/' ],
  coverageReporters: ['lcov', 'text', 'html'],
  collectCoverage: true,
};
