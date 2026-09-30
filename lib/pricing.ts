import { getProduct } from "./catalog";
import type { PlacedItem, WorkspaceSummary } from "../types/workspace";

export function getWorkspaceSummary(items: PlacedItem[]): WorkspaceSummary {
  const quantities = new Map<PlacedItem["productId"], number>();

  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + 1);
  }

  const summaryItems = [...quantities.entries()].map(([productId, quantity]) => {
    const product = getProduct(productId);
    return {
      productId: product.id,
      name: product.name,
      quantity,
      monthlyPrice: product.monthlyPrice,
      lineTotal: product.monthlyPrice * quantity,
    };
  });

  return {
    items: summaryItems,
    itemCount: items.length,
    monthlyTotal: summaryItems.reduce((total, item) => total + item.lineTotal, 0),
  };
}

export function formatMonthlyPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
