/** @type {import('ts-jest').JestConfigWithTsJest} */

const { jsWithTs: tsjPreset } = require('ts-jest/presets')


module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transformIgnorePatterns: ["node_modules/(?!(ts-gaussian)/)"],
};
