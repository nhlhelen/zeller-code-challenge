import { Checkout } from "../src/services/Checkout"
import { Item } from "../src/models/Item";

describe("Checkout", () => {
  test("returns 0 for an empty cart", () => {
    const co = new Checkout([]);
    expect(co.total()).toBe(0);
  });

  test("Scanning one item adds it to the cart", () => {
    const co = new Checkout([]);
    const vga: Item = { sku: "vga", name: "VGA adapter", price: 30.00 };
    co.scan(vga);
    expect(co.total()).toBeCloseTo(30);
  });


});
