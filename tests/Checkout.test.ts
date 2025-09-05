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
    const invalidItem = catalog["abc"]
    co.scan(invalidItem);
    expect(co.total()).toBe(0);
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
      [new BuyNPayMRule("atv", 3, 2),
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

    expect(co.total()).toBeCloseTo(2718.95);
  })
});
