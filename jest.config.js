const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/config/jest/setup.js',
    globalTeardown: '<rootDir>/config/jest/teardown.js',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
    testMatch: [
        '**/__tests__/**/*.ts?(x)', 
        '**/?(*.)+(spec|test).ts?(x)'
    ]
};
