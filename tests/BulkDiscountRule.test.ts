import { BulkBuyDiscountRule } from "../src/models/rules/BulkBuyDiscountRule";
import { CartItem } from "../src/models/CartItem";
import { Item } from "../src/models/Item";

describe("BulkDiscountRule", () => {
  // Sample bulk buy discount rule
  const rule = new BulkBuyDiscountRule("ipd", 4, 499.99);
  
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
    const cartItems = createCart("other", 5, 549.99);
    expect(rule.canApply(cartItems)).toBe(false);
  });

  test("canApply returns false if below threshold", () => {
    const cartItems = createCart("ipd", 3, 549.99);
    expect(rule.canApply(cartItems)).toBe(false);
  });

  test("canApply returns false if at threshold", () => {
    const cartItems = createCart("ipd", 4, 549.99);
    expect(rule.canApply(cartItems)).toBe(false);
  });

  test("canApply returns true if above threshold", () => {
    const cartItems = createCart("ipd", 5, 549.99);
    expect(rule.canApply(cartItems)).toBe(true);
  });

  test("returns no discount if below threshold", () => {
    const cartItems = createCart("ipd", 3, 549.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBeCloseTo(0);
    expect(adjustment.type).toBe('invalid');
  });

  test("returns no discount if at threshold", () => {
    const cartItems = createCart("ipd", 4, 549.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBeCloseTo(0);
    expect(adjustment.type).toBe('invalid');
  });

  test("returns correct discount if above threshold", () => {
    const cartItems = createCart("ipd", 5, 549.99);
    const adjustment = rule.apply(cartItems);
    
    const expectedDiscount = (5 * 549.99) - (5 * 499.99);
    
    expect(adjustment.amount).toBeCloseTo(expectedDiscount);
    expect(adjustment.type).toBe('discount');
    expect(adjustment.appliedTo).toEqual(['ipd']);
  });

  test("handles negative quantity", () => {
    const cartItems = createCart("ipd", -1, 549.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
  });

  test("handles negative unit price", () => {
    const cartItems = createCart("ipd", 5, -99.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
    expect(adjustment.description).toContain('Invalid');
  });

  test("handles item not found in cart", () => {
    const cartItems = createCart("other", 5, 549.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.amount).toBe(0);
    expect(adjustment.type).toBe('invalid');
    expect(adjustment.appliedTo).toEqual([]);
  });

  test("adjustment description is meaningful", () => {
    const cartItems = createCart("ipd", 5, 549.99);
    const adjustment = rule.apply(cartItems);
    
    expect(adjustment.description).toBeTruthy();
    expect(typeof adjustment.description).toBe('string');
  });
});