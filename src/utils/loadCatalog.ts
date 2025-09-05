import { Item } from "../models/Item";
import * as fs from "fs";

export function loadCatalog(path: string): Record<string, Item> {
  const raw = fs.readFileSync(path, "utf-8");
  const items: Item[] = JSON.parse(raw);

  // Return { [sku]: item }
  return Object.fromEntries(items.map(item => [item.sku, item]));
}
