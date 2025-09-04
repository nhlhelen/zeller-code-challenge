export interface PricingRule {
  sku: string;
  apply(quantity: number, unitPrice: number): number;
}