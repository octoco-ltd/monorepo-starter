/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
    '^uuid$': require.resolve('uuid'),
  },
  transform: {
    '\\.tsx?$': [
      'ts-jest',
      {
        // Disables type-checking, but speeds up the tests massively and stops
        // crazy memory leaks in ts-jest:
        isolatedModules: true,
      },
    ],
  },
};
