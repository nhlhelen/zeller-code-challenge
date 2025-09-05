// Represents the pricing adjustment from a Pricing Rule
export interface PricingAdjustment {
  // The amount of price adjustment
  amount: number;

  // Type of adjustment
  type: 'discount' | 'invalid';

  // List of SKUs this adjustment affects
  appliedTo: string[];

  description: string;
}