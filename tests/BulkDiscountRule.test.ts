import { BulkBuyDiscountRule } from "../src/models/rules/BulkBuyDiscountRule";

describe("BulkDiscountRule", () => {
  const rule = new BulkBuyDiscountRule("ipd", 4, 499.99);

  test("calculates with normal price if below threshold", () => {
    expect(rule.apply(3, 549.99)).toBeCloseTo(1649.97);
  });

  test("calculates with normal price if at threshold", () => {
    expect(rule.apply(4, 549.99)).toBeCloseTo(2199.96);
  });

  test("calculates with discounted price if above threshold", () => {
    expect(rule.apply(5, 549.99)).toBeCloseTo(2499.95);
  });

  test("Handles negative value in quantity", () => {
    expect(rule.apply(-1, 549.99)).toBeCloseTo(0);
  });

  test("Handles negative value in unit price", () => {
    expect(rule.apply(5, -99.99)).toBeCloseTo(0);
  });
});
