import { Checkout } from './services/Checkout';
import { Item } from './models/Item';
import { PricingRule } from './models/PricingRule';
import { loadCatalog } from './utils/loadCatalog';

function main(): void {
  console.log('Starting Checkout System...\n');

  // Define pricing rules
  const pricingRules : PricingRule[] = [
    // TODO: add pricing rules
  ];

  // Define items
  const item1: Item = { sku: 'ipd', name: 'Super iPad', price: 549.99 };
  const item2: Item = { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 };

  // Create checkout instance
  const co = new Checkout(pricingRules);
  co.scan(item1);
  co.scan(item2);
  co.scan(item2);
  co.scan(item1);

  // Calculate total
  const totalAmount = co.total();
  console.log(`\nFinal amount: $${totalAmount.toFixed(2)}`);
}

if (require.main === module) {
  main();
}