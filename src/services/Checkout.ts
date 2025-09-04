import { PricingRule } from "../models/PricingRule";
import { Item } from "../models/Item";

export class Checkout {
    constructor(private pricingRules: PricingRule[]) {}
    scan(item: Item): void {
        console.log(`Scanning item ${item.name}`)
    }

    total(): number {
        let totalAmount = 0;
        console.log(`Total is ${totalAmount}`)
        return totalAmount;
    }
}