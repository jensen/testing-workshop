import { assertEquals } from "https://deno.land/std@0.133.0/testing/asserts.ts";
import { getWinner } from "./main.ts";

Deno.test("no winner", () => {
  assertEquals(
    getWinner([null, null, null, null, null, null, null, null, "b"]),
    null
  );
});

Deno.test("horizontal", () => {
  assertEquals(
    getWinner(["x", "x", "x", null, null, null, null, null, null]),
    "x"
  );

  assertEquals(
    getWinner([null, null, null, "x", "x", "x", null, null, null]),
    "x"
  );

  assertEquals(
    getWinner([null, null, null, null, null, null, "x", "x", "x"]),
    "x"
  );
});

Deno.test("vertical", () => {
  assertEquals(
    getWinner(["x", null, null, "x", null, null, "x", null, null]),
    "x"
  );

  assertEquals(
    getWinner([null, "x", null, null, "x", null, null, "x", null]),
    "x"
  );

  assertEquals(
    getWinner([null, null, "x", null, null, "x", null, null, "x"]),
    "x"
  );
});

Deno.test("diagnal", () => {
  assertEquals(
    getWinner(["o", null, null, null, "o", null, null, null, "o"]),
    "o"
  );

  assertEquals(
    getWinner([null, null, "o", null, "o", null, "o", null, null]),
    "o"
  );
});
