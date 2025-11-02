import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '.*\\.module\\.ts$',
    'src/main.ts',
    'src/common/cpf.util.ts',
  ],
};

export default config;
