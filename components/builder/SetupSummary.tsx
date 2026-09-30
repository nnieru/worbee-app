"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct } from "../../lib/catalog";
import { formatMonthlyPrice, getWorkspaceSummary } from "../../lib/pricing";
import { useWorkspaceStore } from "../../lib/workspace-store";
import type { PlacedItem } from "../../types/workspace";

interface SetupSummaryProps {
  items: PlacedItem[];
}

function ReviewAction({ hasItems }: { hasItems: boolean }) {
  if (!hasItems) {
    return (
      <button type="button" className="button button-dark review-button" disabled>
        Add an item to continue
      </button>
    );
  }

  return (
    <Link href="/checkout" className="button button-dark review-button">
      Review setup <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function SetupSummary({ items }: SetupSummaryProps) {
  const undo = useWorkspaceStore((state) => state.undo);
  const undoItems = useWorkspaceStore((state) => state.undoItems);
  const undoLabel = useWorkspaceStore((state) => state.undoLabel);
  const summary = getWorkspaceSummary(items);

  return (
    <>
      <aside className="setup-summary" aria-label="Workspace summary">
        <div className="panel-heading summary-heading">
          <div>
            <span className="eyebrow">Your selection</span>
            <h2>Setup summary</h2>
          </div>
          <span className="item-count-badge">{summary.itemCount}</span>
        </div>

        {summary.items.length ? (
          <ul className="summary-list">
            {summary.items.map((item) => {
              const product = getProduct(item.productId);
              return (
                <li className="summary-row" key={item.productId}>
                  <div className="summary-art" aria-hidden="true">
                    <Image
                      src={product.sprite.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="summary-image"
                    />
                  </div>
                  <div className="summary-row-copy">
                    <span>{item.name}</span>
                    <small>Qty {item.quantity}</small>
                  </div>
                  <span className="summary-line-total">
                    {formatMonthlyPrice(item.lineTotal)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="summary-empty">
            <span aria-hidden="true">⌑</span>
            <p>Your setup will take shape here.</p>
            <small>Choose a desk or chair to begin.</small>
          </div>
        )}

        <div className="summary-total">
          <span>Estimated monthly total</span>
          <strong>{formatMonthlyPrice(summary.monthlyTotal)}</strong>
        </div>
        <p className="delivery-note">
          Delivery and setup details are confirmed after we review your enquiry.
        </p>
        <ReviewAction hasItems={items.length > 0} />

        {undoItems && (
          <button type="button" className="undo-button" onClick={undo}>
            {undoLabel || "Undo last change"}
          </button>
        )}
      </aside>

      <div className="mobile-summary" aria-label="Workspace total">
        <div className="mobile-summary-copy">
          <span>{summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}</span>
          <strong>{formatMonthlyPrice(summary.monthlyTotal)}<small> / mo</small></strong>
        </div>
        <ReviewAction hasItems={items.length > 0} />
      </div>
    </>
  );
}
