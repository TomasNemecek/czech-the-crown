import { describe, it, expect } from "vitest";
import { sanitizeInput } from "@/util/utils";

describe("sanitizeInput", () => {
  it("removes control characters", () => {
    expect(sanitizeInput("hello\x00world")).toBe("helloworld");
    expect(sanitizeInput("test\x1Fstring")).toBe("teststring");
    expect(sanitizeInput("remove\x7Fthis")).toBe("removethis");
    expect(sanitizeInput("clean\x9Fme")).toBe("cleanme");
  });

  it("removes HTML characters", () => {
    expect(sanitizeInput("hello<script>alert('xss')</script>world")).toBe(
      "helloscriptalert('xss')/scriptworld",
    );
    expect(sanitizeInput("test<div>content</div>")).toBe("testdivcontent/div");
    expect(sanitizeInput("remove>arrows<")).toBe("removearrows");
  });

  it("respects default max length of 100 characters", () => {
    const longString = "a".repeat(150);
    const result = sanitizeInput(longString);
    expect(result).toHaveLength(100);
    expect(result).toBe("a".repeat(100));
  });

  it("respects custom max length", () => {
    const input = "hello world";
    expect(sanitizeInput(input, 5)).toBe("hello");
    expect(sanitizeInput(input, 50)).toBe("hello world");
    expect(sanitizeInput(input, 0)).toBe("");

    const longCurrencyName =
      "A very long currency name that exceeds fifty chars with these characters";
    expect(sanitizeInput(longCurrencyName, 50)).toBe(
      "A very long currency name that exceeds fifty chars",
    );
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
    expect(sanitizeInput("", 10)).toBe("");
  });

  it("handles normal text input unchanged", () => {
    expect(sanitizeInput("USD")).toBe("USD");
    expect(sanitizeInput("United States")).toBe("United States");
    expect(sanitizeInput("euro")).toBe("euro");
    expect(sanitizeInput("123.45")).toBe("123.45");
  });

  it("combines multiple sanitization rules", () => {
    const maliciousInput =
      "  \x00<script>alert('xss')\x1F</script>normal text\x7F  ";
    const expected = "scriptalert('xss')/scriptnormal text";
    expect(sanitizeInput(maliciousInput)).toBe(expected);
  });

  it("handles beginning and end whitespace", () => {
    expect(sanitizeInput("  usd")).toBe("usd");
    expect(sanitizeInput("United States")).toBe("United States");
    expect(sanitizeInput("Euro Area")).toBe("Euro Area");
    expect(sanitizeInput("  japanese yen  ")).toBe("japanese yen");
  });
});
