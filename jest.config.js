module.exports = {
  preset: 'jest-preset-angular',
  setupFiles: ['<rootDir>/setup-jest-globals.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: '<rootDir>/jest-environment.js',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
  },
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
};
