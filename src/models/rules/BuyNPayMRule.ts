import { PricingRule } from "./PricingRule";
import { CartItem } from "../CartItem";
import { PricingAdjustment } from "../PricingAdjustment";

export class BuyNPayMRule implements PricingRule {
  id = "BuyNPayM";
  description = "Buy n items, pay for m amount only (E.g. Buy 3, Pay for 2)";

  sku: string;
  n: number;
  m: number;

  constructor(sku, n, m) {
    this.sku = sku;
    this.n = n;
    this.m = m;
  }

  canApply(cartItems: CartItem[]): boolean {
    const applicableItem = cartItems.find(item => item.item.sku === this.sku);
    return applicableItem !== undefined && applicableItem.quantity >= this.n;
  }

  apply(cartItems: CartItem[]): PricingAdjustment {
    const applicableItem = cartItems.find(item => item.item.sku === this.sku);
    
    // Check if item is applicable
    if (!applicableItem) {
      return {
        amount: 0,
        type: 'discount',
        appliedTo: [],
        description: 'Item not found in cart'
      };
    }

    const quantity = applicableItem.quantity;
    const unitPrice = applicableItem.item.price;

    // Handles negative values
    if (quantity <= 0 || unitPrice < 0) {
      return {
        amount: 0,
        type: 'invalid',
        appliedTo: [],
        description: 'Invalid quantity or unitPrice'
      };
    }
    // Count how many times can the discount be applied per the quantity
    const numOfTimesDiscountApplied = Math.floor(quantity / this.n);

    // Number of remaining items not included in discount
    const remaining = quantity % this.n;

    // Calculate the discounted total for this item
    const discountedTotal = numOfTimesDiscountApplied * this.m * unitPrice + remaining * unitPrice;
    
    // Calculate the original total
    const originalTotal = quantity * unitPrice;
    
    // The discount amount is the difference
    const discountAmount = originalTotal - discountedTotal;

    return {
      amount: discountAmount,
      type: 'discount',
      appliedTo: [this.sku],
      description: `Buy ${this.n} pay ${this.m}: ${numOfTimesDiscountApplied} set(s) applied`
    };
  }
}
