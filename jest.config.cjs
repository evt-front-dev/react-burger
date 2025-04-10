module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs)$": ["babel-jest", { rootMode: "upward" }],
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "cjs"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/jest/styleMock.cjs",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/jest/fileMock.cjs",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.cjs"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@ya\\.praktikum/react-developer-burger-ui-components)/)",
  ],
  testMatch: ["**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx|cjs)"],
};
