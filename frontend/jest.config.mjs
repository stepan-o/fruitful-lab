import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Load next.config.ts and .env.* into the test env
    dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        // so `@/lib/...` works in tests
        '^@/(.*)$': '<rootDir>/$1',
    },
};

export default createJestConfig(customJestConfig);
