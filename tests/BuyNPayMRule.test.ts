import { BuyNPayMRule } from "../src/models/rules/BuyNPayMRule";

describe("BuyNPayMRule", () => {
  // 3 for 2 deal for Apple TV
  const rule = new BuyNPayMRule("atv", 3, 2); 
  const unitPrice = 109.50;

  test("calculates with normal price below threshold", () => {
    expect(rule.apply(2, unitPrice)).toBeCloseTo(219.00);
  });

  test("calculates with discount price right at threshold", () => {
    expect(rule.apply(3, unitPrice)).toBeCloseTo(219.00);
  });

  test("handles multiple discount bundles in the same purchase", () => {
    // Expect to pay for 4 when quantity is 6
    expect(rule.apply(6, unitPrice)).toBeCloseTo(438.00);
  });

  test("handles remainder items correctly", () => {
    expect(rule.apply(7, unitPrice)).toBeCloseTo(547.50);
  });

  test("Handles negative value in quantity", () => {
    expect(rule.apply(-1, unitPrice)).toBeCloseTo(0);
  });

  test("Handles negative value in unit price", () => {
    expect(rule.apply(-1, -99.99)).toBeCloseTo(0);
  });

  test("Returns 0 when quantity is 0", () => {
    expect(rule.apply(0, 499.99)).toBeCloseTo(0);
  });
});
