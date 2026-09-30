import type { ProductId } from "./catalog";

export type WorkspaceSurface = "floor" | `desk:${string}`;

export interface PlacedItem {
  instanceId: string;
  productId: ProductId;
  x: number;
  y: number;
  surface: WorkspaceSurface;
}

export interface WorkspaceSummaryItem {
  productId: ProductId;
  name: string;
  quantity: number;
  monthlyPrice: number;
  lineTotal: number;
}

export interface WorkspaceSummary {
  items: WorkspaceSummaryItem[];
  itemCount: number;
  monthlyTotal: number;
}
