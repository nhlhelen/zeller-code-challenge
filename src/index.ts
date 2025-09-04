import { Checkout } from "./services/Checkout";
import { Item } from "./models/Item";
import { PricingRule } from "./models/rules/PricingRule";
import { loadCatalog } from "./utils/loadCatalog";
import { BuyNPayMRule } from "./models/rules/BuyNPayMRule";
import { BulkBuyDiscountRule } from "./models/rules/BulkBuyDiscountRule";

function main(): void {
  console.log("Starting Checkout System...\n");

  // Define pricing rules
  const pricingRules: PricingRule[] = [
    new BuyNPayMRule("atv", 3, 2),
    new BulkBuyDiscountRule("ipd", 4, 499.99)
  ];

  // Define items
  const item1: Item = { sku: "ipd", name: "Super iPad", price: 549.99 };
  const item2: Item = { sku: "mbp", name: "MacBook Pro", price: 1399.99 };
  const item3: Item = { sku: "atv", name: "Apple TV", price: 109.5 };
  const item4: Item = { sku: "vga", name: "VGA adapter", price: 30.00 };


  // Create checkout instance
  const co = new Checkout(pricingRules);
  co.scan(item3);
  co.scan(item1);
  co.scan(item1);
  co.scan(item3);
  co.scan(item1);
  co.scan(item1);
  co.scan(item1);

  // Calculate total
  const totalAmount = co.total();
  console.log(`\nFinal amount: $${totalAmount.toFixed(2)}`);
}

if (require.main === module) {
  main();
}
