import { Checkout } from "../src/services/Checkout"
import { Item } from "../src/models/Item";
import { loadCatalog } from "../src/utils/loadCatalog";
import * as path from "path";
import { BuyNPayMRule } from "../src/models/rules/BuyNPayMRule";
import { BulkBuyDiscountRule } from "../src/models/rules/BulkBuyDiscountRule";

describe("Checkout", () => {
  const catalog = loadCatalog(path.join(__dirname, "../src/data/catalog.json"));
  
  test("Returns 0 for an empty cart", () => {
    const co = new Checkout([], catalog);
    expect(co.total()).toBe(0);
  });
  
  test("Scanning one item adds it to the cart", () => {
    const co = new Checkout([], catalog);
    const vga: Item = { sku: "vga", name: "VGA adapter", price: 30.00 };
    co.scan(vga);
    expect(co.total()).toBeCloseTo(30);
  });
  
  test("Detect and reject invalid SKUs", () => {
    const co = new Checkout([], catalog);
    const invalidItem = catalog["abc"]; // Invalid item
    co.scan(invalidItem);
    expect(co.total()).toBe(0);
  });
  
  test("Scanning same item multiple times increases quantity", () => {
    const co = new Checkout([], catalog);
    co.scan(catalog["vga"]);
    co.scan(catalog["vga"]);
    expect(co.total()).toBeCloseTo(60);
  });
  
  test("Multiple different items are added correctly", () => {
    const co = new Checkout([], catalog);
    co.scan(catalog["atv"]); // 109.50
    co.scan(catalog["vga"]); // 30.00
    expect(co.total()).toBeCloseTo(139.50);
  });
  
  test("example scenario 1 from readme", () => {
    const co = new Checkout(
      [new BuyNPayMRule("atv", 3, 2)],
      catalog
    );
    co.scan(catalog["atv"]);
    co.scan(catalog["atv"]);
    co.scan(catalog["atv"]);
    co.scan(catalog["vga"]); 
    
    expect(co.total()).toBeCloseTo(249.00);
  });
  
  test("example scenario 2 from readme", () => {
    const co = new Checkout(
      [
        new BuyNPayMRule("atv", 3, 2),
        new BulkBuyDiscountRule("ipd", 4, 499.99)
      ],
      catalog
    );
    co.scan(catalog["atv"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["atv"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    
    // 2 ATV = 2 × 109.50 = 219.00
    // 5 IPD = 5 × 499.99 = 2499.95
    // Total = 2718.95
    expect(co.total()).toBeCloseTo(2718.95);
  });
  
  test("example scenario 3 - both rules apply", () => {
    const co = new Checkout(
      [
        new BuyNPayMRule("atv", 3, 2),
        new BulkBuyDiscountRule("ipd", 4, 499.99)
      ],
      catalog
    );
    
    // 3 for 2 atv
    co.scan(catalog["atv"]);
    co.scan(catalog["atv"]);
    co.scan(catalog["atv"]);
    
    // Add 5 IPD to trigger bulk discount
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    
    // Total:
    // atv * 2 = $109.50 * 2
    // discounted ipd * 5 = 499.99 * 5
    expect(co.total()).toBeCloseTo(2718.95);
  });
  
  test("rules don't apply when threshold not met", () => {
    const co = new Checkout(
      [
        new BuyNPayMRule("atv", 3, 2),
        new BulkBuyDiscountRule("ipd", 4, 499.99)
      ],
      catalog
    );
    
    co.scan(catalog["atv"]);
    co.scan(catalog["atv"]);
    co.scan(catalog["ipd"]);
    co.scan(catalog["ipd"]);
    
    // Total:
    // 2 ATV = 2 * 109.50 = 219.00
    // 2 IPD = 2 * 549.99 = 1099.98
    expect(co.total()).toBeCloseTo(1318.98);
  });
  
  test("getCartItems returns correct items", () => {
    const co = new Checkout([], catalog);
    co.scan(catalog["atv"]);
    co.scan(catalog["vga"]);
    co.scan(catalog["atv"]);
    
    const cartItems = co.getCartItems();
    expect(cartItems).toHaveLength(2); // Have two cart items only
    
    const atvItem = cartItems.find(item => item.item.sku === "atv");
    const vgaItem = cartItems.find(item => item.item.sku === "vga");
    
    expect(atvItem?.quantity).toBe(2);
    expect(vgaItem?.quantity).toBe(1);
  });
});