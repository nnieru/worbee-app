import { create } from "zustand";
import { getProduct } from "./catalog";
import { evaluatePlacement, type CanvasPoint } from "./placement";
import type { ProductCategory, ProductId } from "../types/catalog";
import type { PlacedItem } from "../types/workspace";

interface WorkspaceState {
  items: PlacedItem[];
  activeCategory: ProductCategory;
  selectedItemId: string | null;
  statusMessage: string;
  persistenceMessage: string;
  undoItems: PlacedItem[] | null;
  undoLabel: string;
  setActiveCategory: (category: ProductCategory) => void;
  setStatusMessage: (message: string) => void;
  setPersistenceMessage: (message: string) => void;
  selectItem: (instanceId: string | null) => void;
  placeProduct: (productId: ProductId, position?: CanvasPoint) => boolean;
  moveItem: (instanceId: string, position: CanvasPoint) => boolean;
  removeItem: (instanceId: string) => void;
  reset: () => void;
  surpriseMe: () => void;
  undo: () => void;
  restoreItems: (items: PlacedItem[]) => void;
}

function createInstanceId(productId: ProductId): string {
  return globalThis.crypto?.randomUUID?.() ??
    `${productId}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function makeItem(
  productId: ProductId,
  x: number,
  y: number,
  surface: PlacedItem["surface"],
  instanceId = createInstanceId(productId),
): PlacedItem {
  return { instanceId, productId, x, y, surface };
}

function reattachDeskAccessories(
  previousItems: PlacedItem[],
  deskInstanceId: string,
  nextItems: PlacedItem[],
): PlacedItem[] {
  const accessories = previousItems.filter((item) =>
    item.surface.startsWith("desk:"),
  );
  let result = nextItems;

  for (const accessory of accessories) {
    const placement = evaluatePlacement(accessory.productId, result);
    if (placement.valid) {
      result = [
        ...result,
        {
          ...accessory,
          x: placement.x,
          y: placement.y,
          surface: `desk:${deskInstanceId}`,
        },
      ];
    }
  }

  return result;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  items: [],
  activeCategory: "desk",
  selectedItemId: null,
  statusMessage: "Choose a desk to start your setup.",
  persistenceMessage: "",
  undoItems: null,
  undoLabel: "",

  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setPersistenceMessage: (persistenceMessage) => set({ persistenceMessage }),
  selectItem: (selectedItemId) => set({ selectedItemId }),

  placeProduct: (productId, requestedPosition) => {
    const { items } = get();
    const placement = evaluatePlacement(productId, items, requestedPosition);

    if (!placement.valid) {
      set({ statusMessage: placement.message });
      return false;
    }

    const product = getProduct(productId);
    const isPrimary = product.category !== "accessory";
    const replaced = isPrimary
      ? items.some((item) => getProduct(item.productId).category === product.category)
      : false;
    const undoItems = replaced ? items : null;
    const itemsWithoutCategory = isPrimary
      ? items.filter((item) => {
          const existingCategory = getProduct(item.productId).category;
          return (
            existingCategory !== product.category &&
            !(product.category === "desk" && item.surface.startsWith("desk:"))
          );
        })
      : items;
    const instanceId = createInstanceId(productId);
    const nextItem = makeItem(productId, placement.x, placement.y, placement.surface, instanceId);
    let nextItems = [...itemsWithoutCategory, nextItem];

    if (product.category === "desk") {
      nextItems = reattachDeskAccessories(items, instanceId, nextItems);
    }

    set({
      items: nextItems,
      selectedItemId: instanceId,
      statusMessage: replaced
        ? `${product.name} selected. Undo is available.`
        : `${product.name} added to your setup.`,
      undoItems,
      undoLabel: replaced ? "Previous setup restored." : "",
    });
    return true;
  },

  moveItem: (instanceId, position) => {
    const { items } = get();
    const item = items.find((candidate) => candidate.instanceId === instanceId);
    if (!item) {
      return false;
    }

    const placement = evaluatePlacement(item.productId, items, position, instanceId);
    if (!placement.valid) {
      set({ statusMessage: placement.message });
      return false;
    }

    set({
      items: items.map((candidate) =>
        candidate.instanceId === instanceId
          ? { ...candidate, x: placement.x, y: placement.y, surface: placement.surface }
          : candidate,
      ),
      statusMessage: `${getProduct(item.productId).name} moved.`,
    });
    return true;
  },

  removeItem: (instanceId) => {
    const { items } = get();
    const item = items.find((candidate) => candidate.instanceId === instanceId);
    if (!item) {
      return;
    }

    const removed = items.filter((candidate) => candidate.instanceId !== instanceId);
    const removesDesk = getProduct(item.productId).category === "desk";
    const nextItems = removesDesk
      ? removed.filter((candidate) => !candidate.surface.startsWith("desk:"))
      : removed;

    set({
      items: nextItems,
      selectedItemId: null,
      statusMessage: `${getProduct(item.productId).name} removed. Undo is available.`,
      undoItems: items,
      undoLabel: "Removed items restored.",
    });
  },

  reset: () => {
    const { items } = get();
    if (items.length === 0) {
      set({ statusMessage: "Your workspace is already empty." });
      return;
    }

    set({
      items: [],
      selectedItemId: null,
      statusMessage: "Workspace reset. Undo is available.",
      undoItems: items,
      undoLabel: "Workspace restored.",
    });
  },

  surpriseMe: () => {
    const deskId = createInstanceId("desk-compact");
    const nextItems = [
      makeItem("desk-compact", 600, 470, "floor", deskId),
      makeItem("chair-task", 600, 610, "floor"),
      makeItem("monitor", 530, 160, `desk:${deskId}`),
      makeItem("keyboard-mouse", 605, 240, `desk:${deskId}`),
      makeItem("lamp", 765, 160, `desk:${deskId}`),
      makeItem("plant-floor", 965, 610, "floor"),
    ];

    set({
      items: nextItems,
      selectedItemId: null,
      statusMessage: "A ready-to-work setup is in place. Adjust anything you like.",
      undoItems: get().items,
      undoLabel: "Previous setup restored.",
    });
  },

  undo: () => {
    const { undoItems, undoLabel } = get();
    if (!undoItems) {
      return;
    }

    set({
      items: undoItems,
      selectedItemId: null,
      statusMessage: undoLabel,
      undoItems: null,
      undoLabel: "",
    });
  },

  restoreItems: (items) =>
    set({
      items,
      selectedItemId: null,
      statusMessage: items.length
        ? "Your saved workspace is ready."
        : "Choose a desk to start your setup.",
      undoItems: null,
      undoLabel: "",
    }),
}));
