import { PricingRule } from "../models/rules/PricingRule";
import { Item } from "../models/Item";
import { CartItem } from "../models/CartItem";
import { loadCatalog } from "../utils/loadCatalog";
import { PricingAdjustment } from "../models/PricingAdjustment";

export class Checkout {
  private shoppingCart = new Map<string, CartItem>(); // <sku, cartItem>
  constructor(private pricingRules: PricingRule[], private catalog: Record<string, Item>) {}

  scan(item: Item): void {
    // check if catalog is not empty and SKU exists in catalog
    if (!item || Object.keys(this.catalog).length === 0 || !this.catalog[item.sku]) {
      console.warn(`Invalid item scanned... rejecting...`);
      return;
    }

    // Find whether item is in shopping cart already
    const existingCartItem = this.shoppingCart.get(item.sku);

    if (existingCartItem) {
      // Update the exisiting cart item's quantity
      existingCartItem.quantity += 1;
      console.log(
        `Updated quantity for ${item.name}: ${existingCartItem.quantity}`
      );
    } else {
      // Create new cart item for this item
      const newCartItem: CartItem = { item, quantity: 1 };
      this.shoppingCart.set(item.sku, newCartItem);
      console.log(`Added ${item.name} to shopping cart`);
    }
    console.log(`=====`);
  }

  // Get the list of cart items from shopping cart
  getCartItems(): CartItem[] {
    return Array.from(this.shoppingCart.values());
  }

  // Get original total without any rules applied
  private getOriginalTotal(): number {
    let total = 0;
    const cartItems = this.getCartItems();
    
    for (const cartItem of cartItems) {
      total += cartItem.item.price * cartItem.quantity;
    }
    
    return total;
  }

  // Get all pricing rules for an item
  getApplicableRules(): PricingRule[] {
    const cartItems = this.getCartItems();
    return this.pricingRules.filter(rule => rule.canApply(cartItems));
  }

  // Apply all rules then return all pricing adjustments
  private applyPricingRules(): PricingAdjustment[] {
    const cartItems = this.getCartItems();
    const applicableRules = this.getApplicableRules();
    
    const adjustments: PricingAdjustment[] = [];
    
    // Check for each pricing rule, if any pricing adjustments will be applied
    for (const rule of applicableRules) {
      const adjustment = rule.apply(cartItems);

      if (adjustment.amount > 0) {
        // Collect all applicable pricing adjustments
        adjustments.push(adjustment);
        console.log(`Applied rule: ${rule.id} -- ${adjustment.description}`);
      }
    }

    // Return all adjustments for a better receipt and management
    return adjustments;
  }

  // Calculate the total price of items in the shopping cart
  total(): number {
    // Total price without any pricing rules
    const originalTotal = this.getOriginalTotal();

    // Get all adjustments from all pricing rules
    const adjustments = this.applyPricingRules();
    
    // Calculate the total price adjustments
    const totalAdjustment = adjustments.reduce(
      (sum, adjustment) => sum + adjustment.amount, 
      0
    );
    
    // Calculate the final total
    const finalTotal = originalTotal - totalAdjustment;
    console.log(`Original total: $${originalTotal}`);

    if (totalAdjustment > 0) {
      // Display receipt with discounts applied
      console.log(`Total discounts:`);
      adjustments.forEach(adj => {
        console.log(`   - ${adj.description}: -$${adj.amount}`);
      });
    }
    console.log(`Final total: $${finalTotal}`);
    
    return finalTotal;
  }
}
