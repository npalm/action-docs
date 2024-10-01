const config = {
  // https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1068342692
  transform: {
    "\\.[jt]sx?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  coverageReporters: ["lcov", "text", "html"],
  collectCoverageFrom: ["src/**/*.{ts,js,jsx}", "!src/**/*cli*.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  verbose: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 97.01,
      functions: 96.66,
      lines: 100,
    },
  },
};

export default config;
