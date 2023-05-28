module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./src'],
    silent: false,
    verbose: true,
    collectCoverageFrom: ['src/**'],
    coverageReporters: ['html', 'text'],
    coverageThreshold: {
        global: {
            lines: 90
        }
    }
};
