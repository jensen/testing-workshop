export default {
  scripts: {
    test: "deno test",
    coverage:
      "rm -rf coverage && deno test --coverage=coverage && deno coverage coverage",
  },
};
