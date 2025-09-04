import { PricingRule } from "./PricingRule";

export class BuyNPayMRule implements PricingRule {
  sku: string;
  n: number;
  m: number;

  constructor(sku, n, m) {
    this.sku = sku;
    this.n = n;
    this.m = m;
  }

  apply(quantity: number, unitPrice: number): number {
    // Count how many times can the discount be applied per the quantity
    const numOfTimesDiscountApplied = Math.floor(quantity / this.n);

    // Number of remaining items not included in discount
    const remaining = quantity % this.n;

    // Sub-total for this item
    const total =
      numOfTimesDiscountApplied * this.m * unitPrice + remaining * unitPrice;
    return total;
  }
}
