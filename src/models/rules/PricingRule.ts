import { CartItem } from "../CartItem";
import { PricingAdjustment } from "../PricingAdjustment";
export interface PricingRule {
  // unique identifier to the pricing rule
  id: string;
  
  description?: string;

  // Check if this rule can be applied to the cart
  canApply(cartItems: CartItem[]): boolean;

  // Returns pricing adjustment after the rule is applied
  apply(cartItems: CartItem[]) : PricingAdjustment;
}
