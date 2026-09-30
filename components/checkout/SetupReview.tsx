"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct } from "../../lib/catalog";
import { formatMonthlyPrice, getWorkspaceSummary } from "../../lib/pricing";
import { useWorkspaceStore } from "../../lib/workspace-store";

export function SetupReview() {
  const items = useWorkspaceStore((state) => state.items);
  const summary = getWorkspaceSummary(items);

  if (!items.length) {
    return (
      <section className="review-empty">
        <span className="review-empty-mark" aria-hidden="true">⌑</span>
        <h2>Your workspace is waiting for its first piece.</h2>
        <p>Choose the items you need, then come back to review your setup.</p>
        <Link href="/" className="button button-dark">Back to the builder</Link>
      </section>
    );
  }

  return (
    <section className="review-card" aria-labelledby="review-title">
      <div className="review-card-heading">
        <div>
          <span className="eyebrow">Before you send</span>
          <h2 id="review-title">Your workspace</h2>
        </div>
        <Link href="/" className="text-link">Edit setup <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="review-scene" aria-label={`${summary.itemCount} selected workspace items`}>
        <div className="review-scene-floor" aria-hidden="true" />
        {items.map((item) => {
          const product = getProduct(item.productId);
          return (
            <div
              key={item.instanceId}
              className="review-scene-item"
              style={{
                left: `${(item.x / 1200) * 100}%`,
                top: `${(item.y / 760) * 100}%`,
                width: `${(product.sprite.renderWidth / 1200) * 100}%`,
                aspectRatio: `${product.sprite.width} / ${product.sprite.height}`,
                transform: `translate(-${product.sprite.anchor.x * 100}%, -${product.sprite.anchor.y * 100}%)`,
              }}
              aria-hidden="true"
            >
              <Image
                src={product.sprite.src}
                alt=""
                fill
                sizes="(max-width: 760px) 40vw, 20vw"
                className="scene-item-image"
              />
            </div>
          );
        })}
      </div>

      <ul className="review-lines">
        {summary.items.map((item) => (
          <li key={item.productId}>
            <span>{item.name}<small> × {item.quantity}</small></span>
            <strong>{formatMonthlyPrice(item.lineTotal)}<small> / mo</small></strong>
          </li>
        ))}
      </ul>

      <div className="review-total">
        <span>Estimated monthly total</span>
        <strong>{formatMonthlyPrice(summary.monthlyTotal)}</strong>
      </div>
      <p className="review-footnote">
        This estimate reflects the items selected. Delivery and final availability are confirmed with you afterward.
      </p>
    </section>
  );
}
