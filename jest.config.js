/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.d.ts',
        '!index.ts',
        '!node_modules/**',
        '!dist/**',
        '!**/__tests__/**',
        '!**/__mocks__/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 90,
            lines: 70,
            statements: 65,
        },
    },
    verbose: true,
    moduleNameMapper: {
        '^node-localstorage$': '<rootDir>/__mocks__/node-localstorage.ts',
    },
}
