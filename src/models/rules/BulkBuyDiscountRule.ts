import { PricingRule } from "./PricingRule";

export class BulkBuyDiscountRule implements PricingRule {
  sku: string;
  thresholdQuantity: number;
  discountedPrice: number;

  constructor(sku, thresholdQuantity, discountedPrice) {
    this.sku = sku;
    this.thresholdQuantity = thresholdQuantity;
    this.discountedPrice = discountedPrice;
  }

  // Returns the discounted price with the bulk buy special
  apply(quantity: number, unitPrice: number): number {
    let total = 0;

    if (quantity > this.thresholdQuantity) {
      // Calculate sub-total with discounted price
      total += quantity * this.discountedPrice;
    } else {
      // Calculate the normal sub-total
      total += quantity * unitPrice;
    }
    return total;
  }
}