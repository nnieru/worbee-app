export type ProductCategory = "desk" | "chair" | "accessory";

export type ProductId =
  | "desk-compact"
  | "desk-wide"
  | "chair-task"
  | "chair-lounge"
  | "monitor"
  | "lamp"
  | "plant-floor"
  | "plant-desk"
  | "keyboard-mouse"
  | "storage";

export type AllowedSurface = "floor" | "desk";

export interface Product {
  id: ProductId;
  category: ProductCategory;
  name: string;
  description: string;
  monthlyPrice: number;
  sprite: {
    src: string;
    width: number;
    height: number;
    renderWidth: number;
    anchor: { x: number; y: number };
  };
  placement: {
    allowedSurfaces: AllowedSurface[];
    footprint: { width: number; height: number };
    maxQuantity: number;
    deskSurface?: { left: number; top: number; width: number; height: number };
  };
}
