import { BuyNPayMRule } from "../src/models/rules/BuyNPayMRule";
import { CartItem } from "../src/models/CartItem";
import { Item } from "../src/models/Item";

describe("BuyNPayMRule", () => {
  // Sample buy n pay m rule
  const rule = new BuyNPayMRule("atv", 3, 2);

  // Sample unit price for the sample item
  const unitPrice = 109.50;

  // Helper function to create mock cart items
  const createCartItem = (sku: string, quantity: number, price: number): CartItem => {
    const item: Item = { sku, name: `Test ${sku}`, price };
    return { item, quantity };
  };

  // Helper function to create cart with single item
  const createCart = (sku: string, quantity: number, price: number): CartItem[] => {
    return [createCartItem(sku, quantity, price)];
  };

  test("canApply returns false if item not in cart", () => {
    const cartItems = createCart("other", 5, unitPrice);
    expect(rule.canApply(cartItems)).toBe(false);
  });

  test("canApply returns false below threshold", () => {
    const cartItems = createCart("atv", 2, unitPrice);
    expect(rule.canApply(cartItems)).toBe(false);
  });

  test("canApply returns true at threshold", () => {
    const cartItems = createCart("atv", 3, unitPrice);
    expect(rule.canApply(cartItems)).toBe(true);
  });

  test("canApply returns true above threshold", () => {
    const cartItems = createCart("atv", 6, unitPrice);
    expect(rule.canApply(cartItems)).toBe(true);
  });

  test("returns no discount below threshold", () => {
    const cartItems = createCart("atv", 2, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBeCloseTo(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
  });

  test("returns correct discount at threshold (3 for 2)", () => {
    const cartItems = createCart("atv", 3, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    // Buy 3, pay for 2 = save price of 1 item
    const expectedDiscount = 1 * unitPrice; // 109.50
    
    expect(adjustment.amount).toBeCloseTo(expectedDiscount);
    expect(adjustment.type).toBe('discount');
    expect(adjustment.appliedTo).toEqual(['atv']);
  });

  test("handles multiple discount bundles in the same purchase", () => {
    const cartItems = createCart("atv", 6, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    // 6 items = 2 complete sets of "buy 3 pay 2"
    // Save 2 items worth = 2 * 109.50 = 219.00
    const expectedDiscount = 2 * unitPrice;
    
    expect(adjustment.amount).toBeCloseTo(expectedDiscount);
    expect(adjustment.type).toBe('discount');
    expect(adjustment.appliedTo).toEqual(['atv']);
  });

  test("handles remainder items correctly", () => {
    const cartItems = createCart("atv", 7, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    // 7 items = 2 complete sets (6 items) + 1 remainder
    // Save 2 items worth = 2 * 109.50 = 219.00
    // Remainder pays full price
    const expectedDiscount = 2 * unitPrice;
    
    expect(adjustment.amount).toBeCloseTo(expectedDiscount);
    expect(adjustment.type).toBe('discount');
    expect(adjustment.appliedTo).toEqual(['atv']);
  });

  test("handles negative quantity", () => {
    const cartItems = createCart("atv", -1, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
    expect(adjustment.description).toContain('Invalid');
  });

  test("handles negative unit price", () => {
    const cartItems = createCart("atv", 5, -99.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
    expect(adjustment.description).toContain('Invalid');
  });

  test("returns 0 discount when quantity is 0", () => {
    const cartItems = createCart("atv", 0, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
  });

  test("handles item not found in cart", () => {
    const cartItems = createCart("other", 5, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
  });

  test("adjustment description is meaningful", () => {
    const cartItems = createCart("atv", 6, unitPrice);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.description).toBeTruthy();
    expect(typeof adjustment.description).toBe('string');
    expect(adjustment.description).toContain('Buy 3 pay 2');
  });
});