module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
};
