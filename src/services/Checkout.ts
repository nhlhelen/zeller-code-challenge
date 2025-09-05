import { PricingRule } from "../models/rules/PricingRule";
import { Item } from "../models/Item";
import { CartItem } from "../models/CartItem";
import { loadCatalog } from "../utils/loadCatalog";

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

  // Get all pricing rules for an item
  getApplicableRules(sku: string): PricingRule[] {
    return this.pricingRules.filter(rule => rule.sku === sku);
  }

  // Handles multiple rules for the same item
  applyMultipleRules(cartItem: CartItem, applicableRules: PricingRule[]): number {
    if (applicableRules.length === 0) {
      // No rules, use regular price
      return cartItem.item.price * cartItem.quantity;
    }
    
    if (applicableRules.length === 1) {
      // Single rule, apply it
      return applicableRules[0].apply(cartItem.quantity, cartItem.item.price);
    }
    
    // Multiple rules: find the best price for customer (lowest total)
    let bestPrice = cartItem.item.price * cartItem.quantity;
    let bestRuleName = "regular price";
    
    for (const rule of applicableRules) {
      const rulePrice = rule.apply(cartItem.quantity, cartItem.item.price);
      if (rulePrice < bestPrice) {
        bestPrice = rulePrice;
        bestRuleName = rule.constructor.name || "pricing rule";
      }
    }
    
    if (bestRuleName !== "regular price") {
      console.log(`Best rule for ${cartItem.item.name}: ${bestRuleName}`);
    }
    
    return bestPrice;
  }

  // Calculate the total price of items in the shopping cart
  total(): number {
    let totalAmount = 0;
    // Get cart items as an array
    let cartItems: CartItem[] = this.getCartItems();

    for (const cartItem of cartItems) {

      // Find all applicable rules instead of just the first one
      const applicableRules = this.getApplicableRules(cartItem.item.sku);
      
      // Apply multiple rules logic
      const itemTotal = this.applyMultipleRules(cartItem, applicableRules);
      totalAmount += itemTotal;

      if (applicableRules.length >= 1) {
        console.log(`Found ${applicableRules.length} pricing rule(s) for ${cartItem.item.name}`);
      }
    }
    console.log(`Total is $${totalAmount}`);
    return totalAmount;
  }
}
