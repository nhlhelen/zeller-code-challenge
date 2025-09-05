import { Checkout } from "./services/Checkout";
import { PricingRule } from "./models/rules/PricingRule";
import { loadCatalog } from "./utils/loadCatalog";
import { BuyNPayMRule } from "./models/rules/BuyNPayMRule";
import { BulkBuyDiscountRule } from "./models/rules/BulkBuyDiscountRule";

function main(): void {
  console.log("Starting Checkout System...\n");

  // Load catalog and check if catalog is empty
  const catalog = loadCatalog("src/data/catalog.json");
  if (Object.keys(catalog).length < 1){
    console.log(`Catalog is empty, please add items`)
    return;
  }

  // Define pricing rules
  const pricingRules: PricingRule[] = [
    new BuyNPayMRule("atv", 3, 2),
    new BulkBuyDiscountRule("ipd", 4, 499.99)
  ];

  // Define items
  const item1 = catalog["ipd"];
  const item2 = catalog["mbp"];
  const item3 = catalog["atv"];
  const item4 = catalog["vga"];

  // Create checkout instance
  const co = new Checkout(pricingRules, catalog);
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
