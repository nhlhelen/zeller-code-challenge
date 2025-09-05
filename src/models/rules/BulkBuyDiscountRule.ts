import { CartItem } from "../CartItem";
import { PricingAdjustment } from "../PricingAdjustment";
import { PricingRule } from "./PricingRule";

export class BulkBuyDiscountRule implements PricingRule {
  id = "BulkBuyDiscount";
  description = "Discounted price when quantity is over threshold";
  sku: string;
  thresholdQuantity: number;
  discountedPrice: number;

  constructor(sku, thresholdQuantity, discountedPrice) {
    this.sku = sku;
    this.thresholdQuantity = thresholdQuantity;
    this.discountedPrice = discountedPrice;
  }

  canApply(cartItems: CartItem[]): boolean {
    const applicableItem = cartItems.find(item => item.item.sku === this.sku);
    return applicableItem !== undefined && applicableItem.quantity > this.thresholdQuantity;
  }

  // Returns the discounted price with the bulk buy special
  apply(cartItems: CartItem[]): PricingAdjustment {
    const applicableItem = cartItems.find(item => item.item.sku === this.sku);
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
    
    let adjustment = 0;

    if (quantity > this.thresholdQuantity) {
      let originalTotal = quantity * applicableItem.item.price;
      const discountedTotal = quantity * this.discountedPrice;

      // Calculate the adjustment from discount
      adjustment = originalTotal - discountedTotal;
    } else {
      adjustment = 0;
    }

    return {
      amount: adjustment,
      type: 'discount',
      appliedTo: [applicableItem.item.sku],
      description: `Bulk discount on ${applicableItem.quantity} ${applicableItem.item.name}`
    };
  }
}