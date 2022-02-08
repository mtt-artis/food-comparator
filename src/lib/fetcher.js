import { addFood } from "../store.js";
const API = "https://world.openfoodfacts.org/api/v0/product/";

export async function fetchAPI(barcode) {
  const response = await fetch(`${API}${barcode}.json`);
  const json = await response.json();
  if (json.status !== 1) return;
  addFood(json);
}
