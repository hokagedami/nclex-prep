export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/backend/**/*.test.js',
    '**/e2e/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  modulePaths: ['<rootDir>/../backend/node_modules', '<rootDir>/../frontend/node_modules'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '../backend/src/**/*.js',
    '!../backend/src/**/*.test.js',
  ],
  roots: ['<rootDir>'],
};
