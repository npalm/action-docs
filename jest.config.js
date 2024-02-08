const config = {
  // https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1068342692
  transform: {
    "\\.[jt]sx?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],

  testEnvironment: "node",
  collectCoverage: true,
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  verbose: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 97.14,
      functions: 95.23,
      lines: 100,
    },
  },
};

export default config;
