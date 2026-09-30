import { getProduct } from "./catalog";
import type { Product, ProductId } from "../types/catalog";
import type { PlacedItem, WorkspaceSurface } from "../types/workspace";

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 760;
export const GRID_SIZE = 20;

export interface CanvasPoint {
  x: number;
  y: number;
}

export type PlacementResult =
  | { valid: true; x: number; y: number; surface: WorkspaceSurface }
  | { valid: false; message: string };

function snap(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function clientPointToCanvas(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
): CanvasPoint {
  return {
    x: snap(((clientX - rect.left) / rect.width) * CANVAS_WIDTH),
    y: snap(((clientY - rect.top) / rect.height) * CANVAS_HEIGHT),
  };
}

export function getSceneDepth(item: PlacedItem, items: PlacedItem[]): number {
  if (item.surface !== "floor") {
    const deskId = item.surface.slice("desk:".length);
    const desk = items.find((candidate) => candidate.instanceId === deskId);
    return (desk?.y ?? item.y) + 30;
  }

  return item.y;
}

function getDefaultPosition(product: Product, items: PlacedItem[]): CanvasPoint | null {
  if (product.category === "desk") {
    return { x: 600, y: 470 };
  }

  if (product.category === "chair") {
    return { x: 600, y: 610 };
  }

  if (product.id === "plant-floor") {
    return { x: 965, y: 610 };
  }

  if (product.id === "storage") {
    return { x: 300, y: 610 };
  }

  const desk = items.find((item) => getProduct(item.productId).category === "desk");
  if (!desk) {
    return null;
  }

  const surfaceItems = items.filter((item) => item.surface === `desk:${desk.instanceId}`);

  switch (product.id) {
    case "monitor": {
      const quantity = surfaceItems.filter((item) => item.productId === "monitor").length;
      return { x: desk.x - 70 + quantity * 140, y: desk.y - 310 };
    }
    case "lamp":
      return { x: desk.x + 165, y: desk.y - 310 };
    case "plant-desk":
      return { x: desk.x - 170, y: desk.y - 310 };
    case "keyboard-mouse":
      return { x: desk.x + 5, y: desk.y - 230 };
    default:
      return null;
  }
}

function isPointOnDesk(
  x: number,
  y: number,
  desk: PlacedItem,
): boolean {
  const product = getProduct(desk.productId);
  const bounds = product.placement.deskSurface;

  if (!bounds) {
    return false;
  }

  return (
    x >= desk.x + bounds.left &&
    x <= desk.x + bounds.left + bounds.width &&
    y >= desk.y + bounds.top &&
    y <= desk.y + bounds.top + bounds.height
  );
}

function overlaps(
  product: Product,
  position: CanvasPoint,
  surface: WorkspaceSurface,
  candidate: PlacedItem,
): boolean {
  if (candidate.surface !== surface) {
    return false;
  }

  const other = getProduct(candidate.productId);
  const horizontalGap =
    (product.placement.footprint.width + other.placement.footprint.width) / 2;
  const verticalGap =
    (product.placement.footprint.height + other.placement.footprint.height) / 2;

  return (
    Math.abs(position.x - candidate.x) < horizontalGap &&
    Math.abs(position.y - candidate.y) < verticalGap
  );
}

export function evaluatePlacement(
  productId: ProductId,
  items: PlacedItem[],
  requestedPosition?: CanvasPoint,
  movingInstanceId?: string,
): PlacementResult {
  const product = getProduct(productId);
  const existingItems = items.filter((item) => item.instanceId !== movingInstanceId);
  const replaceCategory = product.category === "accessory" ? null : product.category;
  const relevantItems = replaceCategory
    ? existingItems.filter((item) => getProduct(item.productId).category !== replaceCategory)
    : existingItems;

  if (product.category === "accessory") {
    const quantity = relevantItems.filter((item) => item.productId === productId).length;
    if (quantity >= product.placement.maxQuantity) {
      return {
        valid: false,
        message:
          productId === "monitor"
            ? "You can add up to two monitors."
            : `${product.name} is already in your setup.`,
      };
    }
  }

  let surface: WorkspaceSurface = "floor";
  let position = requestedPosition ?? getDefaultPosition(product, relevantItems);

  if (!position) {
    return {
      valid: false,
      message: "Choose a desk before adding desktop accessories.",
    };
  }

  if (product.placement.allowedSurfaces.includes("desk")) {
    const desks = relevantItems.filter(
      (item) => getProduct(item.productId).category === "desk",
    );
    if (desks.length === 0) {
      return {
        valid: false,
        message: "Choose a desk before adding desktop accessories.",
      };
    }

    const desk = requestedPosition
      ? desks.find((candidate) => isPointOnDesk(position!.x, position!.y, candidate))
      : desks[0];
    if (!desk) {
      return {
        valid: false,
        message: "Place this accessory on the desktop.",
      };
    }

    surface = `desk:${desk.instanceId}`;
  }

  position = { x: snap(position.x), y: snap(position.y) };
  const { footprint } = product.placement;
  const withinBounds =
    position.x >= footprint.width / 2 + 20 &&
    position.x <= CANVAS_WIDTH - footprint.width / 2 - 20 &&
    position.y >= footprint.height / 2 + 20 &&
    position.y <= CANVAS_HEIGHT - footprint.height / 2 - 20;

  if (!withinBounds) {
    return { valid: false, message: "Keep the item inside the workspace." };
  }

  if (
    relevantItems.some((item) =>
      overlaps(product, position!, surface, item),
    )
  ) {
    return {
      valid: false,
      message:
        surface === "floor"
          ? "That spot is occupied. Try another place."
          : "Make a little room on the desktop first.",
    };
  }

  return { valid: true, ...position, surface };
}

export function validateWorkspaceItems(items: PlacedItem[]): boolean {
  const accepted: PlacedItem[] = [];
  const categoryCounts = { desk: 0, chair: 0 };

  for (const item of items) {
    const category = getProduct(item.productId).category;
    if (category === "desk" || category === "chair") {
      categoryCounts[category] += 1;
      if (categoryCounts[category] > 1) {
        return false;
      }
    }

    const placement = evaluatePlacement(
      item.productId,
      accepted,
      { x: item.x, y: item.y },
    );

    if (
      !placement.valid ||
      placement.x !== item.x ||
      placement.y !== item.y ||
      placement.surface !== item.surface
    ) {
      return false;
    }

    accepted.push(item);
  }

  return true;
}
