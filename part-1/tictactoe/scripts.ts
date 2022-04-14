export default {
  scripts: {
    test: "deno test",
    coverage:
      "rm -rf coverage && deno test --coverage=coverage && deno coverage coverage",
    report:
      "deno coverage coverage --lcov > coverage/coverage.lcov && genhtml -o coverage/html coverage/coverage.lcov",
  },
};
