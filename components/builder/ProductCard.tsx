"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import type { Product } from "../../types/catalog";
import { formatMonthlyPrice } from "../../lib/pricing";

interface ProductCardProps {
  product: Product;
  quantity: number;
  selected: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  onDragStart: (event: PointerEvent<HTMLButtonElement>) => void;
}

export function ProductCard({
  product,
  quantity,
  selected,
  onAdd,
  onRemove,
  onDragStart,
}: ProductCardProps) {
  const isAtLimit = quantity >= product.placement.maxQuantity;
  const isPrimary = product.category !== "accessory";

  return (
    <article className={`product-card${selected ? " is-selected" : ""}`}>
      <div className="product-card-art" aria-hidden="true">
        <Image
          src={product.sprite.src}
          alt=""
          width={product.sprite.width}
          height={product.sprite.height}
          sizes="(max-width: 760px) 36vw, 200px"
          className="product-card-image"
        />
      </div>
      <div className="product-card-copy">
        <div className="product-card-heading">
          <h3>{product.name}</h3>
          {selected && <span className="selected-tag">In your setup</span>}
        </div>
        <p>{product.description}</p>
        <p className="product-price">
          {formatMonthlyPrice(product.monthlyPrice)}
          <span> / month</span>
        </p>
      </div>
      <div className="product-card-actions">
        {isPrimary ? (
          <button
            type="button"
            className={selected ? "button button-quiet" : "button button-dark"}
            onClick={onAdd}
            disabled={selected}
            aria-pressed={selected}
          >
            {selected ? "Selected" : "Choose"}
          </button>
        ) : (
          <>
            {quantity > 0 && onRemove && (
              <button
                type="button"
                className="quantity-button"
                aria-label={`Remove one ${product.name}`}
                onClick={onRemove}
              >
                −
              </button>
            )}
            <span className="product-quantity" aria-label={`${quantity} selected`}>
              {quantity}
            </span>
            <button
              type="button"
              className={quantity > 0 ? "button button-quiet" : "button button-dark"}
              onClick={onAdd}
              disabled={isAtLimit}
              aria-label={isAtLimit ? `${product.name} limit reached` : `Add ${product.name}`}
            >
              {isAtLimit ? "Added" : quantity > 0 ? "Add another" : "Add"}
            </button>
          </>
        )}
        <button
          type="button"
          className="drag-handle"
          onPointerDown={onDragStart}
          aria-label={`Drag ${product.name} into the workspace`}
          title="Drag into the workspace"
        >
          <span aria-hidden="true">⠿</span>
        </button>
      </div>
    </article>
  );
}
