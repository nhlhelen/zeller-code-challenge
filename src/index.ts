import { Checkout } from "./services/Checkout";
import { Item } from "./models/Item";
import { PricingRule } from "./models/rules/PricingRule";
import { loadCatalog } from "./utils/loadCatalog";
import { ThreeForTwoRule } from "./models/rules/ThreeForTwoRule";

function main(): void {
  console.log("Starting Checkout System...\n");

  // Define pricing rules
  const pricingRules: PricingRule[] = [new ThreeForTwoRule("atv")];

  // Define items
  const item1: Item = { sku: "ipd", name: "Super iPad", price: 549.99 };
  const item2: Item = { sku: "mbp", name: "MacBook Pro", price: 1399.99 };
  const item3: Item = { sku: "atv", name: "Apple TV", price: 109.50 };


  // Create checkout instance
  const co = new Checkout(pricingRules);
  // co.scan(item1);
  // co.scan(item2);
  // co.scan(item2);
  co.scan(item3);
  co.scan(item3);
  co.scan(item3);


  // Calculate total
  const totalAmount = co.total();
  console.log(`\nFinal amount: $${totalAmount.toFixed(2)}`);
}

if (require.main === module) {
  main();
}
