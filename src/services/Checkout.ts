import { PricingRule } from "../models/rules/PricingRule";
import { Item } from "../models/Item";
import { CartItem } from "../models/CartItem";

export class Checkout {
  private shoppingCart = new Map<string, CartItem>(); // <sku, cartItem>

  constructor(private pricingRules: PricingRule[]) {}

  scan(item: Item): void {
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

  // Calculate the total price of items in the shopping cart
  total(): number {
    let totalAmount = 0;
    // Get cart items as an array
    let cartItems: CartItem[] = this.getCartItems();

    for (const cartItem of cartItems) {
      // TODO: this assumes only one pricing rule per item
      // Find if any pricing rule applies to this item
      const applicableRule = this.pricingRules.find(
        (matched) => matched.sku === cartItem.item.sku
      );

      if (applicableRule) {
        // Apply pricing rule to the item
        totalAmount += applicableRule.apply(
          cartItem.quantity,
          cartItem.item.price
        );
      } else {
        // Add to item total as usual
        const itemTotal = cartItem.item.price * cartItem.quantity;
        totalAmount += itemTotal;
      }
    }
    console.log(`Total is ${totalAmount}`);
    return totalAmount;
  }
}
