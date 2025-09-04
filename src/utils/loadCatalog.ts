import { Item } from "../models/Item";
import * as fs from "fs";

export function loadCatalog(path: string): Item[] {
  const raw = fs.readFileSync(path, "utf-8");
  return JSON.parse(raw) as Item[];
}