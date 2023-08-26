import type { Config } from 'jest';
import { CS1531_ITERATION } from './shared/constants';

const testPathIgnorePatterns = CS1531_ITERATION === 1 ? ['<rootDir>/tests'] : ['<rootDir>/iter1'];

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/tests/setupTestsAfterEnv.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  forceExit: false,
  detectOpenHandles: true,

  // Allow JS Tests to run for Iteration 1 Automarking'
  testPathIgnorePatterns,
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
