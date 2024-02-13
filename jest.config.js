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
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};

export default config;
