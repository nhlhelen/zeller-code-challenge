import { PricingRule } from "./PricingRule";

export class ThreeForTwoRule implements PricingRule {
  sku: string;
  constructor(sku) {
    this.sku = sku;
  }

  apply(quantity: number, unitPrice: number): number {
    // Count how many free items
    const freeItems = Math.floor(quantity / 3);

    // The actual quantity that the user pays for
    const payable = quantity - freeItems;

    // Subtotal for this item
    return payable * unitPrice;
  }
}
