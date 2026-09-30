"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { getProduct, getProductsByCategory } from "../../lib/catalog";
import type { ProductCategory, ProductId } from "../../types/catalog";
import { useWorkspaceStore } from "../../lib/workspace-store";
import type { PlacedItem } from "../../types/workspace";
import { ProductCard } from "./ProductCard";

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "desk", label: "Desks" },
  { id: "chair", label: "Chairs" },
  { id: "accessory", label: "Accessories" },
];

interface ProductTrayProps {
  items: PlacedItem[];
  onProductDragStart: (
    productId: ProductId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
}

export function ProductTray({ items, onProductDragStart }: ProductTrayProps) {
  const activeCategory = useWorkspaceStore((state) => state.activeCategory);
  const setActiveCategory = useWorkspaceStore((state) => state.setActiveCategory);
  const placeProduct = useWorkspaceStore((state) => state.placeProduct);
  const removeItem = useWorkspaceStore((state) => state.removeItem);

  function getCount(productId: ProductId): number {
    return items.filter((item) => item.productId === productId).length;
  }

  function handleAdd(productId: ProductId) {
    placeProduct(productId);
  }

  function handleRemove(productId: ProductId) {
    const item = [...items].reverse().find((candidate) => candidate.productId === productId);
    if (item) {
      removeItem(item.instanceId);
    }
  }

  function handleCategoryKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % CATEGORIES.length
        : event.key === "ArrowLeft"
          ? (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? CATEGORIES.length - 1
              : null;

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextCategory = CATEGORIES[nextIndex];
    setActiveCategory(nextCategory.id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      .item(nextIndex)
      ?.focus();
  }

  const products = getProductsByCategory(activeCategory);
  const categoryCount = items.filter(
    (item) => getProduct(item.productId).category === "accessory",
  ).length;

  return (
    <aside className="product-tray" aria-label="Workspace products">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Build your setup</span>
          <h2>Choose pieces</h2>
        </div>
        <span className="item-count-badge">{items.length} items</span>
      </div>

      <div className="category-tabs" role="tablist" aria-label="Product categories">
        {CATEGORIES.map((category, index) => {
          const isActive = activeCategory === category.id;
          const count = category.id === "accessory" ? categoryCount : 0;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={isActive}
              aria-controls="product-options"
              tabIndex={isActive ? 0 : -1}
              className={`category-tab${isActive ? " is-active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
              onKeyDown={(event) => handleCategoryKeyDown(event, index)}
            >
              {category.label}
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>

      <div
        className="product-list"
        id="product-options"
        role="tabpanel"
        aria-labelledby={`tab-${activeCategory}`}
      >
        {products.map((product) => {
          const quantity = getCount(product.id);
          const selected = quantity > 0;
          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              selected={selected}
              onAdd={() => handleAdd(product.id)}
              onRemove={() => handleRemove(product.id)}
              onDragStart={(event) => onProductDragStart(product.id, event)}
            />
          );
        })}
      </div>

      <p className="tray-hint">
        Choose an item to place it, or use the grip to drag it onto the workspace.
      </p>
    </aside>
  );
}
