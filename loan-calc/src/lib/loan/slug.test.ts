import { describe, it, expect } from "vitest";
import { buildSlug, parseSlug } from "./slug";
import { homePatterns } from "./patterns";

describe("buildSlug", () => {
  it("整数金利は .0 形式で固定される", () => {
    expect(buildSlug({ amount: 3000, years: 35, rate: 1.0 })).toBe("3000-35-1.0");
    expect(buildSlug({ amount: 3000, years: 35, rate: 2 })).toBe("3000-35-2.0");
  });

  it("小数金利はそのまま", () => {
    expect(buildSlug({ amount: 3000, years: 35, rate: 1.5 })).toBe("3000-35-1.5");
    expect(buildSlug({ amount: 3000, years: 35, rate: 0.5 })).toBe("3000-35-0.5");
  });
});

describe("parseSlug", () => {
  it("正しい slug をパースできる", () => {
    expect(parseSlug("3000-35-1.5")).toEqual({ amount: 3000, years: 35, rate: 1.5 });
    expect(parseSlug("1000-20-0.5")).toEqual({ amount: 1000, years: 20, rate: 0.5 });
  });

  it("不正な slug は null を返す", () => {
    expect(parseSlug("abc-35-1.5")).toBeNull();
    expect(parseSlug("3000-35")).toBeNull();
    expect(parseSlug("3000-35-1.5-extra")).toBeNull();
    expect(parseSlug("-35-1.5")).toBeNull();
    expect(parseSlug("3000-0-1.5")).toBeNull();
    expect(parseSlug("3000-35--1.5")).toBeNull();
  });
});

describe("build → parse の round-trip", () => {
  it("全 240 パターンで slug を作って戻したら同じになる", () => {
    for (const input of homePatterns()) {
      const slug = buildSlug(input);
      const parsed = parseSlug(slug);
      expect(parsed).toEqual(input);
    }
  });
});
