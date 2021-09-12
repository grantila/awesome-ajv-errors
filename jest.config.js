export default {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/lib/**/*.test.ts',
    '<rootDir>/ajv-versions/v-*/*.test.ts',
  ],
  modulePathIgnorePatterns: [],
  collectCoverageFrom: ['<rootDir>/lib/**/*.ts', 'index.ts'],
	coveragePathIgnorePatterns: [ '/node_modules/', '/__snapshots__/', '/test/' ],
  coverageReporters: ['lcov', 'text', 'html'],
  collectCoverage: true,
  extensionsToTreatAsEsm: ['.ts'],
}
