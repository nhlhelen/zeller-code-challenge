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

// 5 for 3
// quantity is 7
// 7 // 5 => 1
// remainder 2
// total = 1 * m * price + 2 * price
