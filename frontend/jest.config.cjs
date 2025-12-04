// frontend/jest.config.cjs

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};

module.exports = createJestConfig(customJestConfig);
