import { Item } from "../models/Item";
import * as fs from "fs";

export function loadCatalog(path: string): Record<string, Item> {
  try{

    const raw = fs.readFileSync(path, "utf-8");
    const items: Item[] = JSON.parse(raw);
  
    // Return { [sku]: item }
    return Object.fromEntries(items.map(item => [item.sku, item]));
  } catch (err) {
    console.warn(`Could not load file from path`)
    return {}
  }
}
