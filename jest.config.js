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
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};

export default config;
